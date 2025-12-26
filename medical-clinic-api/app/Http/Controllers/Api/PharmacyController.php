<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PharmacyController extends Controller
{
    private array $medications = [
        ['id' => 1, 'name' => 'Paracetamol 500mg', 'category' => 'Pain Relief', 'price' => 5.99, 'cost' => 3.50, 'stock' => 150, 'minStock' => 50, 'sku' => 'MED001', 'supplier' => 'PharmaCorp', 'expiryDate' => '2026-06-15'],
        ['id' => 2, 'name' => 'Ibuprofen 400mg', 'category' => 'Pain Relief', 'price' => 7.99, 'cost' => 4.50, 'stock' => 120, 'minStock' => 40, 'sku' => 'MED002', 'supplier' => 'MedSupply Inc', 'expiryDate' => '2026-08-20'],
        ['id' => 3, 'name' => 'Amoxicillin 500mg', 'category' => 'Antibiotics', 'price' => 12.99, 'cost' => 8.00, 'stock' => 15, 'minStock' => 30, 'sku' => 'MED003', 'supplier' => 'PharmaCorp', 'expiryDate' => '2025-12-10'],
        ['id' => 4, 'name' => 'Omeprazole 20mg', 'category' => 'Digestive', 'price' => 9.99, 'cost' => 5.50, 'stock' => 95, 'minStock' => 35, 'sku' => 'MED004', 'supplier' => 'HealthMeds', 'expiryDate' => '2026-03-25'],
        ['id' => 5, 'name' => 'Loratadine 10mg', 'category' => 'Allergy', 'price' => 8.49, 'cost' => 4.00, 'stock' => 110, 'minStock' => 40, 'sku' => 'MED005', 'supplier' => 'MedSupply Inc', 'expiryDate' => '2026-09-30'],
    ];

    public function medications(Request $request): JsonResponse
    {
        $medications = $this->medications;

        if ($request->has('category') && $request->category !== 'All') {
            $medications = array_filter($medications, fn($m) => $m['category'] === $request->category);
        }

        if ($request->has('search')) {
            $search = strtolower($request->search);
            $medications = array_filter($medications, fn($m) => 
                str_contains(strtolower($m['name']), $search) || 
                str_contains(strtolower($m['sku']), $search)
            );
        }

        if ($request->has('stock_filter')) {
            if ($request->stock_filter === 'low') {
                $medications = array_filter($medications, fn($m) => $m['stock'] <= $m['minStock'] && $m['stock'] > 0);
            } elseif ($request->stock_filter === 'out') {
                $medications = array_filter($medications, fn($m) => $m['stock'] === 0);
            }
        }

        return response()->json(array_values($medications));
    }

    public function storeMedication(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string',
            'sku' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric',
            'cost' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'minStock' => 'nullable|integer',
            'supplier' => 'nullable|string',
            'expiryDate' => 'nullable|date',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Medication added successfully',
            'medication' => [
                'id' => time(),
                ...$request->all()
            ]
        ], 201);
    }

    public function updateMedication(Request $request, int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Medication updated successfully',
        ]);
    }

    public function deleteMedication(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Medication deleted successfully',
        ]);
    }

    public function adjustStock(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'adjustment' => 'required|integer',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Stock adjusted successfully',
        ]);
    }

    public function processSale(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'paymentMethod' => 'required|in:cash,card',
            'customerName' => 'nullable|string',
        ]);

        $subtotal = 0;
        foreach ($request->items as $item) {
            // In production, look up price from database
            $subtotal += ($item['price'] ?? 0) * $item['quantity'];
        }
        $tax = $subtotal * 0.1;
        $total = $subtotal + $tax;

        return response()->json([
            'success' => true,
            'message' => 'Sale completed successfully',
            'sale' => [
                'id' => time(),
                'date' => now()->toDateTimeString(),
                'items' => $request->items,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'paymentMethod' => $request->paymentMethod,
                'customerName' => $request->customerName ?? 'Walk-in Customer',
            ]
        ]);
    }

    public function salesHistory(Request $request): JsonResponse
    {
        return response()->json([
            [
                'id' => 1,
                'date' => '2025-12-26 10:30:00',
                'total' => 45.50,
                'items' => 3,
                'paymentMethod' => 'cash',
                'cashier' => 'Jane Staff'
            ],
            [
                'id' => 2,
                'date' => '2025-12-26 11:15:00',
                'total' => 28.99,
                'items' => 2,
                'paymentMethod' => 'card',
                'cashier' => 'Jane Staff'
            ],
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json([
            'Pain Relief',
            'Antibiotics',
            'Digestive',
            'Allergy',
            'Diabetes',
            'Blood Pressure',
            'Cholesterol',
            'Supplements'
        ]);
    }

    public function suppliers(): JsonResponse
    {
        return response()->json([
            'PharmaCorp',
            'MedSupply Inc',
            'HealthMeds',
            'Generic Meds Co'
        ]);
    }

    public function inventoryStats(): JsonResponse
    {
        $medications = $this->medications;
        
        return response()->json([
            'total' => count($medications),
            'lowStock' => count(array_filter($medications, fn($m) => $m['stock'] <= $m['minStock'] && $m['stock'] > 0)),
            'outOfStock' => count(array_filter($medications, fn($m) => $m['stock'] === 0)),
            'totalValue' => array_reduce($medications, fn($sum, $m) => $sum + ($m['cost'] * $m['stock']), 0),
        ]);
    }
}
