<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')->orderBy('name')->get();

        return response()->json(['data' => $categories]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'active' => ['sometimes', 'boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        while (Category::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] .= '-' . Str::lower(Str::random(4));
        }
        $validated['active'] = $request->boolean('active', true);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, int $category): JsonResponse
    {
        $category = Category::findOrFail($category);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'active' => ['sometimes', 'boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        while (Category::where('slug', $validated['slug'])->where('id', '!=', $category->id)->exists()) {
            $validated['slug'] .= '-' . Str::lower(Str::random(4));
        }
        $validated['active'] = $request->boolean('active', true);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated.',
            'data' => $category,
        ]);
    }

    public function destroy(int $category): JsonResponse
    {
        $category = Category::findOrFail($category);

        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that still has products.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}