<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TimeSlotController;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('/available-slots', [TimeSlotController::class, 'getAvailableSlots']);
    Route::post('/book-slot', [TimeSlotController::class, 'bookSlot']);
    
    // Admin routes (for demo, no auth - in real app, add authentication)
    Route::post('/create-slots', [TimeSlotController::class, 'createSlots']);
    Route::get('/bookings', [TimeSlotController::class, 'getBookings']);
});