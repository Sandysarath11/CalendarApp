import React, { useState, useEffect } from 'react';
import { timeSlotApi } from '../services/api';
import { Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';

function TimeSlotList({ selectedDate, onSlotSelect }) {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        if (selectedDate) {
            fetchSlots();
        }
    }, [selectedDate]);

    const fetchSlots = async () => {
        setLoading(true);
        setError(null);
        setSelectedSlot(null); // Reset selection when date changes
        try {
            const response = await timeSlotApi.getAvailableSlots(selectedDate);
            setSlots(response.data.slots || []);
        } catch (err) {
            setError('Failed to load time slots. Please try again.');
            console.error('Error fetching slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot.id);
        onSlotSelect(slot);
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // Format date for display
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Loading state
    if (loading) {
        return (
            <Card className="time-slots-container">
                <Card.Body className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <Card.Text className="mt-2">
                        Loading available slots for {selectedDate}...
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    // No date selected
    if (!selectedDate) {
        return (
            <Card className="time-slots-container">
                <Card.Body className="text-center">
                    <div className="mb-3">
                        <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <Card.Title>No Date Selected</Card.Title>
                    <Card.Text className="text-muted">
                        Please select a date from the calendar to see available time slots.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="time-slots-container">
                <Card.Body className="text-center">
                    <Alert variant="danger">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                    </Alert>
                    <Button 
                        onClick={fetchSlots}
                        variant="outline-primary"
                        className="mt-2"
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Try Again
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    // No slots available
    if (slots.length === 0) {
        return (
            <Card className="time-slots-container">
                <Card.Body className="text-center">
                    <div className="mb-3">
                        <i className="bi bi-clock text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <Card.Title>No Available Slots</Card.Title>
                    <Card.Text className="text-muted mb-3">
                        No available time slots for {formatDisplayDate(selectedDate)}.
                    </Card.Text>
                    <Button 
                        onClick={fetchSlots}
                        variant="outline-primary"
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Refresh Availability
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    // Show available slots
    return (
        <Card className="time-slots-container">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title>
                        <i className="bi bi-clock me-2"></i>
                        Available Time Slots
                    </Card.Title>
                    <Badge bg="light" text="dark" className="fs-6">
                        {slots.length} slots
                    </Badge>
                </div>
                
                <Card.Subtitle className="mb-4 text-muted">
                    <i className="bi bi-calendar-event me-1"></i>
                    {formatDisplayDate(selectedDate)}
                </Card.Subtitle>
                
                <Row xs={1} md={2} className="g-3">
                    {slots.map((slot) => (
                        <Col key={slot.id}>
                            <Button
                                variant={selectedSlot === slot.id ? "primary" : "outline-primary"}
                                onClick={() => handleSlotClick(slot)}
                                className="w-100 h-100 py-3 d-flex flex-column align-items-center justify-content-center"
                            >
                                <div className="fw-bold fs-5">
                                    {formatTime(slot.start_time)}
                                </div>
                                <div className="small">
                                    to {formatTime(slot.end_time)}
                                </div>
                                {selectedSlot === slot.id && (
                                    <div className="mt-1">
                                        <i className="bi bi-check-circle"></i>
                                    </div>
                                )}
                            </Button>
                        </Col>
                    ))}
                </Row>
                
                {selectedSlot && (
                    <Alert variant="info" className="mt-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Time slot selected! Fill out the booking form to confirm.
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}

export default TimeSlotList;