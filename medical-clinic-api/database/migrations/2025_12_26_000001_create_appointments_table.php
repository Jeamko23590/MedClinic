<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('patient');
            $table->unsignedBigInteger('patient_id')->nullable();
            $table->string('doctor');
            $table->unsignedBigInteger('doctor_id');
            $table->date('date');
            $table->string('time');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->text('reason')->nullable();
            $table->string('phone')->nullable();
            $table->timestamps();

            $table->index(['doctor_id', 'date']);
            $table->index(['patient_id']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
