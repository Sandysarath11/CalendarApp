<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TimeSlot;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create a demo user
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true
        ]);

        // Create some time slots for the next 7 days
        for ($i = 1; $i <= 7; $i++) {
            $date = Carbon::now()->addDays($i);
            
            // Morning slots
            TimeSlot::create([
                'user_id' => 1,
                'date' => $date->toDateString(),
                'start_time' => '09:00',
                'end_time' => '09:30',
                'is_available' => true
            ]);
            
            TimeSlot::create([
                'user_id' => 1,
                'date' => $date->toDateString(),
                'start_time' => '10:00',
                'end_time' => '10:30',
                'is_available' => true
            ]);
            
            // Afternoon slots
            TimeSlot::create([
                'user_id' => 1,
                'date' => $date->toDateString(),
                'start_time' => '14:00',
                'end_time' => '14:30',
                'is_available' => true
            ]);
            
            TimeSlot::create([
                'user_id' => 1,
                'date' => $date->toDateString(),
                'start_time' => '15:00',
                'end_time' => '15:30',
                'is_available' => true
            ]);
        }
    }
}