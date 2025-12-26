<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TrendController extends Controller
{
    public function diseaseCategories(): JsonResponse
    {
        return response()->json([
            ['month' => 'Jan', 'respiratory' => 120, 'cardiovascular' => 85, 'diabetes' => 95, 'orthopedic' => 60],
            ['month' => 'Feb', 'respiratory' => 145, 'cardiovascular' => 82, 'diabetes' => 98, 'orthopedic' => 58],
            ['month' => 'Mar', 'respiratory' => 110, 'cardiovascular' => 88, 'diabetes' => 102, 'orthopedic' => 65],
            ['month' => 'Apr', 'respiratory' => 85, 'cardiovascular' => 90, 'diabetes' => 105, 'orthopedic' => 70],
            ['month' => 'May', 'respiratory' => 70, 'cardiovascular' => 92, 'diabetes' => 108, 'orthopedic' => 75],
            ['month' => 'Jun', 'respiratory' => 65, 'cardiovascular' => 95, 'diabetes' => 110, 'orthopedic' => 72],
        ]);
    }

    public function seasonalPatterns(): JsonResponse
    {
        return response()->json([
            ['month' => 'Jan', 'flu' => 85, 'allergies' => 20, 'injuries' => 45],
            ['month' => 'Feb', 'flu' => 75, 'allergies' => 25, 'injuries' => 42],
            ['month' => 'Mar', 'flu' => 45, 'allergies' => 55, 'injuries' => 48],
            ['month' => 'Apr', 'flu' => 25, 'allergies' => 80, 'injuries' => 55],
            ['month' => 'May', 'flu' => 15, 'allergies' => 90, 'injuries' => 65],
            ['month' => 'Jun', 'flu' => 10, 'allergies' => 70, 'injuries' => 75],
        ]);
    }

    public function waitTimeImpact(): JsonResponse
    {
        return response()->json([
            ['week' => 'W1', 'before' => 35, 'after' => 35],
            ['week' => 'W2', 'before' => 38, 'after' => 32],
            ['week' => 'W3', 'before' => 42, 'after' => 28],
            ['week' => 'W4', 'before' => 40, 'after' => 25],
            ['week' => 'W5', 'before' => 45, 'after' => 22],
            ['week' => 'W6', 'before' => 43, 'after' => 20],
            ['week' => 'W7', 'before' => 48, 'after' => 18],
            ['week' => 'W8', 'before' => 46, 'after' => 16],
        ]);
    }
}
