<?php

namespace Database\Seeders;

use App\Models\Appointment;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $appointments = [
            ['patient' => 'John Doe', 'patient_id' => 4, 'doctor' => 'Dr. Smith', 'doctor_id' => 1, 'date' => '2025-12-26', 'time' => '09:00 AM', 'status' => 'pending', 'reason' => 'Regular checkup', 'phone' => '555-0101'],
            ['patient' => 'Jane Wilson', 'patient_id' => 5, 'doctor' => 'Dr. Smith', 'doctor_id' => 1, 'date' => '2025-12-26', 'time' => '10:00 AM', 'status' => 'confirmed', 'reason' => 'Follow-up', 'phone' => '555-0102'],
            ['patient' => 'Mike Brown', 'patient_id' => 6, 'doctor' => 'Dr. Johnson', 'doctor_id' => 2, 'date' => '2025-12-27', 'time' => '02:00 PM', 'status' => 'pending', 'reason' => 'Heart consultation', 'phone' => '555-0103'],
            ['patient' => 'Sarah Davis', 'patient_id' => 7, 'doctor' => 'Dr. Williams', 'doctor_id' => 3, 'date' => '2025-12-27', 'time' => '03:30 PM', 'status' => 'confirmed', 'reason' => 'Child vaccination', 'phone' => '555-0104'],
            ['patient' => 'Tom Miller', 'patient_id' => 8, 'doctor' => 'Dr. Brown', 'doctor_id' => 4, 'date' => '2025-12-28', 'time' => '11:00 AM', 'status' => 'pending', 'reason' => 'Knee pain', 'phone' => '555-0105'],
        ];

        foreach ($appointments as $appointment) {
            Appointment::firstOrCreate(
                [
                    'doctor_id' => $appointment['doctor_id'],
                    'date' => $appointment['date'],
                    'time' => $appointment['time']
                ],
                $appointment
            );
        }
    }
}
