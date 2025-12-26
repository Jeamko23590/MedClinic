<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ForecastController;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\Api\TrendController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AppointmentController;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Authentication
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/me', [AuthController::class, 'me']);

// Dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
Route::get('/dashboard/insights', [DashboardController::class, 'insights']);

// Appointments
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
Route::get('/appointments/doctors', [AppointmentController::class, 'doctors']);
Route::get('/appointments/time-slots', [AppointmentController::class, 'timeSlots']);
Route::get('/appointments/blocked-dates/{doctorId}', [AppointmentController::class, 'blockedDates']);
Route::post('/appointments/block-date', [AppointmentController::class, 'blockDate']);
Route::post('/appointments/unblock-date', [AppointmentController::class, 'unblockDate']);

// Patient Forecast
Route::prefix('forecast')->group(function () {
    Route::get('/patients', [ForecastController::class, 'patientVolume']);
    Route::get('/weekly', [ForecastController::class, 'weeklyDistribution']);
});

// Resource Planning
Route::prefix('resources')->group(function () {
    Route::get('/utilization', [ResourceController::class, 'utilization']);
    Route::get('/departments', [ResourceController::class, 'departments']);
});

// Trend Analysis
Route::prefix('trends')->group(function () {
    Route::get('/diseases', [TrendController::class, 'diseaseCategories']);
    Route::get('/seasonal', [TrendController::class, 'seasonalPatterns']);
    Route::get('/wait-time', [TrendController::class, 'waitTimeImpact']);
});

// Staff Scheduling
Route::prefix('schedule')->group(function () {
    Route::get('/hourly', [ScheduleController::class, 'hourlyRequirements']);
    Route::get('/weekly', [ScheduleController::class, 'weeklyDistribution']);
    Route::get('/staff-performance', [ScheduleController::class, 'staffPerformance']);
});

// Pharmacy
use App\Http\Controllers\Api\PharmacyController;

Route::prefix('pharmacy')->group(function () {
    Route::get('/medications', [PharmacyController::class, 'medications']);
    Route::post('/medications', [PharmacyController::class, 'storeMedication']);
    Route::put('/medications/{id}', [PharmacyController::class, 'updateMedication']);
    Route::delete('/medications/{id}', [PharmacyController::class, 'deleteMedication']);
    Route::post('/medications/{id}/adjust-stock', [PharmacyController::class, 'adjustStock']);
    Route::get('/categories', [PharmacyController::class, 'categories']);
    Route::get('/suppliers', [PharmacyController::class, 'suppliers']);
    Route::get('/stats', [PharmacyController::class, 'inventoryStats']);
    Route::post('/sales', [PharmacyController::class, 'processSale']);
    Route::get('/sales/history', [PharmacyController::class, 'salesHistory']);
});
