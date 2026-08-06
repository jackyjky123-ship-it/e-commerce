<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalSales = (float) Order::where('payment_status', 'paid')->sum('total');
        $totalOrders = Order::count();
        $activeUsers = User::where('role', 'user')->count();
        $products = Product::count();
        $lowStockProducts = Product::where('stock', '>', 0)->where('stock', '<=', 5)->orderBy('stock')->take(8)->get();
        $outOfStockProducts = Product::where('stock', 0)->count();
        $recentOrders = Order::with('user:id,name')->orderByDesc('created_at')->take(5)->get();

        $statusCounts = Order::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $monthlySales = Order::where('created_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'data' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'active_users' => $activeUsers,
                'total_products' => $products,
                'out_of_stock' => $outOfStockProducts,
                'low_stock_products' => $lowStockProducts,
                'recent_orders' => $recentOrders,
                'orders_by_status' => $statusCounts,
                'monthly_sales' => $monthlySales,
            ],
        ]);
    }
}