import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import hostEventRequestService from '../services/hostEventRequestService';
import './styles/ContactUs.css';

const initialFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  eventTitle: '',
  eventCategory: '',
  eventDescription: '',
  eventDate: '',
  eventTime: '',
  eventLocation: '',
  expectedParticipants: '',
  additionalMessage: '',
};

const categories = [
  'Conference',
  'Seminar',
  'Workshop',
  'Social Gathering',
  'Networking',
  'Webinar',
  'Training',
  'Meetup',
];

function ContactUs() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPreviousRequests, setShowPreviousRequests] = useState(false);
  const [previousRequests, setPreviousRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        fullName: current.fullName || user.fullName || '',
        email: current.email || user.email || '',
      }));
    }
  }, [user]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = 'Enter a valid email';
    if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phoneNumber)) nextErrors.phoneNumber = 'Enter a valid phone number';
    if (!formData.eventTitle.trim()) nextErrors.eventTitle = 'Event title is required';
    if (!formData.eventCategory) nextErrors.eventCategory = 'Select an event category';
    if (formData.eventDescription.trim().length < 20) nextErrors.eventDescription = 'Description must be at least 20 characters';
    if (!formData.eventDate) nextErrors.eventDate = 'Event date is required';
    if (!formData.eventTime) nextErrors.eventTime = 'Event time is required';
    if (!formData.eventLocation.trim()) nextErrors.eventLocation = 'Event location is required';

    const participants = Number(formData.expectedParticipants);
    if (!Number.isInteger(participants) || participants < 1) {
      nextErrors.expectedParticipants = 'Expected participants must be at least 1';
    }

    if (formData.eventDate) {
      const eventDate = new Date(`${formData.eventDate}T${formData.eventTime || '00:00'}`);
      if (eventDate < new Date()) {
        nextErrors.eventDate = 'Event date and time must be in the future';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const openNewRequestModal = () => {
    setSuccessMessage('');
    setSubmitError('');
    setShowRequestModal(true);
  };

  const closeNewRequestModal = () => {
    setShowRequestModal(false);
    setErrors({});
  };

  const loadPreviousRequests = async () => {
    try {
      setLoadingRequests(true);
      setShowPreviousRequests(true);
      const data = await hostEventRequestService.getMyRequests();
      setPreviousRequests(data.requests);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to load previous requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setSubmitError('');

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await hostEventRequestService.createRequest({
        ...formData,
        expectedParticipants: Number(formData.expectedParticipants),
      });
      setFormData({
        ...initialFormData,
        fullName: user?.fullName || '',
        email: user?.email || '',
      });
      setSuccessMessage('Your host event request has been submitted successfully. Our team will review it soon.');
      setShowRequestModal(false);
      if (showPreviousRequests) {
        loadPreviousRequests();
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="contact-page">
      <section className="host-hero-panel">
        <p className="contact-eyebrow">Host with EventHUB</p>
        <h1>Bring your next event to the right audience.</h1>
        <p>Submit a hosting request, track previous requests, and let the admin team help publish approved events.</p>

        <div className="host-actions">
          <button type="button" className="host-action-card" onClick={loadPreviousRequests}>
            <span>01</span>
            <div>
              <strong>Previous Host Event Requests</strong>
              <small>Review submitted requests and their approval status.</small>
            </div>
          </button>
          <button type="button" className="host-action-card primary" onClick={openNewRequestModal}>
            <span>02</span>
            <div>
              <strong>Host New Event</strong>
              <small>Share event details for admin review and publishing.</small>
            </div>
          </button>
        </div>
      </section>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {submitError && <div className="error-message">{submitError}</div>}

      {showPreviousRequests && (
        <section className="previous-requests-panel">
          <div className="previous-requests-header">
            <div>
              <p className="contact-eyebrow">Your Requests</p>
              <h2>Previous Host Event Requests</h2>
            </div>
          </div>

          {loadingRequests ? (
            <div className="empty-state">Loading your requests...</div>
          ) : previousRequests.length === 0 ? (
            <div className="empty-state">No host event requests submitted yet</div>
          ) : (
            <div className="previous-request-grid">
              {previousRequests.map((request) => (
                <article className="previous-request-card" key={request.id}>
                  <div className="previous-request-title">
                    <div>
                      <span>{request.event_category}</span>
                      <h3>{request.event_title}</h3>
                    </div>
                    <strong className={`request-status ${request.status}`}>{request.status}</strong>
                  </div>
                  <div className="previous-request-meta">
                    <span>{formatDate(request.event_date)}</span>
                    <span>{request.event_location}</span>
                    <span>{request.expected_participants} participants</span>
                  </div>
                  <p>{request.event_description}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {showRequestModal && (
        <div className="host-modal-overlay" onClick={closeNewRequestModal}>
          <section className="contact-panel host-modal" onClick={(e) => e.stopPropagation()}>
            <div className="host-modal-header">
              <div>
                <p className="contact-eyebrow">New Request</p>
                <h2>Host New Event</h2>
              </div>
              <button type="button" className="host-modal-close" onClick={closeNewRequestModal} aria-label="Close host event form">
                &times;
              </button>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eventTitle">Event Title</label>
                <input id="eventTitle" name="eventTitle" value={formData.eventTitle} onChange={handleChange} />
                {errors.eventTitle && <span className="field-error">{errors.eventTitle}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eventCategory">Event Category</label>
                <select id="eventCategory" name="eventCategory" value={formData.eventCategory} onChange={handleChange}>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.eventCategory && <span className="field-error">{errors.eventCategory}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eventDate">Event Date</label>
                <input id="eventDate" name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} />
                {errors.eventDate && <span className="field-error">{errors.eventDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eventTime">Event Time</label>
                <input id="eventTime" name="eventTime" type="time" value={formData.eventTime} onChange={handleChange} />
                {errors.eventTime && <span className="field-error">{errors.eventTime}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eventLocation">Event Location</label>
                <input id="eventLocation" name="eventLocation" value={formData.eventLocation} onChange={handleChange} />
                {errors.eventLocation && <span className="field-error">{errors.eventLocation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="expectedParticipants">Expected Participants</label>
                <input
                  id="expectedParticipants"
                  name="expectedParticipants"
                  type="number"
                  min="1"
                  value={formData.expectedParticipants}
                  onChange={handleChange}
                />
                {errors.expectedParticipants && <span className="field-error">{errors.expectedParticipants}</span>}
              </div>

              <div className="form-group full-span">
                <label htmlFor="eventDescription">Event Description</label>
                <textarea
                  id="eventDescription"
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleChange}
                />
                {errors.eventDescription && <span className="field-error">{errors.eventDescription}</span>}
              </div>

              <div className="form-group full-span">
                <label htmlFor="additionalMessage">Additional Message</label>
                <textarea
                  id="additionalMessage"
                  name="additionalMessage"
                  value={formData.additionalMessage}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions full-span">
                <button type="button" className="btn btn-secondary" onClick={closeNewRequestModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default ContactUs;
