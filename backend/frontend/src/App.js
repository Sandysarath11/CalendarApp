import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import TimeSlotList from './components/TimeSlotList';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';
import { Container, Row, Col, Navbar, Button, Alert } from 'react-bootstrap';
import './App.css';

function App() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    // Initialize with today's date
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        setSelectedDate(formattedDate);
    }, []);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setBookingComplete(false);
        setBookingData(null);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setBookingComplete(false);
    };

    const handleBookingComplete = (booking) => {
        setBookingComplete(true);
        setBookingData(booking);
        setSelectedSlot(null); // Clear slot selection after booking
    };

    const toggleAdmin = () => {
        setShowAdmin(!showAdmin);
        setSelectedDate('');
        setSelectedSlot(null);
        setBookingComplete(false);
        setBookingData(null);
    };

    const handleNewBooking = () => {
        setBookingComplete(false);
        setBookingData(null);
        // Keep the same date selected
    };

    return (
        <div className="App">
            <Navbar bg="white" expand="lg" className="shadow-sm mb-4">
                <Container>
                    <Navbar.Brand href="#" className="fw-bold text-primary fs-4">
                        <i className="bi bi-calendar-check me-2"></i>
                        Appointment Scheduler
                    </Navbar.Brand>
                    <Button 
                        onClick={toggleAdmin}
                        variant={showAdmin ? "secondary" : "outline-secondary"}
                        size="sm"
                    >
                        {showAdmin ? (
                            <>
                                <i className="bi bi-person me-1"></i>
                                User View
                            </>
                        ) : (
                            <>
                                <i className="bi bi-gear me-1"></i>
                                Admin View
                            </>
                        )}
                    </Button>
                </Container>
            </Navbar>

            {bookingComplete && bookingData && (
                <Container className="mb-4">
                    <Alert variant="success" onClose={() => setBookingComplete(false)} dismissible>
                        <Alert.Heading>
                            <i className="bi bi-check-circle me-2"></i>
                            Booking Successful!
                        </Alert.Heading>
                        <p>
                            Your appointment has been confirmed. Confirmation sent to {bookingData.visitor_email}
                        </p>
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-success" size="sm" onClick={handleNewBooking}>
                                Make Another Booking
                            </Button>
                        </div>
                    </Alert>
                </Container>
            )}

            <Container>
                {showAdmin ? (
                    <AdminPanel />
                ) : (
                    <Row className="g-4">
                        <Col lg={4}>
                            <Calendar 
                                onDateSelect={handleDateSelect} 
                                selectedDate={selectedDate}
                            />
                        </Col>
                        
                        <Col lg={4}>
                            <TimeSlotList 
                                selectedDate={selectedDate}
                                onSlotSelect={handleSlotSelect}
                            />
                        </Col>
                        
                        <Col lg={4}>
                            <BookingForm 
                                selectedSlot={selectedSlot}
                                selectedDate={selectedDate}
                                onBookingComplete={handleBookingComplete}
                            />
                        </Col>
                    </Row>
                )}
            </Container>

            <footer className="py-4 mt-4 border-top text-center text-muted">
                <Container>
                    <p className="mb-0">
                        <i className="bi bi-code-slash me-1"></i>
                        Built with Laravel & React • Inspired by Calendly
                    </p>
                </Container>
            </footer>
        </div>
    );
}

export default App;