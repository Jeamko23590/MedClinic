<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ForecastController extends Controller
{
    public function patientVolume(): JsonResponse
    {
        return response()->json([
            ['date' => 'Jan', 'actual' => 420, 'predicted' => 415, 'lower' => 390, 'upper' => 440],
            ['date' => 'Feb', 'actual' => 380, 'predicted' => 385, 'lower' => 360, 'upper' => 410],
            ['date' => 'Mar', 'actual' => 450, 'predicted' => 445, 'lower' => 420, 'upper' => 470],
            ['date' => 'Apr', 'actual' => 520, 'predicted' => 510, 'lower' => 485, 'upper' => 535],
            ['date' => 'May', 'actual' => 480, 'predicted' => 490, 'lower' => 465, 'upper' => 515],
            ['date' => 'Jun', 'actual' => 510, 'predicted' => 505, 'lower' => 480, 'upper' => 530],
            ['date' => 'Jul', 'actual' => null, 'predicted' => 535, 'lower' => 505, 'upper' => 565],
            ['date' => 'Aug', 'actual' => null, 'predicted' => 560, 'lower' => 525, 'upper' => 595],
            ['date' => 'Sep', 'actual' => null, 'predicted' => 545, 'lower' => 510, 'upper' => 580],
            ['date' => 'Oct', 'actual' => null, 'predicted' => 580, 'lower' => 540, 'upper' => 620],
            ['date' => 'Nov', 'actual' => null, 'predicted' => 620, 'lower' => 575, 'upper' => 665],
            ['date' => 'Dec', 'actual' => null, 'predicted' => 590, 'lower' => 545, 'upper' => 635],
        ]);
    }

    public function weeklyDistribution(): JsonResponse
    {
        return response()->json([
            ['day' => 'Mon', 'patients' => 85, 'avgWait' => 22],
            ['day' => 'Tue', 'patients' => 92, 'avgWait' => 28],
            ['day' => 'Wed', 'patients' => 78, 'avgWait' => 18],
            ['day' => 'Thu', 'patients' => 95, 'avgWait' => 32],
            ['day' => 'Fri', 'patients' => 88, 'avgWait' => 25],
            ['day' => 'Sat', 'patients' => 45, 'avgWait' => 12],
            ['day' => 'Sun', 'patients' => 25, 'avgWait' => 8],
        ]);
    }
}
