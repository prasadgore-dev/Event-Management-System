import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import './styles/Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [pendingDeleteEvent, setPendingDeleteEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    capacity: '',
    registrationDeadline: '',
  });

  const totalRegistrations = events.reduce(
    (total, event) => total + Number(event.registered_count || 0),
    0
  );
  const totalCapacity = events.reduce(
    (total, event) => total + Number(event.capacity || 0),
    0
  );
  const upcomingEvents = events.filter((event) => new Date(event.event_date) >= new Date()).length;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatDateTime = (date) =>
    new Date(date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  const toDateTimeInputValue = (date) => (date ? String(date).replace(' ', 'T').slice(0, 16) : '');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      loadEvents();
    }
  }, [user, navigate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents(1, 100);
      setEvents(data.events);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (event) => {
    setViewingEvent(event);
    setSelectedEvent(event.id);
    setRegistrations([]);
    setRegistrationsLoading(true);
    try {
      const data = await registrationService.getEventRegistrations(event.id);
      setRegistrations(data.registrations);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const closeViewPopup = () => {
    setViewingEvent(null);
    setRegistrations([]);
    setRegistrationsLoading(false);
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      location: '',
      capacity: '',
      registrationDeadline: '',
    });
    setShowForm(true);
  };

  const closeEventForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      eventDate: toDateTimeInputValue(event.event_date),
      location: event.location,
      capacity: event.capacity.toString(),
      registrationDeadline: toDateTimeInputValue(event.registration_deadline),
    });
    setShowForm(true);
  };

  const handleDeleteClick = (event) => {
    setPendingDeleteEvent(event);
  };

  const closeDeletePopup = () => {
    setPendingDeleteEvent(null);
  };

  const confirmDeleteEvent = async () => {
    if (!pendingDeleteEvent) return;

    try {
      await eventService.deleteEvent(pendingDeleteEvent.id);
      alert('Event deleted successfully');
      loadEvents();
      setSelectedEvent(null);
      setRegistrations([]);
      setViewingEvent(null);
      closeDeletePopup();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, formData);
        alert('Event updated successfully');
      } else {
        await eventService.createEvent(formData);
        alert('Event created successfully');
      }
      loadEvents();
      closeEventForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save event');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Control Center</p>
          <h1>Admin Dashboard</h1>
        </div>
        <button className="btn btn-primary dashboard-create-btn" onClick={handleCreateClick}>
          Create New Event
        </button>
      </div>

      <div className="dashboard-stats" aria-label="Dashboard summary">
        <div className="stat-card">
          <span className="stat-label">Total Events</span>
          <strong>{events.length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Upcoming</span>
          <strong>{upcomingEvents}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Registrations</span>
          <strong>{totalRegistrations}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Capacity Used</span>
          <strong>{totalCapacity ? Math.round((totalRegistrations / totalCapacity) * 100) : 0}%</strong>
        </div>
      </div>

      {showForm && (
        <div className="dashboard-modal-overlay" onClick={closeEventForm}>
          <div className="form-section dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <div>
                <p className="dashboard-eyebrow">Event Setup</p>
                <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeEventForm} aria-label="Close form">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Date:</label>
                <input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacity:</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Registration Deadline (optional):</label>
                <input
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                />
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-secondary" onClick={closeEventForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingEvent && (
        <div className="dashboard-modal-overlay" onClick={closeViewPopup}>
          <div className="dashboard-modal event-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <div>
                <p className="dashboard-eyebrow">Event Details</p>
                <h2>{viewingEvent.title}</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeViewPopup} aria-label="Close details">
                &times;
              </button>
            </div>

            <div className="event-detail-grid">
              <div className="detail-item">
                <span>Date</span>
                <strong>{formatDateTime(viewingEvent.event_date)}</strong>
              </div>
              <div className="detail-item">
                <span>Location</span>
                <strong>{viewingEvent.location}</strong>
              </div>
              <div className="detail-item">
                <span>Registrations</span>
                <strong>{viewingEvent.registered_count}/{viewingEvent.capacity}</strong>
              </div>
              <div className="detail-item">
                <span>Deadline</span>
                <strong>
                  {viewingEvent.registration_deadline
                    ? formatDateTime(viewingEvent.registration_deadline)
                    : 'Not set'}
                </strong>
              </div>
              {viewingEvent.category && (
                <div className="detail-item">
                  <span>Category</span>
                  <strong>{viewingEvent.category}</strong>
                </div>
              )}
            </div>

            <div className="event-description-block">
              <h3>Description</h3>
              <p>{viewingEvent.description}</p>
            </div>

            <div className="modal-section-header">
              <h3>Registrations</h3>
              <span className="registrations-count">{registrations.length}</span>
            </div>

            {registrationsLoading ? (
              <div className="empty-state">Loading registrations...</div>
            ) : registrations.length === 0 ? (
              <div className="empty-state">No registrations for this event</div>
            ) : (
              <div className="registrations-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg.id}>
                        <td data-label="Name">{reg.full_name}</td>
                        <td data-label="Email">{reg.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {pendingDeleteEvent && (
        <div className="dashboard-modal-overlay" onClick={closeDeletePopup}>
          <div className="dashboard-modal delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <div>
                <p className="dashboard-eyebrow">Confirm Delete</p>
                <h2>Delete Event</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeDeletePopup} aria-label="Close delete confirmation">
                &times;
              </button>
            </div>
            <p className="delete-confirm-text">
              Are you sure you want to delete <strong>{pendingDeleteEvent.title}</strong>? This will remove the event and its registrations.
            </p>
            <div className="form-buttons">
              <button type="button" className="btn btn-secondary" onClick={closeDeletePopup}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDeleteEvent}>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content events-only">
        <div className="events-list">
          <div className="section-header">
            <div>
              <h2>Events</h2>
              <p>Manage event details and attendee lists</p>
            </div>
          </div>
          {events.length === 0 ? (
            <div className="empty-state">No events created yet</div>
          ) : (
            <div className="events-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Registrations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className={selectedEvent === event.id ? 'active' : ''}>
                      <td data-label="Title">
                        <button
                          type="button"
                          className="event-title-button"
                          onClick={() => handleViewClick(event)}
                        >
                          {event.title}
                        </button>
                      </td>
                      <td data-label="Date">{formatDate(event.event_date)}</td>
                      <td data-label="Location">{event.location}</td>
                      <td data-label="Registrations">
                        <div className="registration-meter">
                          <span>{event.registered_count}/{event.capacity}</span>
                          <div className="meter-track">
                            <div
                              className="meter-fill"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((Number(event.registered_count || 0) / Number(event.capacity || 1)) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td data-label="Actions">
                        <div className="row-actions">
                          <button
                            className="btn btn-small btn-view"
                            onClick={() => handleViewClick(event)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-small btn-warning"
                            onClick={() => handleEditClick(event)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => handleDeleteClick(event)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
