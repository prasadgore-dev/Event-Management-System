import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import './styles/Users.css';

function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users');
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <p className="users-eyebrow">Admin</p>
          <h1>Users</h1>
          <p>People registered in the application</p>
        </div>
        <div className="users-total">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <div className="empty-state">No users found</div>
      ) : (
        <div className="users-panel">
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registrations</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((appUser) => (
                  <tr key={appUser.id} className={appUser.id === user.id ? 'current-user-row' : ''}>
                    <td data-label="Name">{appUser.full_name}</td>
                    <td data-label="Email">{appUser.email}</td>
                    <td data-label="Role">
                      <span className={`role-badge ${appUser.role}`}>{appUser.role}</span>
                    </td>
                    <td data-label="Registrations">{appUser.registrations_count}</td>
                    <td data-label="Joined">{formatDate(appUser.created_at)}</td>
                    <td data-label="Status">
                      {appUser.id === user.id ? (
                        <span className="status-badge active">Current session</span>
                      ) : (
                        <span className="status-badge">Registered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
