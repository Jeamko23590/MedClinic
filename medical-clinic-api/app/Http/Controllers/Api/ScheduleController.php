<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ScheduleController extends Controller
{
    public function hourlyRequirements(): JsonResponse
    {
        return response()->json([
            ['hour' => '8AM', 'required' => 8, 'scheduled' => 10, 'patients' => 12],
            ['hour' => '9AM', 'required' => 12, 'scheduled' => 10, 'patients' => 18],
            ['hour' => '10AM', 'required' => 15, 'scheduled' => 14, 'patients' => 24],
            ['hour' => '11AM', 'required' => 14, 'scheduled' => 14, 'patients' => 22],
            ['hour' => '12PM', 'required' => 10, 'scheduled' => 12, 'patients' => 15],
            ['hour' => '1PM', 'required' => 8, 'scheduled' => 10, 'patients' => 12],
            ['hour' => '2PM', 'required' => 14, 'scheduled' => 12, 'patients' => 20],
            ['hour' => '3PM', 'required' => 16, 'scheduled' => 14, 'patients' => 26],
            ['hour' => '4PM', 'required' => 12, 'scheduled' => 12, 'patients' => 18],
            ['hour' => '5PM', 'required' => 8, 'scheduled' => 8, 'patients' => 10],
        ]);
    }

    public function weeklyDistribution(): JsonResponse
    {
        return response()->json([
            ['day' => 'Mon', 'morning' => 8, 'afternoon' => 10, 'evening' => 4, 'predicted' => 85],
            ['day' => 'Tue', 'morning' => 9, 'afternoon' => 11, 'evening' => 5, 'predicted' => 92],
            ['day' => 'Wed', 'morning' => 7, 'afternoon' => 9, 'evening' => 3, 'predicted' => 78],
            ['day' => 'Thu', 'morning' => 10, 'afternoon' => 12, 'evening' => 5, 'predicted' => 95],
            ['day' => 'Fri', 'morning' => 8, 'afternoon' => 10, 'evening' => 4, 'predicted' => 88],
            ['day' => 'Sat', 'morning' => 5, 'afternoon' => 4, 'evening' => 0, 'predicted' => 45],
            ['day' => 'Sun', 'morning' => 3, 'afternoon' => 2, 'evening' => 0, 'predicted' => 25],
        ]);
    }

    public function staffPerformance(): JsonResponse
    {
        return response()->json([
            ['name' => 'Dr. Smith', 'efficiency' => 94, 'patients' => 28, 'satisfaction' => 4.8],
            ['name' => 'Dr. Johnson', 'efficiency' => 91, 'patients' => 25, 'satisfaction' => 4.7],
            ['name' => 'Dr. Williams', 'efficiency' => 88, 'patients' => 24, 'satisfaction' => 4.9],
            ['name' => 'Dr. Brown', 'efficiency' => 92, 'patients' => 26, 'satisfaction' => 4.6],
            ['name' => 'Dr. Davis', 'efficiency' => 89, 'patients' => 23, 'satisfaction' => 4.8],
        ]);
    }
}
