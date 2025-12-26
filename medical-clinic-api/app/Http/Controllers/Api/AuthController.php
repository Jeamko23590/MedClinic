<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Mock users for demo - in production, use database
    private array $mockUsers = [
        'admin@clinic.com' => ['id' => 1, 'name' => 'Admin User', 'email' => 'admin@clinic.com', 'role' => 'admin', 'password' => 'password123'],
        'doctor@clinic.com' => ['id' => 2, 'name' => 'Dr. Smith', 'email' => 'doctor@clinic.com', 'role' => 'doctor', 'password' => 'password123'],
        'staff@clinic.com' => ['id' => 3, 'name' => 'Jane Staff', 'email' => 'staff@clinic.com', 'role' => 'staff', 'password' => 'password123'],
        'patient@clinic.com' => ['id' => 4, 'name' => 'John Patient', 'email' => 'patient@clinic.com', 'role' => 'patient', 'password' => 'password123'],
    ];

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $email = $request->email;
        $password = $request->password;

        if (isset($this->mockUsers[$email]) && $this->mockUsers[$email]['password'] === $password) {
            $user = $this->mockUsers[$email];
            unset($user['password']);
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => base64_encode($email . ':' . time()), // Simple mock token
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
        ], 401);
    }

    public function logout(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        // In production, get user from token
        return response()->json([
            'id' => 1,
            'name' => 'Admin User',
            'email' => 'admin@clinic.com',
            'role' => 'admin',
        ]);
    }
}
