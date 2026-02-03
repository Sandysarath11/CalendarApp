<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class TimeSlotController extends Controller
{
    // Get available time slots for a specific date
    public function getAvailableSlots(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $date = Carbon::parse($request->date)->toDateString();

        $slots = TimeSlot::where('date', $date)
            ->where('is_available', true)
            ->whereDoesntHave('booking')
            ->get(['id', 'start_time', 'end_time']);

        return response()->json([
            'date' => $date,
            'slots' => $slots
        ]);
    }

    // Book a time slot
    public function bookSlot(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'time_slot_id' => 'required|exists:time_slots,id',
            'visitor_name' => 'required|string|max:255',
            'visitor_email' => 'required|email|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if slot is still available
        $timeSlot = TimeSlot::find($request->time_slot_id);

        if (!$timeSlot->is_available || $timeSlot->booking) {
            return response()->json([
                'error' => 'This time slot is no longer available'
            ], 409);
        }

        // Create booking
        $booking = Booking::create([
            'time_slot_id' => $request->time_slot_id,
            'visitor_name' => $request->visitor_name,
            'visitor_email' => $request->visitor_email,
            'notes' => $request->notes
        ]);

        return response()->json([
            'message' => 'Booking confirmed!',
            'booking' => $booking
        ], 201);
    }

    // Admin: Create time slots
    public function createSlots(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'slots' => 'required|array',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $createdSlots = [];
        $date = Carbon::parse($request->date)->toDateString();

        foreach ($request->slots as $slot) {
            $timeSlot = TimeSlot::create([
                'user_id' => auth()->id() ?? 1, // Default to user_id 1 for demo
                'date' => $date,
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'is_available' => true
            ]);

            $createdSlots[] = $timeSlot;
        }

        return response()->json([
            'message' => 'Time slots created successfully',
            'slots' => $createdSlots
        ], 201);
    }

    // Add this method to get bookings
    public function getBookings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $date = Carbon::parse($request->date)->toDateString();

        // Get bookings for the specified date
        $bookings = Booking::with('timeSlot')
            ->whereHas('timeSlot', function ($query) use ($date) {
                $query->where('date', $date);
            })
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'visitor_name' => $booking->visitor_name,
                    'visitor_email' => $booking->visitor_email,
                    'notes' => $booking->notes,
                    'date' => $booking->timeSlot->date,
                    'start_time' => $booking->timeSlot->start_time,
                    'end_time' => $booking->timeSlot->end_time,
                    'booked_at' => $booking->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json([
            'date' => $date,
            'bookings' => $bookings
        ]);
    }
}