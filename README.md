<<<<<<< HEAD
<<<<<<< HEAD
# CalendarApp
=======
# Calender-App
>>>>>>> 292779d003785ed1b323f99817cc9fd47c161f35
=======
# CalendarApp
>>>>>>> 85508746e339b9dd2fd9a2be3a5411ece5ae5285


Prerequisites
Make sure you have these installed:

PHP 8.1+ & Composer - Download PHP

Node.js 16+ & npm - Download Node.js

MySQL 5.7+ or SQLite - Download MySQL

Git - Download Git

📦 Installation Guide

Step 1: Clone the Repository

git clone https://github.com/Sandysarath11/CalendarApp.git

cd CalendarApp

cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

Step 3: Configure Database

# Create a new MySQL database
mysql -u root -p
CREATE DATABASE calendar_app;
EXIT;

Update .env file:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=calendar_app
DB_USERNAME=root
DB_PASSWORD=yourpassword

Step 4: Set Up Database

# Run migrations to create tables
php artisan migrate

# Seed the database with sample data
php artisan db:seed

Step 5: Install Frontend Dependencies

# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Return to root directory
cd ..

Step 6: Configure React to Work with Laravel
Update frontend/src/services/api.js:

const API_BASE_URL = '/api/v1'; // Relative path for Laravel

Update frontend/package.json to build into Laravel's public folder:

{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:8000",
  "homepage": ".",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}

Terminal 1: Start Laravel Backend

# In CalendarApp/ directory
php artisan serve
# Server runs at: http://localhost:8000

Terminal 2: Start React Frontend

# In CalendarApp/frontend/ directory
npm start
# App opens at: http://localhost:3000


📊 Data Model Design (ER Diagram Description)

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Users       │     │   TimeSlots     │     │    Bookings     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ name            │     │ user_id (FK)    │◄─── │ time_slot_id(FK)│
│ email           │     │ date            │     │ visitor_name    │
│ password        │     │ start_time      │     │ visitor_email   │
│ is_admin        │     │ end_time        │     │ notes           │
│ created_at      │     │ is_available    │     │ created_at      │
│ updated_at      │     │ created_at      │     │ updated_at      │
└─────────────────┘     │ updated_at      │     └─────────────────┘
          │             └─────────────────┘              │
          │                    1                         │
          └────────────────────┼─────────────────────────┘
                              1
                        (One-to-Many)



Detailed Table Schemas

1. users Table

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    remember_token VARCHAR(100) NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

2. time_slots Table

CREATE TABLE time_slots (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Prevent duplicate slots for same user on same date/time
    UNIQUE KEY unique_slot (user_id, date, start_time),
    
    -- Ensure end_time is after start_time (application logic)
    CONSTRAINT chk_end_after_start CHECK (end_time > start_time)
);

3. bookings Table

CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    time_slot_id BIGINT UNSIGNED NOT NULL,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE CASCADE,
    
    -- Prevent multiple bookings for same time slot
    UNIQUE KEY unique_booking (time_slot_id),
    
    -- Index for faster queries
    INDEX idx_visitor_email (visitor_email),
    INDEX idx_created_at (created_at)
);

🤖 AI Tools & Libraries Used


1. GitHub Copilot (Primary AI Assistant)
Why Used:

Code completion: Speeds up development by suggesting entire functions

Pattern recognition: Identifies common Laravel/React patterns

Error detection: Points out potential bugs before runtime

Documentation generation: Creates comments and README content

Example Usage:

// Copilot suggestion for API service
export const timeSlotApi = {
    getAvailableSlots: (date) => 
        api.get('/available-slots', { params: { date } }),
    
    bookSlot: (data) => 
        api.post('/book-slot', data),
    
    // AI suggested these additional endpoints
    getBookings: (date) => 
        api.get('/bookings', { params: { date } }),
    
    createSlots: (data) => 
        api.post('/create-slots', data),
};

2. ChatGPT (Claude/DeepSeek)
Why Used:

Architecture planning: Helped design the overall system structure

Problem-solving: Debugged complex issues like CORS, React build errors

Best practices: Suggested Laravel/React conventions

Documentation: Generated comprehensive README and comments

Learning assistance: Explained concepts when stuck

Example Assistance:

CORS issue resolution: Suggested Laravel 12+ built-in CORS instead of deprecated package

React-Tailwind setup: Provided step-by-step installation when errors occurred

Bootstrap migration: Helped transition from Tailwind to Bootstrap smoothly

3. Library Choices & Reasoning
Backend Libraries:

{
  "laravel/framework": "^10.0",  // Chosen for rapid development, ORM, routing
  "fruitcake/laravel-cors": "^3.0", // For API security (initially, then moved to built-in)
  "guzzlehttp/guzzle": "^7.0",  // HTTP client for future email/API integrations
}

Why Laravel?

Built-in authentication system

Eloquent ORM for database interactions

MVC architecture for clean code separation

Robust middleware system

Active community and documentation

Frontend Libraries:

{
  "react": "^18.2.0",           // Component-based UI development
  "react-bootstrap": "^2.9.1",  // UI components (switched from Tailwind for simplicity)
  "axios": "^1.6.0",           // HTTP requests with interceptors
  "react-datepicker": "^6.1.0", // Calendar component (like Calendly)
  "date-fns": "^2.30.0",       // Date manipulation (lighter than Moment.js)
  "react-icons": "^4.12.0",    // Icon library for visual appeal
}

4. Development Tools Used
VS Code Extensions (AI-enhanced):
GitHub Copilot: AI pair programming

ES7+ React/Redux Snippets: Quick component generation

Laravel Blade Snippets: Laravel template assistance

MySQL: Database management

Prettier: Code formatting

Browser DevTools:
React Developer Tools: Component inspection

Redux DevTools: State management debugging

Network tab: API call monitoring


