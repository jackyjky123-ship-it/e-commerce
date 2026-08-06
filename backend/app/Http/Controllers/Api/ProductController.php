<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['category:id,name,slug', 'images'])
            ->active();

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $category = $request->string('category');
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($request->boolean('on_sale')) {
            $query->whereNotNull('old_price')->whereColumn('old_price', '>', 'price');
        }

        if ($min = $request->float('min_price')) {
            $query->where('price', '>=', $min);
        }

        if ($max = $request->float('max_price')) {
            $query->where('price', '<=', $max);
        }

        $sort = $request->string('sort')->toString();

        $query->when($sort === 'price_asc', fn ($q) => $q->orderBy('price'))
            ->when($sort === 'price_desc', fn ($q) => $q->orderByDesc('price'))
            ->when($sort === 'newest', fn ($q) => $q->orderByDesc('created_at'))
            ->when($sort === 'rating', fn ($q) => $q->orderByDesc('rating'))
            ->when(! in_array($sort, ['price_asc', 'price_desc', 'newest', 'rating']), fn ($q) => $q->orderByDesc('created_at'));

        $products = $query->paginate($request->integer('per_page', 12))
            ->withQueryString();

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

    public function show(Product $product): JsonResponse
    {
        $product->load(['category:id,name,slug', 'images', 'variants']);

        return response()->json(['data' => $product]);
    }

    public function categories(): JsonResponse
    {
        $categories = Category::active()
            ->withCount(['products' => fn ($q) => $q->active()])
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $categories]);
    }
}