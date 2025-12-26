<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    private array $doctors = [
        1 => 'Dr. Smith',
        2 => 'Dr. Johnson',
        3 => 'Dr. Williams',
        4 => 'Dr. Brown',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Appointment::query();

        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $appointments = $query->orderBy('date')->orderBy('time')->get();

        return response()->json($appointments);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'doctor_id' => 'required|integer',
            'date' => 'required|date',
            'time' => 'required|string',
            'reason' => 'nullable|string',
            'patient' => 'nullable|string',
            'patient_id' => 'nullable|integer',
            'phone' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'patient' => $request->patient ?? 'New Patient',
            'patient_id' => $request->patient_id ?? null,
            'doctor' => $this->doctors[$request->doctor_id] ?? 'Unknown Doctor',
            'doctor_id' => $request->doctor_id,
            'date' => $request->date,
            'time' => $request->time,
            'status' => 'pending',
            'reason' => $request->reason ?? '',
            'phone' => $request->phone ?? '',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'appointment' => $appointment,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found',
            ], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'date' => 'sometimes|date',
            'time' => 'sometimes|string',
            'reason' => 'sometimes|string',
        ]);

        $appointment->update($request->only(['status', 'date', 'time', 'reason']));

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found',
            ], 404);
        }

        $appointment->delete();

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
