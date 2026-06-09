import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Styles/Navigation.css';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📅 Event Management
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Events
          </Link>
          {user && user.role !== 'admin' && (
            <Link to="/my-events" className="nav-link">
              My Events
            </Link>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/admin/users" className="nav-link">
                Users
              </Link>
            </>
          )}
          {!user ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          ) : (
            <div className="nav-user-menu">
              <span className="nav-user-name">{user.fullName}</span>
              <button className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
