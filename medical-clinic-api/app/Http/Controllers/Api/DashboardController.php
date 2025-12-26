<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'todayPatients' => 127,
            'avgWaitTime' => 18,
            'forecastAccuracy' => 94.2,
            'resourceUtilization' => 76,
            'changes' => [
                'patients' => '+12%',
                'waitTime' => '-25%',
                'accuracy' => '+2.1%',
                'utilization' => '+5%'
            ]
        ]);
    }

    public function insights(): JsonResponse
    {
        return response()->json([
            [
                'id' => 1,
                'type' => 'warning',
                'title' => 'High Volume Expected',
                'description' => 'Patient volume predicted to increase 15% next month.',
                'impact' => 'high',
                'action' => 'Review staffing'
            ],
            [
                'id' => 2,
                'type' => 'success',
                'title' => 'Wait Time Improved',
                'description' => 'Average wait time reduced by 45% since implementing predictive scheduling.',
                'impact' => 'positive',
                'action' => 'Continue monitoring'
            ],
            [
                'id' => 3,
                'type' => 'info',
                'title' => 'Seasonal Pattern Detected',
                'description' => 'Respiratory cases typically peak in January-February.',
                'impact' => 'medium',
                'action' => 'Plan ahead'
            ],
            [
                'id' => 4,
                'type' => 'warning',
                'title' => 'Resource Bottleneck',
                'description' => 'Imaging department at 82% capacity.',
                'impact' => 'medium',
                'action' => 'Optimize scheduling'
            ]
        ]);
    }
}
