import React from 'react';
import './Styles/ConfirmRegistrationModal.css';

function ConfirmRegistrationModal({
  event,
  isOpen,
  onClose,
  onConfirm,
  mode = 'register',
}) {
  if (!isOpen || !event) return null;

  const isCancelMode = mode === 'cancel';
  const heading = isCancelMode ? 'Confirm Cancellation' : 'Confirm Registration';
  const message = isCancelMode
    ? 'Are you sure you want to cancel your registration for this event?'
    : 'Are you sure you want to register for this event?';
  const confirmLabel = isCancelMode ? 'Cancel Registration' : 'Confirm Registration';
  const confirmClassName = isCancelMode ? 'btn btn-danger' : 'btn btn-primary';

  return (
    <div className="confirm-registration-overlay" onClick={onClose}>
      <div className="confirm-registration-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-registration-header">
          <div>
            <p>{heading}</p>
            <h2>{event.title}</h2>
          </div>
          <button type="button" className="confirm-registration-close" onClick={onClose} aria-label="Close confirmation">
            &times;
          </button>
        </div>

        <div className="confirm-registration-details">
          <div>
            <span>Date</span>
            <strong>{new Date(event.event_date).toLocaleString()}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{event.location}</strong>
          </div>
        </div>

        <p className="confirm-registration-copy">
          {message}
        </p>

        <div className="confirm-registration-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={confirmClassName} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRegistrationModal;
