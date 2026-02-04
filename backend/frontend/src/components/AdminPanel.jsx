import React, { useState, useEffect } from 'react';
import { timeSlotApi } from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, format as formatDate } from 'date-fns';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Row, 
  Col, 
  Table,
  Badge,
  Tabs,
  Tab,
  Spinner,
  Modal
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AdminPanel() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([
        { start_time: '09:00', end_time: '09:30' },
        { start_time: '10:00', end_time: '10:30' }
    ]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('manage');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState(null);

    // Fetch bookings when component mounts or date changes
    useEffect(() => {
        if (activeTab === 'view') {
            fetchBookings();
        }
    }, [selectedDate, activeTab]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const addSlot = () => {
        setSlots([...slots, { start_time: '', end_time: '' }]);
    };

    const removeSlot = (index) => {
        const newSlots = [...slots];
        newSlots.splice(index, 1);
        setSlots(newSlots);
    };

    const updateSlot = (index, field, value) => {
        const newSlots = [...slots];
        newSlots[index][field] = value;
        setSlots(newSlots);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const data = {
                date: format(selectedDate, 'yyyy-MM-dd'),
                slots: slots.filter(slot => slot.start_time && slot.end_time)
            };

            const response = await timeSlotApi.createSlots(data);
            setMessage({
                type: 'success',
                text: response.data.message
            });
            
            // Reset form
            setSlots([{ start_time: '09:00', end_time: '09:30' }]);
            
            // Refresh bookings
            fetchBookings();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to create slots'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
        const response = await timeSlotApi.getBookings(format(selectedDate, 'yyyy-MM-dd'));
        setBookings(response.data.bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err);
        setMessage({
            type: 'error',
            text: 'Failed to load bookings'
        });
    } finally {
        setBookingsLoading(false);
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

    const handleDeleteClick = (slotId) => {
        setSlotToDelete(slotId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        // Here you would call your API to delete the slot
        console.log('Deleting slot:', slotToDelete);
        setBookings(bookings.filter(booking => booking.id !== slotToDelete));
        setShowDeleteModal(false);
        setSlotToDelete(null);
        setMessage({
            type: 'success',
            text: 'Booking deleted successfully'
        });
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSlotToDelete(null);
    };

    const sendReminder = (bookingId) => {
        // This would call your API to send a reminder email
        alert(`Reminder sent for booking #${bookingId}`);
        setMessage({
            type: 'success',
            text: 'Reminder email sent successfully'
        });
    };

    return (
        <Container className="py-4">
            <Card className="admin-panel shadow">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <Card.Title className="mb-1">
                                <i className="bi bi-calendar-check me-2"></i>
                                Admin Dashboard
                            </Card.Title>
                            <Card.Subtitle className="text-muted">
                                Manage appointments and availability
                            </Card.Subtitle>
                        </div>
                        <Badge bg="light" text="dark" className="fs-6">
                            <i className="bi bi-calendar-date me-1"></i>
                            {format(selectedDate, 'MMMM d, yyyy')}
                        </Badge>
                    </div>

                    {message && (
                        <Alert 
                            variant={message.type === 'success' ? 'success' : 'danger'} 
                            className="mb-4"
                            onClose={() => setMessage(null)} 
                            dismissible
                        >
                            <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                            {message.text}
                        </Alert>
                    )}

                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-4"
                    >
                        <Tab 
                            eventKey="manage" 
                            title={
                                <>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Manage Slots
                                </>
                            }
                        >
                            <Card className="border-0 bg-light">
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="mb-4">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>
                                                        <i className="bi bi-calendar me-2"></i>
                                                        Select Date
                                                    </Form.Label>
                                                    <DatePicker
                                                        selected={selectedDate}
                                                        onChange={handleDateChange}
                                                        dateFormat="MMMM d, yyyy"
                                                        className="form-control"
                                                        minDate={new Date()}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="d-flex align-items-end">
                                                <div className="text-muted small">
                                                    <i className="bi bi-info-circle me-1"></i>
                                                    Select a future date to add time slots
                                                </div>
                                            </Col>
                                        </Row>

                                        <Card className="mb-4">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <Card.Subtitle className="mb-1">Time Slots</Card.Subtitle>
                                                        <small className="text-muted">
                                                            Add available time slots for the selected date
                                                        </small>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={addSlot}
                                                        variant="outline-primary"
                                                        size="sm"
                                                    >
                                                        <i className="bi bi-plus me-1"></i>
                                                        Add Slot
                                                    </Button>
                                                </div>

                                                {slots.map((slot, index) => (
                                                    <Row key={index} className="mb-3 align-items-center">
                                                        <Col md={5}>
                                                            <Form.Label className="small mb-1">
                                                                <i className="bi bi-clock me-1"></i>
                                                                Start Time
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="time"
                                                                value={slot.start_time}
                                                                onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                                                                required
                                                            />
                                                        </Col>
                                                        <Col md={5}>
                                                            <Form.Label className="small mb-1">
                                                                <i className="bi bi-clock-fill me-1"></i>
                                                                End Time
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="time"
                                                                value={slot.end_time}
                                                                onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                                                                required
                                                            />
                                                        </Col>
                                                        <Col md={2} className="mt-4">
                                                            {slots.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => removeSlot(index)}
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="w-100"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </Button>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </Card.Body>
                                        </Card>

                                        <Button
                                            type="submit"
                                            variant="primary"
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
                                                    Creating Slots...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-save me-2"></i>
                                                    Create Time Slots
                                                </>
                                            )}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>

                        <Tab 
                            eventKey="view" 
                            title={
                                <>
                                    <i className="bi bi-eye me-2"></i>
                                    View Bookings
                                </>
                            }
                        >
                            <Card className="border-0 bg-light">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h5 className="mb-1">
                                                <i className="bi bi-calendar-week me-2"></i>
                                                Bookings for {format(selectedDate, 'MMMM d, yyyy')}
                                            </h5>
                                            <small className="text-muted">
                                                View and manage booked appointments
                                            </small>
                                        </div>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={fetchBookings}
                                            disabled={bookingsLoading}
                                        >
                                            <i className="bi bi-arrow-clockwise me-1"></i>
                                            Refresh
                                        </Button>
                                    </div>

                                    {bookingsLoading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                            <p className="mt-2">Loading bookings...</p>
                                        </div>
                                    ) : bookings.length === 0 ? (
                                        <Alert variant="info" className="text-center">
                                            <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
                                            <Alert.Heading>No Bookings Found</Alert.Heading>
                                            <p>There are no bookings scheduled for this date.</p>
                                        </Alert>
                                    ) : (
                                        <div className="table-responsive">
                                            <Table striped hover className="align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>
                                                            <i className="bi bi-clock me-1"></i>
                                                            Time
                                                        </th>
                                                        <th>
                                                            <i className="bi bi-person me-1"></i>
                                                            Visitor
                                                        </th>
                                                        <th>
                                                            <i className="bi bi-envelope me-1"></i>
                                                            Email
                                                        </th>
                                                        <th>
                                                            <i className="bi bi-calendar-event me-1"></i>
                                                            Booked At
                                                        </th>
                                                        <th className="text-center">
                                                            <i className="bi bi-gear me-1"></i>
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.map((booking) => (
                                                        <tr key={booking.id}>
                                                            <td>
                                                                <Badge bg="info" className="me-2">
                                                                    {formatTime(booking.start_time)}
                                                                </Badge>
                                                                <small className="text-muted">to</small>
                                                                <Badge bg="secondary" className="ms-2">
                                                                    {formatTime(booking.end_time)}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                                                                        {booking.visitor_name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="fw-medium">{booking.visitor_name}</div>
                                                                        <small className="text-muted">ID: #{booking.id}</small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href={`mailto:${booking.visitor_email}`} className="text-decoration-none">
                                                                    <i className="bi bi-envelope me-1"></i>
                                                                    {booking.visitor_email}
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <small>
                                                                    {formatDate(parseISO(booking.booked_at), 'MMM d, h:mm a')}
                                                                </small>
                                                            </td>
                                                            <td className="text-center">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    className="me-2"
                                                                    title="Send Reminder"
                                                                    onClick={() => sendReminder(booking.id)}
                                                                >
                                                                    <i className="bi bi-bell"></i>
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    title="Cancel Booking"
                                                                    onClick={() => handleDeleteClick(booking.id)}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-3 border-top">
                                        <Row>
                                            <Col md={6}>
                                                <Card className="border-0 bg-success bg-opacity-10">
                                                    <Card.Body className="py-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-success text-white rounded-circle p-2 me-3">
                                                                <i className="bi bi-people fs-4"></i>
                                                            </div>
                                                            <div>
                                                                <div className="fs-5 fw-bold">{bookings.length}</div>
                                                                <small className="text-muted">Total Bookings</small>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="border-0 bg-info bg-opacity-10">
                                                    <Card.Body className="py-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-info text-white rounded-circle p-2 me-3">
                                                                <i className="bi bi-calendar-check fs-4"></i>
                                                            </div>
                                                            <div>
                                                                <div className="fs-5 fw-bold">{format(selectedDate, 'MMM d')}</div>
                                                                <small className="text-muted">Selected Date</small>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                        Confirm Deletion
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="warning" className="mb-0">
                        <i className="bi bi-exclamation-octagon me-2"></i>
                        Are you sure you want to delete this booking? This action cannot be undone.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        <i className="bi bi-x-circle me-1"></i>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        <i className="bi bi-trash me-1"></i>
                        Delete Booking
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminPanel;