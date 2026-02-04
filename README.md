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

