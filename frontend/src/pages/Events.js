import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import './styles/Events.css';

const CATEGORY_TABS = ['All', 'Seminar', 'Conference', 'Workshop', 'Meetup', 'Webinar'];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userRegistrations, setUserRegistrations] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const category = selectedCategory === 'All' ? null : selectedCategory;
      const data = await eventService.getEvents(page, 10, search || null, null, null, category);
      setEvents(data.events);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    loadEvents();
  }, [page, search, loadEvents]);

  useEffect(() => {
    if (user) {
      loadUserRegistrations();
    } else {
      setUserRegistrations([]);
    }
  }, [user]);

  const loadUserRegistrations = async () => {
    try {
      const data = await registrationService.getUserRegistrations();
      setUserRegistrations(data.registrations.map((registration) => registration.event_id));
    } catch (err) {
      console.error('Failed to load registrations:', err);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await registrationService.registerEvent(eventId);
      alert('Successfully registered for event!');
      navigate('/my-events');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register');
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) {
      return;
    }
    try {
      const registration = userRegistrations.find((item) => item.event_id === eventId);
      await registrationService.cancelRegistration(registration?.id);
      alert('Registration cancelled successfully');
      loadEvents();
      loadUserRegistrations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel registration');
    }
  };

  const availableEvents = user
    ? events.filter((event) => !userRegistrations.includes(event.id))
    : events;

  return (
    <div className="events-page">
      <div className="search-container">
        <p className="events-eyebrow">EventHUB Events</p>
        <h1>Explore Upcoming Events</h1>
        <p className="events-intro">Find seminars, conferences, meetups, and workshops designed for learning and connection.</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="category-filters" aria-label="Event category filters">
          <div className="category-tabs">
            {CATEGORY_TABS.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setPage(1);
                }}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <>
          {availableEvents.length === 0 ? (
            <div className="no-events">No events found</div>
          ) : (
            <div className="events-grid">
              {availableEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  onCancel={handleCancelRegistration}
                  isRegistered={userRegistrations.includes(event.id)}
                />
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Events;
