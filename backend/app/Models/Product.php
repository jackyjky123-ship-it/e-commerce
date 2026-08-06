<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'price', 'old_price',
        'sku', 'brand', 'features', 'stock', 'rating', 'active',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'float',
        'old_price' => 'float',
        'stock' => 'integer',
        'rating' => 'float',
        'active' => 'boolean',
    ];

    protected $appends = [
        'primary_image_url',
        'has_discount',
        'discount_percent',
        'in_stock',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function primaryImage(): ?ProductImage
    {
        return $this->images->firstWhere('is_primary', true) ?? $this->images->first();
    }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        return $this->primaryImage()?->url;
    }

    public function getHasDiscountAttribute(): bool
    {
        return $this->old_price && $this->old_price > $this->price;
    }

    public function getDiscountPercentAttribute(): int
    {
        if (! $this->has_discount) {
            return 0;
        }
        return (int) round((($this->old_price - $this->price) / $this->old_price) * 100);
    }

    public function getInStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}