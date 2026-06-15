import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import hostEventRequestService from '../services/hostEventRequestService';
import './styles/HostEventRequests.css';

const emptyApprovalForm = {
  title: '',
  category: '',
  description: '',
  eventDate: '',
  eventTime: '',
  location: '',
  capacity: '',
  registrationDeadline: '',
};

function HostEventRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [approvalRequest, setApprovalRequest] = useState(null);
  const [approvalForm, setApprovalForm] = useState(emptyApprovalForm);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadRequests();
  }, [user, navigate]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await hostEventRequestService.getRequests();
      setRequests(data.requests);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load host event requests');
    } finally {
      setLoading(false);
    }
  };

  const toDateInputValue = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 10);
  };

  const openApprovalPopup = (request) => {
    setApprovalRequest(request);
    setApprovalForm({
      title: request.event_title,
      category: request.event_category,
      description: request.event_description,
      eventDate: toDateInputValue(request.event_date),
      eventTime: String(request.event_time || '').slice(0, 5),
      location: request.event_location,
      capacity: String(request.expected_participants),
      registrationDeadline: '',
    });
  };

  const closeApprovalPopup = () => {
    setApprovalRequest(null);
    setApprovalForm(emptyApprovalForm);
  };

  const handleApprovalFormChange = (e) => {
    const { name, value } = e.target;
    setApprovalForm((current) => ({ ...current, [name]: value }));
  };

  const confirmApproval = async (e) => {
    e.preventDefault();
    if (!approvalRequest) return;

    const eventData = {
      title: approvalForm.title,
      category: approvalForm.category,
      description: approvalForm.description,
      eventDate: `${approvalForm.eventDate} ${approvalForm.eventTime}`,
      location: approvalForm.location,
      capacity: Number(approvalForm.capacity),
      registrationDeadline: approvalForm.registrationDeadline || null,
    };

    try {
      setUpdatingId(approvalRequest.id);
      const data = await hostEventRequestService.updateStatus(approvalRequest.id, 'approved', eventData);
      setRequests((currentRequests) =>
        currentRequests.map((request) => (request.id === approvalRequest.id ? data.request : request))
      );
      setActiveTab('approved');
      closeApprovalPopup();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve request');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setUpdatingId(id);
      const data = await hostEventRequestService.updateStatus(id, 'rejected');
      setRequests((currentRequests) =>
        currentRequests.map((request) => (request.id === id ? data.request : request))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject request');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const pendingRequests = requests.filter((request) => request.status === 'pending');
  const approvedRequests = requests.filter((request) => request.status === 'approved');
  const visibleRequests = activeTab === 'pending' ? pendingRequests : approvedRequests;

  if (loading) {
    return <div className="loading">Loading host event requests...</div>;
  }

  return (
    <div className="host-requests-page">
      <div className="host-requests-header">
        <div>
          <p className="host-requests-eyebrow">Admin Review</p>
          <h1>Host Event Requests</h1>
          <p>Review event hosting requests submitted from the Contact Us page.</p>
        </div>
        <div className="request-total">
          <span>Total Requests</span>
          <strong>{requests.length}</strong>
        </div>
      </div>

      <div className="request-tabs" role="tablist" aria-label="Host request filters">
        <button
          type="button"
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests ({pendingRequests.length})
        </button>
        <button
          type="button"
          className={activeTab === 'approved' ? 'active' : ''}
          onClick={() => setActiveTab('approved')}
        >
          Approved ({approvedRequests.length})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {visibleRequests.length === 0 ? (
        <div className="empty-state">No {activeTab} host event requests found</div>
      ) : (
        <div className="requests-grid">
          {visibleRequests.map((request) => (
            <article className="request-card" key={request.id}>
              <div className="request-card-header">
                <div>
                  <span className="request-user">{request.full_name}</span>
                  <h2>{request.event_title}</h2>
                </div>
                <span className={`request-status ${request.status}`}>{request.status}</span>
              </div>

              <div className="request-details">
                <div>
                  <span>Category</span>
                  <strong>{request.event_category}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{formatDate(request.event_date)}</strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{request.event_location}</strong>
                </div>
                <div>
                  <span>Expected participants</span>
                  <strong>{request.expected_participants}</strong>
                </div>
              </div>

              <p className="request-description">{request.event_description}</p>

              {request.additional_message && (
                <p className="request-message">{request.additional_message}</p>
              )}

              <div className="request-contact">
                <span>{request.email}</span>
                <span>{request.phone_number}</span>
              </div>

              {activeTab === 'pending' ? (
                <div className="request-actions">
                  <button
                    type="button"
                    className="btn btn-approve"
                    disabled={updatingId === request.id}
                    onClick={() => openApprovalPopup(request)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-reject"
                    disabled={updatingId === request.id}
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="hosted-note">
                  Hosted event ID: {request.hosted_event_id || 'Created'}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {approvalRequest && (
        <div className="approval-modal-overlay" onClick={closeApprovalPopup}>
          <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
            <div className="approval-modal-header">
              <div>
                <p className="host-requests-eyebrow">Confirm Hosting</p>
                <h2>Are you sure to host this event?</h2>
              </div>
              <button type="button" className="approval-close" onClick={closeApprovalPopup} aria-label="Close approval popup">
                &times;
              </button>
            </div>

            <form className="approval-form" onSubmit={confirmApproval}>
              <div className="form-group">
                <label htmlFor="approval-title">Event Title</label>
                <input id="approval-title" name="title" value={approvalForm.title} onChange={handleApprovalFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="approval-category">Category</label>
                <input id="approval-category" name="category" value={approvalForm.category} onChange={handleApprovalFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="approval-date">Event Date</label>
                <input id="approval-date" name="eventDate" type="date" value={approvalForm.eventDate} onChange={handleApprovalFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="approval-time">Event Time</label>
                <input id="approval-time" name="eventTime" type="time" value={approvalForm.eventTime} onChange={handleApprovalFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="approval-location">Location</label>
                <input id="approval-location" name="location" value={approvalForm.location} onChange={handleApprovalFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="approval-capacity">Capacity</label>
                <input id="approval-capacity" name="capacity" type="number" min="1" value={approvalForm.capacity} onChange={handleApprovalFormChange} required />
              </div>
              <div className="form-group full-span">
                <label htmlFor="approval-deadline">Registration Deadline</label>
                <input id="approval-deadline" name="registrationDeadline" type="datetime-local" value={approvalForm.registrationDeadline} onChange={handleApprovalFormChange} />
              </div>
              <div className="form-group full-span">
                <label htmlFor="approval-description">Event Description</label>
                <textarea id="approval-description" name="description" value={approvalForm.description} onChange={handleApprovalFormChange} required />
              </div>
              <div className="approval-actions full-span">
                <button type="button" className="btn btn-secondary" onClick={closeApprovalPopup}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-approve" disabled={updatingId === approvalRequest.id}>
                  Host Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HostEventRequests;
