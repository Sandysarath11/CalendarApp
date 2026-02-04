import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const timeSlotApi = {
    getAvailableSlots: (date) => 
        api.get('/available-slots', { params: { date } }),
    
    bookSlot: (data) => 
        api.post('/book-slot', data),
    
    createSlots: (data) => 
        api.post('/create-slots', data),

    getBookings: (date) => 
        api.get('/bookings', { params: { date } }),
};