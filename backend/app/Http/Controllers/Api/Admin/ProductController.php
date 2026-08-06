<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category:id,name,slug', 'images']);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($category = $request->integer('category_id')) {
            $query->where('category_id', $category);
        }

        $products = $query->orderByDesc('created_at')->paginate(12)->withQueryString();

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'brand' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'active' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
            'extra_images.*' => ['nullable', 'image', 'max:4096'],
            'features' => ['nullable', 'array'],
        ]);

        $validated['features'] = $this->decodeFeatures($request->input('features'));
        $validated['slug'] = Product::where('slug', $slug = Str::slug($request->input('name')))->exists()
            ? $slug . '-' . Str::lower(Str::random(5))
            : $slug;
        $validated['active'] = $request->boolean('active', true);

        $product = Product::create($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->images()->create([
                'url' => Storage::url($path),
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        if ($request->hasFile('extra_images')) {
            $sort = 1;
            foreach ($request->file('extra_images') as $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'url' => Storage::url($path),
                    'is_primary' => false,
                    'sort_order' => $sort++,
                ]);
            }
        }

        $product->load('images', 'category');

        return response()->json([
            'message' => 'Product created.',
            'data' => $product,
        ], 201);
    }

    public function show(int $product): JsonResponse
    {
        return response()->json([
            'data' => Product::with(['images', 'variants', 'category'])->findOrFail($product),
        ]);
    }

    public function update(Request $request, int $product): JsonResponse
    {
        $product = Product::findOrFail($product);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku,' . $product->id],
            'category_id' => ['nullable', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'brand' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'active' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
            'features' => ['nullable', 'array'],
        ]);

        $validated['features'] = $this->decodeFeatures($request->input('features'));
        $validated['active'] = $request->boolean('active', true);
        $product->update($validated);

        if ($request->hasFile('image')) {
            $oldPrimary = $product->images()->where('is_primary', true)->first();
            if ($oldPrimary) {
                Storage::disk('public')->delete(str_replace('storage/', '', $oldPrimary->url));
                $oldPrimary->delete();
            }

            $path = $request->file('image')->store('products', 'public');
            $product->images()->create([
                'url' => Storage::url($path),
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        $product->load('images', 'category');

        return response()->json([
            'message' => 'Product updated.',
            'data' => $product,
        ]);
    }

    public function destroy(int $product): JsonResponse
    {
        $product = Product::findOrFail($product);

        foreach ($product->images as $image) {
            Storage::disk('public')->delete(str_replace('storage/', '', $image->url));
        }
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }

    private function decodeFeatures(?array $features): ?array
    {
        return $features ? array_values(array_filter(array_map('trim', $features))) : null;
    }

    public function addVariant(Request $request, int $product): JsonResponse
    {
        $product = Product::findOrFail($product);

        $validated = $request->validate([
            'option_name' => ['required', 'string', 'max:255'],
            'option_value' => ['required', 'string', 'max:255'],
            'price_adjustment' => ['nullable', 'numeric'],
            'stock' => ['nullable', 'integer', 'min:0'],
        ]);

        $variant = $product->variants()->create($validated);

        return response()->json([
            'message' => 'Variant added.',
            'data' => $variant,
        ], 201);
    }

    public function updateVariant(Request $request, int $product, int $variantId): JsonResponse
    {
        $product = Product::findOrFail($product);

        $variant = $product->variants()->findOrFail($variantId);

        $variant->update($request->validate([
            'option_name' => ['required', 'string', 'max:255'],
            'option_value' => ['required', 'string', 'max:255'],
            'price_adjustment' => ['nullable', 'numeric'],
            'stock' => ['nullable', 'integer', 'min:0'],
        ]));

        return response()->json(['message' => 'Variant updated.', 'data' => $variant]);
    }

    public function destroyVariant(int $product, int $variantId): JsonResponse
    {
        $variant = Product::findOrFail($product)->variants()->findOrFail($variantId);
        $variant->delete();

        return response()->json(['message' => 'Variant removed.']);
    }
}