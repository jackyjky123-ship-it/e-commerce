<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json(['data' => $orders]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_if($order->user_id !== $request->user()->id, 403, 'Unauthorized.');

        $order->load('items');

        return response()->json(['data' => $order]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_name' => ['required', 'string', 'max:255'],
            'shipping_email' => ['required', 'email'],
            'shipping_phone' => ['nullable', 'string', 'max:30'],
            'shipping_street' => ['required', 'string', 'max:255'],
            'shipping_city' => ['required', 'string', 'max:255'],
            'shipping_state' => ['nullable', 'string', 'max:255'],
            'shipping_postal_code' => ['nullable', 'string', 'max:20'],
            'shipping_country' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', 'in:cash_on_delivery,card,gcash'],
            'notes' => ['nullable', 'string'],
        ]);

        $cart = Cart::where('user_id', $request->user()->id)->with('items')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 422);
        }

        foreach ($cart->items as $item) {
            $available = $item->variant_id ? $item->variant->stock : $item->product->stock;
            if ($item->quantity > $available) {
                return response()->json([
                    'message' => "{$item->product->name} only has {$available} unit(s) left.",
                ], 422);
            }
        }

        $subtotal = $cart->subtotal;
        $shippingCost = $subtotal >= 1500 ? 0 : 99;
        $total = $subtotal + $shippingCost;

        try {
            $order = DB::transaction(function () use ($request, $cart, $subtotal, $shippingCost, $total) {
                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'order_number' => Order::generateOrderNumber(),
                    'status' => Order::STATUS_PENDING,
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'shipping_name' => $request->input('shipping_name'),
                    'shipping_email' => $request->input('shipping_email'),
                    'shipping_phone' => $request->input('shipping_phone'),
                    'shipping_street' => $request->input('shipping_street'),
                    'shipping_city' => $request->input('shipping_city'),
                    'shipping_state' => $request->input('shipping_state'),
                    'shipping_postal_code' => $request->input('shipping_postal_code'),
                    'shipping_country' => $request->input('shipping_country') ?? 'Philippines',
                    'payment_method' => $request->input('payment_method'),
                    'payment_status' => $request->input('payment_method') === 'cash_on_delivery' ? 'cash_on_delivery' : 'paid',
                    'notes' => $request->input('notes'),
                ]);

                foreach ($cart->items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name,
                        'product_image' => $item->product->primary_image_url,
                        'variant_label' => $item->variant?->label,
                        'unit_price' => $item->unit_price,
                        'quantity' => $item->quantity,
                        'total' => $item->line_total,
                    ]);

                    if ($item->variant_id) {
                        $item->variant->decrement('stock', $item->quantity);
                    } else {
                        $item->product->decrement('stock', $item->quantity);
                    }
                }

                $cart->items()->delete();

                return $order;
            });

            return response()->json([
                'message' => 'Order placed successfully.',
                'data' => $order->load('items'),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Something went wrong placing your order.'], 500);
        }
    }
}