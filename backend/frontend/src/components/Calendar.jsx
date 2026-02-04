import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { Card } from 'react-bootstrap';

function Calendar({ onDateSelect, selectedDate }) {
    const [startDate, setStartDate] = useState(null);

    // Initialize with today's date when component mounts
    useEffect(() => {
        const today = new Date();
        setStartDate(today);
        onDateSelect(format(today, 'yyyy-MM-dd'));
    }, []);

    // Update when selectedDate prop changes (for clearing selection)
    useEffect(() => {
        if (selectedDate) {
            setStartDate(new Date(selectedDate));
        }
    }, [selectedDate]);

    const handleDateChange = (date) => {
        setStartDate(date);
        if (date) {
            onDateSelect(format(date, 'yyyy-MM-dd'));
        }
    };

    // Filter out past dates
    const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    // Highlight today's date
    const highlightToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
    };

    return (
        <Card className="calendar-container">
            <Card.Body>
                <Card.Title className="mb-3">
                    <i className="bi bi-calendar me-2"></i>
                    Select a Date
                </Card.Title>
                <div className="d-flex justify-content-center">
                    <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        inline
                        minDate={new Date()}
                        filterDate={date => !isPastDate(date)}
                        calendarClassName="custom-calendar"
                        dayClassName={date => 
                            highlightToday(date) ? 'highlight-today' : undefined
                        }
                        dateFormat="MMMM d, yyyy"
                    />
                </div>
                {startDate && (
                    <div className="mt-3 text-center">
                        <small className="text-muted">
                            Selected: <strong>{format(startDate, 'MMMM d, yyyy')}</strong>
                        </small>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default Calendar;