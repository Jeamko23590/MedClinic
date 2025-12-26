<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ResourceController extends Controller
{
    public function utilization(): JsonResponse
    {
        return response()->json([
            ['resource' => 'Exam Rooms', 'current' => 78, 'optimal' => 85, 'capacity' => 12],
            ['resource' => 'Lab Equipment', 'current' => 65, 'optimal' => 75, 'capacity' => 8],
            ['resource' => 'Imaging', 'current' => 82, 'optimal' => 80, 'capacity' => 4],
            ['resource' => 'Pharmacy', 'current' => 70, 'optimal' => 70, 'capacity' => 6],
        ]);
    }

    public function departments(): JsonResponse
    {
        return response()->json([
            ['name' => 'General Practice', 'value' => 35],
            ['name' => 'Pediatrics', 'value' => 20],
            ['name' => 'Cardiology', 'value' => 18],
            ['name' => 'Orthopedics', 'value' => 15],
            ['name' => 'Other', 'value' => 12],
        ]);
    }
}
