import React, { useState, useEffect } from 'react';
import { timeSlotApi } from '../services/api';
import { Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';

function BookingForm({ selectedSlot, selectedDate, onBookingComplete }) {
    const [formData, setFormData] = useState({
        visitor_name: '',
        visitor_email: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Reset form when date or slot changes
    useEffect(() => {
        setError(null);
        setSuccess(false);
    }, [selectedDate, selectedSlot]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedSlot) {
            setError('Please select a time slot first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const bookingData = {
                time_slot_id: selectedSlot.id,
                ...formData
            };

            const response = await timeSlotApi.bookSlot(bookingData);
            
            if (response.status === 201) {
                setSuccess(true);
                setFormData({ visitor_name: '', visitor_email: '', notes: '' });
                onBookingComplete(response.data.booking);
            }
        } catch (err) {
            setError(
                err.response?.data?.error || 
                err.response?.data?.errors?.visitor_email?.[0] ||
                'Failed to book appointment. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

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

    if (success && selectedSlot) {
        return (
            <Card className="booking-form-container">
                <Card.Body className="text-center">
                    <div className="mb-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '64px', height: '64px'}}>
                            <i className="bi bi-check-lg fs-3"></i>
                        </div>
                        <Alert variant="success">
                            <Alert.Heading>
                                <i className="bi bi-check-circle me-2"></i>
                                Booking Confirmed!
                            </Alert.Heading>
                            <p className="mb-1">
                                Your appointment has been scheduled for:
                            </p>
                            <h5 className="mt-2 mb-3">
                                <Badge bg="info" className="fs-6">
                                    {formatDisplayDate(selectedDate)} at {formatTime(selectedSlot.start_time)}
                                </Badge>
                            </h5>
                            <hr />
                            <p className="mb-0">
                                A confirmation email has been sent to <strong>{formData.visitor_email}</strong>
                            </p>
                        </Alert>
                    </div>
                    <Button 
                        variant="outline-primary" 
                        onClick={() => {
                            setSuccess(false);
                            setFormData({ visitor_name: '', visitor_email: '', notes: '' });
                        }}
                    >
                        <i className="bi bi-plus-circle me-1"></i>
                        Make Another Booking
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    if (!selectedDate) {
        return (
            <Card className="booking-form-container">
                <Card.Body className="text-center">
                    <div className="mb-3">
                        <i className="bi bi-calendar text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <Card.Title>Select a Date</Card.Title>
                    <Card.Text className="text-muted">
                        Please select a date from the calendar to start booking.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    if (!selectedSlot) {
        return (
            <Card className="booking-form-container">
                <Card.Body className="text-center">
                    <div className="mb-3">
                        <i className="bi bi-clock text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <Card.Title>Select a Time Slot</Card.Title>
                    <Card.Text className="text-muted mb-3">
                        Please select an available time slot for {formatDisplayDate(selectedDate)}.
                    </Card.Text>
                    <Alert variant="info">
                        <i className="bi bi-info-circle me-2"></i>
                        Click on any available time slot from the list to proceed with booking.
                    </Alert>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="booking-form-container">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Card.Title>
                        <i className="bi bi-pencil-square me-2"></i>
                        Book Appointment
                    </Card.Title>
                    <Badge bg="info">
                        {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                    </Badge>
                </div>

                <Alert variant="light" className="mb-4 border">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-calendar-event fs-4 me-3 text-primary"></i>
                        <div>
                            <div className="fw-bold">{formatDisplayDate(selectedDate)}</div>
                            <div className="text-muted small">
                                <i className="bi bi-clock me-1"></i>
                                {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                            </div>
                        </div>
                    </div>
                </Alert>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>
                            <i className="bi bi-person me-2"></i>
                            Full Name *
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="visitor_name"
                            value={formData.visitor_name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>
                            <i className="bi bi-envelope me-2"></i>
                            Email Address *
                        </Form.Label>
                        <Form.Control
                            type="email"
                            name="visitor_email"
                            value={formData.visitor_email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                        <Form.Text className="text-muted">
                            We'll send confirmation to this email
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formNotes">
                        <Form.Label>
                            <i className="bi bi-chat-text me-2"></i>
                            Notes (Optional)
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any additional information, questions, or special requirements..."
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        className="w-100 py-3"
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Processing Booking...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-calendar-check me-2"></i>
                                Confirm Booking
                            </>
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default BookingForm;