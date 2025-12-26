<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient',
        'patient_id',
        'doctor',
        'doctor_id',
        'date',
        'time',
        'status',
        'reason',
        'phone',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
