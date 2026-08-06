<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    private function resolveCart(Request $request): Cart
    {
        $user = $request->user() ?? auth('sanctum')->user();

        if ($user) {
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        $token = $request->header('X-Cart-Token') ?? Str::uuid()->toString();

        return Cart::firstOrCreate(
            ['session_token' => $token],
            ['session_token' => $token]
        );
    }

    public function show(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request);

        $cart->load(['items.product' => fn ($q) => $q->with(['images', 'category:id,name,slug']), 'items.variant']);

        return response()->json([
            'data' => [
                'id' => $cart->id,
                'items' => $cart->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'sku' => $item->product->sku,
                        'price' => $item->product->price,
                        'stock' => $item->product->stock,
                        'image' => $item->product->primary_image_url,
                    ],
                    'variant' => $item->variant ? [
                        'id' => $item->variant->id,
                        'label' => $item->variant->label,
                    ] : null,
                ]),
                'subtotal' => $cart->subtotal,
                'count' => $cart->count,
                'session_token' => $cart->session_token,
            ],
        ]);
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'variant_id' => ['nullable', 'exists:product_variants,id'],
        ]);

        $product = Product::active()->findOrFail($validated['product_id']);
        $cart = $this->resolveCart($request);

        $quantity = $validated['quantity'];
        $variantId = $validated['variant_id'] ?? null;

        $stock = $product->stock;
        if ($variantId) {
            $variant = ProductVariant::find($variantId);
            $stock = $variant?->stock ?? 0;
        }

        if ($quantity > $stock) {
            return response()->json([
                'message' => "Only {$stock} unit(s) available in stock.",
            ], 422);
        }

        $item = $cart->items()
            ->where('product_id', $product->id)
            ->where('variant_id', $variantId)
            ->first();

        $unitPrice = $product->price + ($variantId ? (ProductVariant::find($variantId)->price_adjustment ?? 0) : 0);

        if ($item) {
            $newQty = $item->quantity + $quantity;
            if ($newQty > $stock) {
                return response()->json([
                    'message' => "Only {$stock} unit(s) available in stock.",
                ], 422);
            }
            $item->update(['quantity' => $newQty]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'variant_id' => $variantId,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart.',
            'cart' => $this->cartPayload($cart),
        ]);
    }

    public function update(Request $request, CartItem $item): JsonResponse
    {
        $this->authorizeItem($request, $item);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $stock = $item->product->stock;
        if ($item->variant_id) {
            $stock = $item->variant?->stock ?? 0;
        }

        if ($validated['quantity'] > $stock) {
            return response()->json([
                'message' => "Only {$stock} unit(s) available in stock.",
            ], 422);
        }

        $item->update(['quantity' => $validated['quantity']]);

        return response()->json([
            'message' => 'Cart updated.',
            'cart' => $this->cartPayload($item->cart),
        ]);
    }

    public function remove(Request $request, CartItem $item): JsonResponse
    {
        $this->authorizeItem($request, $item);

        $item->delete();

        return response()->json([
            'message' => 'Item removed from cart.',
            'cart' => $this->cartPayload($item->cart()->first()),
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request);
        $cart->items()->delete();

        return response()->json(['message' => 'Cart cleared.']);
    }

    public function merge(Request $request): JsonResponse
    {
        $request->validate([
            'session_token' => ['required', 'string'],
        ]);

        $user = $request->user();
        $guest = Cart::where('session_token', $request->input('session_token'))->first();

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        if ($guest && $guest->id !== $cart->id) {
            foreach ($guest->items as $guestItem) {
                $existing = $cart->items()
                    ->where('product_id', $guestItem->product_id)
                    ->where('variant_id', $guestItem->variant_id)
                    ->first();

                if ($existing) {
                    $existing->update([
                        'quantity' => $existing->quantity + $guestItem->quantity,
                    ]);
                } else {
                    $guestItem->update(['cart_id' => $cart->id]);
                }
            }
            $guest->delete();
        }

        return response()->json([
            'message' => 'Cart merged.',
            'cart' => $this->cartPayload($cart),
        ]);
    }

    private function authorizeItem(Request $request, CartItem $item): void
    {
        $cart = $this->resolveCart($request);
        abort_if($item->cart_id !== $cart->id, 403, 'This item does not belong to your cart.');
    }

    private function cartPayload(Cart $cart): array
    {
        $cart->load(['items.product.images', 'items.variant']);

        return [
            'id' => $cart->id,
            'items' => $cart->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'variant_id' => $item->variant_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'line_total' => $item->line_total,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'image' => $item->product->primary_image_url,
                ],
                'variant' => $item->variant ? ['id' => $item->variant->id, 'label' => $item->variant->label] : null,
            ]),
            'subtotal' => $cart->subtotal,
            'count' => $cart->count,
        ];
    }
}