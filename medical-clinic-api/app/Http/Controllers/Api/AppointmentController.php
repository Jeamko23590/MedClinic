<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    private array $appointments = [
        ['id' => 1, 'patient' => 'John Doe', 'patient_id' => 4, 'doctor' => 'Dr. Smith', 'doctor_id' => 1, 'date' => '2025-12-26', 'time' => '09:00 AM', 'status' => 'pending', 'reason' => 'Regular checkup', 'phone' => '555-0101'],
        ['id' => 2, 'patient' => 'Jane Wilson', 'patient_id' => 5, 'doctor' => 'Dr. Smith', 'doctor_id' => 1, 'date' => '2025-12-26', 'time' => '10:00 AM', 'status' => 'confirmed', 'reason' => 'Follow-up', 'phone' => '555-0102'],
        ['id' => 3, 'patient' => 'Mike Brown', 'patient_id' => 6, 'doctor' => 'Dr. Johnson', 'doctor_id' => 2, 'date' => '2025-12-27', 'time' => '02:00 PM', 'status' => 'pending', 'reason' => 'Heart consultation', 'phone' => '555-0103'],
        ['id' => 4, 'patient' => 'Sarah Davis', 'patient_id' => 7, 'doctor' => 'Dr. Williams', 'doctor_id' => 3, 'date' => '2025-12-27', 'time' => '03:30 PM', 'status' => 'confirmed', 'reason' => 'Child vaccination', 'phone' => '555-0104'],
        ['id' => 5, 'patient' => 'Tom Miller', 'patient_id' => 8, 'doctor' => 'Dr. Brown', 'doctor_id' => 4, 'date' => '2025-12-28', 'time' => '11:00 AM', 'status' => 'pending', 'reason' => 'Knee pain', 'phone' => '555-0105'],
    ];

    public function index(Request $request): JsonResponse
    {
        $appointments = $this->appointments;

        // Filter by doctor if specified
        if ($request->has('doctor_id')) {
            $appointments = array_filter($appointments, fn($a) => $a['doctor_id'] == $request->doctor_id);
        }

        // Filter by patient if specified
        if ($request->has('patient_id')) {
            $appointments = array_filter($appointments, fn($a) => $a['patient_id'] == $request->patient_id);
        }

        // Filter by status if specified
        if ($request->has('status')) {
            $appointments = array_filter($appointments, fn($a) => $a['status'] == $request->status);
        }

        // Filter by date if specified
        if ($request->has('date')) {
            $appointments = array_filter($appointments, fn($a) => $a['date'] == $request->date);
        }

        return response()->json(array_values($appointments));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'doctor_id' => 'required|integer',
            'date' => 'required|date',
            'time' => 'required|string',
            'reason' => 'nullable|string',
        ]);

        $newAppointment = [
            'id' => count($this->appointments) + 1,
            'patient' => 'New Patient', // Would come from auth user
            'patient_id' => $request->patient_id ?? 4,
            'doctor' => 'Dr. Smith', // Would be looked up
            'doctor_id' => $request->doctor_id,
            'date' => $request->date,
            'time' => $request->time,
            'status' => 'pending',
            'reason' => $request->reason ?? '',
            'phone' => '555-0000',
        ];

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'appointment' => $newAppointment,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
        ]);

        // In production, update database
        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Appointment cancelled successfully',
        ]);
    }

    public function doctors(): JsonResponse
    {
        return response()->json([
            ['id' => 1, 'name' => 'Dr. Smith', 'specialty' => 'General Practice'],
            ['id' => 2, 'name' => 'Dr. Johnson', 'specialty' => 'Cardiology'],
            ['id' => 3, 'name' => 'Dr. Williams', 'specialty' => 'Pediatrics'],
            ['id' => 4, 'name' => 'Dr. Brown', 'specialty' => 'Orthopedics'],
        ]);
    }

    public function timeSlots(): JsonResponse
    {
        return response()->json([
            '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
        ]);
    }

    public function blockedDates(int $doctorId): JsonResponse
    {
        $blockedDates = [
            1 => [['date' => '2025-12-28', 'reason' => 'Personal leave'], ['date' => '2025-12-29', 'reason' => 'Conference']],
            2 => [['date' => '2025-12-27', 'reason' => 'Training']],
            3 => [],
            4 => [['date' => '2025-12-30', 'reason' => 'Holiday'], ['date' => '2025-12-31', 'reason' => 'Holiday']],
        ];

        return response()->json($blockedDates[$doctorId] ?? []);
    }

    public function blockDate(Request $request): JsonResponse
    {
        $request->validate([
            'doctor_id' => 'required|integer',
            'date' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Date blocked successfully',
        ]);
    }

    public function unblockDate(Request $request): JsonResponse
    {
        $request->validate([
            'doctor_id' => 'required|integer',
            'date' => 'required|date',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Date unblocked successfully',
        ]);
    }
}
