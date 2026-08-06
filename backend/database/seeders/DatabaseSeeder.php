<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'phone' => '09171234567',
        ]);

        $user = User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'user@example.com',
            'password' => 'password',
            'role' => 'user',
            'phone' => '09170000001',
            'street' => '123 Mabini St.',
            'city' => 'Manila',
            'state' => 'Metro Manila',
            'postal_code' => '1000',
            'country' => 'Philippines',
        ]);

        $categories = collect([
            ['name' => 'Electronics', 'description' => 'Gadgets, audio, and accessories for everyday tech.'],
            ['name' => 'Fashion', 'description' => 'Apparel and accessories for men and women.'],
            ['name' => 'Home & Living', 'description' => 'Decor, kitchenware, and comfort for your space.'],
            ['name' => 'Sports & Outdoors', 'description' => 'Gear for fitness, travel, and adventure.'],
            ['name' => 'Beauty & Health', 'description' => 'Skincare, wellness, and self-care essentials.'],
        ])->map(fn ($c) => Category::create($c + ['slug' => \Illuminate\Support\Str::slug($c['name'])]));

        $products = [
            [
                'category' => 'Electronics',
                'name' => 'Wireless Noise-Cancelling Headphones',
                'price' => 4999.99, 'old_price' => 6999.99, 'stock' => 24, 'brand' => 'SonicWave',
                'features' => ['Active noise cancellation', '40h battery life', 'Bluetooth 5.3', 'Built-in mic'],
                'variants' => [
                    ['Size', 'Standard', 0, 24],
                ],
            ],
            [
                'category' => 'Electronics',
                'name' => 'Smart Fitness Watch',
                'price' => 2499.00, 'old_price' => 3299.00, 'stock' => 40, 'brand' => 'PulseTrack',
                'features' => ['Heart rate monitoring', 'GPS tracking', '5ATM water resistant'],
                'variants' => [
                    ['Color', 'Black', 0, 20],
                    ['Color', 'Rose Gold', 100, 20],
                ],
            ],
            [
                'category' => 'Electronics',
                'name' => 'Mechanical Keyboard 75%',
                'price' => 3299.50, 'old_price' => null, 'stock' => 3, 'brand' => 'Keyforge',
                'features' => ['Hot-swappable switches', 'RGB backlight', 'Aluminum frame'],
                'variants' => [
                    ['Switch', 'Red Linear', 0, 2],
                    ['Switch', 'Blue Tactile', -200, 1],
                ],
            ],
            [
                'category' => 'Fashion',
                'name' => 'Classic Denim Jacket',
                'price' => 1899.00, 'old_price' => 2399.00, 'stock' => 35, 'brand' => 'UrbanThread',
                'features' => ['100% cotton denim', 'Classic fit', 'Durable stitching'],
                'variants' => [
                    ['Size', 'S', 0, 8],
                    ['Size', 'M', 0, 12],
                    ['Size', 'L', 0, 10],
                    ['Size', 'XL', 50, 5],
                ],
            ],
            [
                'category' => 'Fashion',
                'name' => 'Leather Crossbody Bag',
                'price' => 1499.75, 'old_price' => 1999.00, 'stock' => 18, 'brand' => 'UrbanThread',
                'features' => ['Genuine leather', 'Adjustable strap', 'Multiple compartments'],
            ],
            [
                'category' => 'Fashion',
                'name' => 'Everyday Cotton Tee (3-Pack)',
                'price' => 999.00, 'old_price' => null, 'stock' => 60, 'brand' => 'BasicBout',
                'features' => ['Soft combed cotton', 'Pre-shrunk', 'Machine washable'],
                'variants' => [
                    ['Size', 'M', 0, 20],
                    ['Size', 'L', 0, 20],
                    ['Size', 'XL', 0, 20],
                ],
            ],
            [
                'category' => 'Home & Living',
                'name' => 'Ceramic Pour-Over Coffee Set',
                'price' => 1299.00, 'old_price' => 1599.00, 'stock' => 12, 'brand' => 'BrewHouse',
                'features' => ['Hand-glazed ceramic', '2-cup capacity', 'Includes wooden stand'],
            ],
            [
                'category' => 'Home & Living',
                'name' => 'Scented Soy Candle - Vanilla & Cedar',
                'price' => 449.00, 'old_price' => null, 'stock' => 8, 'brand' => 'GlowHome',
                'features' => ['40h burn time', 'Soy wax blend', 'Reusable glass jar'],
                'variants' => [
                    ['Size', 'Small', 0, 4],
                    ['Size', 'Large', 250, 4],
                ],
            ],
            [
                'category' => 'Sports & Outdoors',
                'name' => 'Yoga Mat Pro - Non-Slip',
                'price' => 1099.00, 'old_price' => 1399.00, 'stock' => 30, 'brand' => 'FlexFit',
                'features' => ['6mm thickness', 'TPE material', 'Carrying strap included'],
                'variants' => [
                    ['Color', 'Teal', 0, 15],
                    ['Color', 'Graphite', 0, 15],
                ],
            ],
            [
                'category' => 'Sports & Outdoors',
                'name' => 'Insulated Steel Water Bottle 1L',
                'price' => 749.50, 'old_price' => 899.00, 'stock' => 0, 'brand' => 'FlexFit',
                'features' => ['Keeps cold 24h / hot 12h', 'BPA-free', 'Leak-proof lid'],
            ],
            [
                'category' => 'Beauty & Health',
                'name' => 'Vitamin C Brightening Serum',
                'price' => 899.00, 'old_price' => 1199.00, 'stock' => 25, 'brand' => 'LumièreSkin',
                'features' => ['10% Vitamin C', 'Hyaluronic acid', 'Cruelty-free'],
            ],
            [
                'category' => 'Beauty & Health',
                'name' => 'Aromatherapy Essential Oil Diffuser',
                'price' => 1299.00, 'old_price' => null, 'stock' => 5, 'brand' => 'LumièreSkin',
                'features' => ['Ultrasonic mist', '7-color LED', 'Auto shut-off'],
            ],
        ];

        foreach ($products as $i => $p) {
            $category = $categories->firstWhere('name', $p['category']);

            $product = Product::create([
                'category_id' => $category->id,
                'name' => $p['name'],
                'slug' => \Illuminate\Support\Str::slug($p['name']),
                'description' => "The {$p['name']} from {$p['brand']} is crafted for quality and everyday performance. " .
                    'Perfect for gifting or treating yourself.',
                'price' => $p['price'],
                'old_price' => $p['old_price'],
                'sku' => 'SKU-' . str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                'brand' => $p['brand'],
                'features' => $p['features'],
                'stock' => $p['stock'],
                'rating' => round(3.5 + ($i % 5) * 0.3, 1),
                'active' => true,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'url' => "https://picsum.photos/seed/{$product->slug}/800/800",
                'is_primary' => true,
                'sort_order' => 0,
            ]);
            ProductImage::create([
                'product_id' => $product->id,
                'url' => "https://picsum.photos/seed/{$product->slug}-2/800/800",
                'is_primary' => false,
                'sort_order' => 1,
            ]);

            foreach ($p['variants'] ?? [] as [$optionName, $optionValue, $adj, $stock]) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'option_name' => $optionName,
                    'option_value' => $optionValue,
                    'price_adjustment' => $adj,
                    'stock' => $stock,
                ]);
            }
        }

        $sampleOrder = Order::create([
            'user_id' => $user->id,
            'order_number' => Order::generateOrderNumber(),
            'status' => 'delivered',
            'subtotal' => 7298.99,
            'shipping_cost' => 0,
            'total' => 7298.99,
            'shipping_name' => $user->name,
            'shipping_email' => $user->email,
            'shipping_phone' => $user->phone,
            'shipping_street' => $user->street,
            'shipping_city' => $user->city,
            'shipping_state' => $user->state,
            'shipping_postal_code' => $user->postal_code,
            'shipping_country' => $user->country,
            'payment_method' => 'card',
            'payment_status' => 'paid',
        ]);

        $headphones = Product::where('name', 'Wireless Noise-Cancelling Headphones')->first();
        $jacket = Product::where('name', 'Classic Denim Jacket')->first();

        OrderItem::create([
            'order_id' => $sampleOrder->id,
            'product_id' => $headphones->id,
            'product_name' => $headphones->name,
            'product_image' => $headphones->primary_image_url,
            'variant_label' => null,
            'unit_price' => 4999.99,
            'quantity' => 1,
            'total' => 4999.99,
        ]);
        OrderItem::create([
            'order_id' => $sampleOrder->id,
            'product_id' => $jacket->id,
            'product_name' => $jacket->name,
            'product_image' => $jacket->primary_image_url,
            'variant_label' => 'Size: L',
            'unit_price' => 1899.00,
            'quantity' => 1,
            'total' => 1899.00,
        ]);

        $this->command->info('Seeded admin: admin@example.com / password');
        $this->command->info('Seeded user: user@example.com / password');
    }
}