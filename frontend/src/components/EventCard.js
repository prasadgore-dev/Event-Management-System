import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPrompt from './LoginPrompt';
import './Styles/EventCard.css';

function EventCard({ event, onRegister, onCancel, isRegistered }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const remainingCapacity = event.capacity - event.registered_count;
  const isEventFull = remainingCapacity <= 0;
  const hasPassedDeadline = event.registration_deadline && new Date(event.registration_deadline) < new Date();

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      onRegister(event.id);
    }
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    onCancel(event.id);
  };

  return (
    <>
      <div className="event-card" onClick={() => navigate(`/event/${event.id}`)}>
        <div className="event-card-header">
          <div className="event-card-title-row">
            <h3>{event.title}</h3>
            {event.category && <span className="badge badge-category">{event.category}</span>}
          </div>
          <div className="event-card-badges">
            {isEventFull && <span className="badge badge-full">Sold Out</span>}
            {isRegistered && <span className="badge badge-registered">Registered</span>}
          </div>
        </div>
        <div className="event-card-body">
          <p className="event-description">{event.description.substring(0, 100)}...</p>
          <div className="event-info">
            <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
            <p>📍 {event.location}</p>
            <p>👥 {event.registered_count}/{event.capacity} registered</p>
          </div>
        </div>
        <div className="event-card-footer">
          {isRegistered ? (
            <button className="btn btn-danger" onClick={handleCancelClick}>
              Cancel Registration
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleRegisterClick}
              disabled={isEventFull || hasPassedDeadline}
            >
              {isEventFull ? 'Sold Out' : hasPassedDeadline ? 'Deadline Passed' : 'Register'}
            </button>
          )}
        </div>
      </div>
      <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </>
  );
}

export default EventCard;
