import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import registrationService from '../services/registrationService';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import './styles/MyEvents.css';

function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadMyEvents();
  }, [user, navigate]);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user registrations
      const registrationsData = await registrationService.getUserRegistrations();
      
      // Get event details for each registration
      const eventPromises = registrationsData.registrations.map(reg =>
        eventService.getEventById(reg.event_id)
          .then(event => ({ ...event, registrationId: reg.id }))
          .catch(err => {
            console.error(`Failed to load event ${reg.event_id}:`, err);
            return null;
          })
      );
      
      const events = (await Promise.all(eventPromises)).filter(e => e !== null);
      
      // Sort by event date
      events.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
      
      setRegisteredEvents(events);
    } catch (err) {
      setError('Failed to load your registered events');
      console.error('Error loading my events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId, registrationId) => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) {
      return;
    }
    try {
      await registrationService.cancelRegistration(registrationId);
      alert('Registration cancelled successfully');
      loadMyEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel registration');
    }
  };

  if (!user) {
    return <div className="loading">Please log in to view your registered events</div>;
  }

  return (
    <div className="my-events">
      <div className="page-header">
        <h1>My Registered Events</h1>
        <p className="subtitle">Events you have registered for</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading your events...</div>
      ) : registeredEvents.length === 0 ? (
        <div className="no-events">
          <p>You haven't registered for any events yet.</p>
          <a href="/" className="btn btn-primary">Browse Events</a>
        </div>
      ) : (
        <>
          <div className="events-count">
            <span>{registeredEvents.length} event{registeredEvents.length !== 1 ? 's' : ''} registered</span>
          </div>
          <div className="events-grid">
            {registeredEvents.map((event) => (
              <div key={event.id} className="my-event-card-wrapper">
                <EventCard
                  event={event}
                  onCancel={() => handleCancelRegistration(event.id, event.registrationId)}
                  isRegistered={true}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyEvents;
