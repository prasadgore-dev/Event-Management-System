import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPrompt from '../components/LoginPrompt';
import ConfirmRegistrationModal from '../components/ConfirmRegistrationModal';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import './styles/EventDetail.css';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfirmRegistration, setShowConfirmRegistration] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const loadEvent = useCallback(async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err) {
      console.error('Failed to load event:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadUserRegistrations = useCallback(async () => {
    try {
      const data = await registrationService.getUserRegistrations();
      const eventIds = data.registrations.map(r => r.event_id);
      setUserRegistrations(eventIds);
      setIsRegistered(eventIds.includes(parseInt(id)));
    } catch (err) {
      console.error('Failed to load registrations:', err);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
    if (user) {
      loadUserRegistrations();
    }
  }, [id, user, loadEvent, loadUserRegistrations]);



  const handleRegister = () => {
    setShowConfirmRegistration(true);
  };

  const confirmRegister = async () => {
    setShowConfirmRegistration(false);
    try {
      await registrationService.registerEvent(parseInt(id));
      alert('Successfully registered for event!');
      loadEvent();
      loadUserRegistrations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register');
    }
  };

  const handleCancelRegistration = () => {
    setShowConfirmCancel(true);
  };

  const confirmCancelRegistration = async () => {
    setShowConfirmCancel(false);
    try {
      const registration = userRegistrations.find(r => r === parseInt(id));
      await registrationService.cancelRegistration(registration);
      alert('Registration cancelled successfully');
      loadEvent();
      loadUserRegistrations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel registration');
    }
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (!event) {
    return <div className="error-message">Event not found</div>;
  }

  const remainingCapacity = event.capacity - event.registered_count;
  const isFull = remainingCapacity <= 0;
  const hasPassedDeadline = event.registration_deadline && new Date(event.registration_deadline) < new Date();

  return (
    <div className="event-detail">
      <button className="btn btn-back" onClick={() => navigate('/events')}>
        ← Back to Events
      </button>

      <div className="event-detail-card">
        <div className="event-detail-header">
          <h1>{event.title}</h1>
          <div className="event-badges">
            {isFull && <span className="badge badge-full">Sold Out</span>}
            {isRegistered && <span className="badge badge-registered">Registered</span>}
            {hasPassedDeadline && <span className="badge badge-deadline">Deadline Passed</span>}
          </div>
        </div>

        <div className="event-detail-body">
          <section className="event-section">
            <h2>Description</h2>
            <p>{event.description}</p>
          </section>

          <section className="event-section event-info-grid">
            <div className="info-item">
              <span className="label">📅 Date & Time:</span>
              <span className="value">{new Date(event.event_date).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">📍 Location:</span>
              <span className="value">{event.location}</span>
            </div>
            <div className="info-item">
              <span className="label">👥 Capacity:</span>
              <span className="value">{event.capacity}</span>
            </div>
            <div className="info-item">
              <span className="label">📊 Registered:</span>
              <span className="value">{event.registered_count}</span>
            </div>
            <div className="info-item">
              <span className="label">🎫 Available Spots:</span>
              <span className="value">{remainingCapacity > 0 ? remainingCapacity : 'None'}</span>
            </div>
            {event.registration_deadline && (
              <div className="info-item">
                <span className="label">⏰ Registration Deadline:</span>
                <span className="value">{new Date(event.registration_deadline).toLocaleString()}</span>
              </div>
            )}
          </section>
        </div>

        <div className="event-detail-footer">
          {!user ? (
            <button className="btn btn-primary" onClick={() => setShowLoginPrompt(true)}>
              Sign in to Register
            </button>
          ) : isRegistered ? (
            <button className="btn btn-danger" onClick={handleCancelRegistration}>
              Cancel Registration
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleRegister}
              disabled={isFull || hasPassedDeadline}
            >
              {isFull ? 'Event is Full' : hasPassedDeadline ? 'Registration Deadline Passed' : 'Register for Event'}
            </button>
          )}
        </div>
      </div>
      <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
      <ConfirmRegistrationModal
        event={event}
        isOpen={showConfirmRegistration}
        onClose={() => setShowConfirmRegistration(false)}
        onConfirm={confirmRegister}
      />
      <ConfirmRegistrationModal
        event={event}
        isOpen={showConfirmCancel}
        onClose={() => setShowConfirmCancel(false)}
        onConfirm={confirmCancelRegistration}
        mode="cancel"
      />
    </div>
  );
}

export default EventDetail;
