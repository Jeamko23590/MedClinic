<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PharmacyController extends Controller
{
    public function medications(Request $request): JsonResponse
    {
        $query = Medication::query();

        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->has('stock_filter')) {
            if ($request->stock_filter === 'low') {
                $query->whereRaw('stock <= minStock AND stock > 0');
            } elseif ($request->stock_filter === 'out') {
                $query->where('stock', 0);
            }
        }

        return response()->json($query->get());
    }

    public function storeMedication(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string',
            'sku' => 'required|string|unique:medications,sku',
            'category' => 'required|string',
            'price' => 'required|numeric',
            'cost' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'minStock' => 'nullable|integer',
            'supplier' => 'nullable|string',
            'expiryDate' => 'nullable|date',
        ]);

        $medication = Medication::create([
            'name' => $request->name,
            'sku' => $request->sku,
            'category' => $request->category,
            'price' => $request->price,
            'cost' => $request->cost ?? 0,
            'stock' => $request->stock ?? 0,
            'minStock' => $request->minStock ?? 0,
            'supplier' => $request->supplier,
            'expiryDate' => $request->expiryDate,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Medication added successfully',
            'medication' => $medication
        ], 201);
    }

    public function updateMedication(Request $request, int $id): JsonResponse
    {
        $medication = Medication::find($id);

        if (!$medication) {
            return response()->json([
                'success' => false,
                'message' => 'Medication not found',
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|string',
            'sku' => 'sometimes|string|unique:medications,sku,' . $id,
            'category' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'cost' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'minStock' => 'sometimes|integer',
            'supplier' => 'sometimes|string',
            'expiryDate' => 'sometimes|date',
        ]);

        $medication->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Medication updated successfully',
            'medication' => $medication,
        ]);
    }

    public function deleteMedication(int $id): JsonResponse
    {
        $medication = Medication::find($id);

        if (!$medication) {
            return response()->json([
                'success' => false,
                'message' => 'Medication not found',
            ], 404);
        }

        $medication->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medication deleted successfully',
        ]);
    }

    public function adjustStock(Request $request, int $id): JsonResponse
    {
        $medication = Medication::find($id);

        if (!$medication) {
            return response()->json([
                'success' => false,
                'message' => 'Medication not found',
            ], 404);
        }

        $request->validate([
            'adjustment' => 'required|integer',
        ]);

        $newStock = max(0, $medication->stock + $request->adjustment);
        $medication->update(['stock' => $newStock]);

        return response()->json([
            'success' => true,
            'message' => 'Stock adjusted successfully',
            'medication' => $medication,
        ]);
    }

    public function processSale(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:medications,id',
            'items.*.quantity' => 'required|integer|min:1',
            'paymentMethod' => 'required|in:cash,card',
            'customerName' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $itemsData = [];

            foreach ($request->items as $item) {
                $medication = Medication::find($item['id']);
                
                if ($medication->stock < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Insufficient stock for {$medication->name}",
                    ], 400);
                }

                $itemTotal = $medication->price * $item['quantity'];
                $subtotal += $itemTotal;

                $itemsData[] = [
                    'medication' => $medication,
                    'quantity' => $item['quantity'],
                    'price' => $medication->price,
                ];

                // Reduce stock
                $medication->decrement('stock', $item['quantity']);
            }

            $tax = $subtotal * 0.1;
            $total = $subtotal + $tax;

            $sale = Sale::create([
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'paymentMethod' => $request->paymentMethod,
                'customerName' => $request->customerName ?? 'Walk-in Customer',
                'cashier' => $request->cashier ?? 'Staff',
            ]);

            foreach ($itemsData as $itemData) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'medication_id' => $itemData['medication']->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $itemData['price'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Sale completed successfully',
                'sale' => [
                    'id' => $sale->id,
                    'date' => $sale->created_at->toDateTimeString(),
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'total' => $total,
                    'paymentMethod' => $request->paymentMethod,
                    'customerName' => $sale->customerName,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to process sale: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function salesHistory(Request $request): JsonResponse
    {
        $sales = Sale::with('items.medication')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'date' => $sale->created_at->toDateTimeString(),
                    'total' => $sale->total,
                    'items' => $sale->items->count(),
                    'paymentMethod' => $sale->paymentMethod,
                    'cashier' => $sale->cashier,
                ];
            });

        return response()->json($sales);
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
        $total = Medication::count();
        $lowStock = Medication::whereRaw('stock <= minStock AND stock > 0')->count();
        $outOfStock = Medication::where('stock', 0)->count();
        $totalValue = Medication::selectRaw('SUM(cost * stock) as value')->value('value') ?? 0;

        return response()->json([
            'total' => $total,
            'lowStock' => $lowStock,
            'outOfStock' => $outOfStock,
            'totalValue' => $totalValue,
        ]);
    }
}
