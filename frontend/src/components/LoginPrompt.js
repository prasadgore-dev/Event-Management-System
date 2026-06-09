import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/LoginPrompt.css';

function LoginPrompt({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Sign In Required</h2>
        <p>You need to be logged in to register for events.</p>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
          <button className="btn btn-secondary" onClick={handleRegister}>
            Create Account
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPrompt;
