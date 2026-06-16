-- Create the PostgreSQL database before running this file:
-- createdb event_management_db
-- psql -d event_management_db -f database/schema.sql

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'attendee' CHECK (role IN ('attendee', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_role ON users(role);

DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  registration_deadline TIMESTAMP,
  category VARCHAR(100) DEFAULT 'Conference' CHECK (
    category IN ('Conference', 'Seminar', 'Workshop', 'Social Gathering', 'Networking', 'Webinar', 'Training', 'Meetup')
  ),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_registration_deadline ON events(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_category ON events(category);

DROP TRIGGER IF EXISTS set_events_updated_at ON events;
CREATE TRIGGER set_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_event UNIQUE (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registration_date ON registrations(registration_date);

-- Host Event Requests Table
CREATE TABLE IF NOT EXISTS host_event_requests (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_category VARCHAR(100) NOT NULL,
  event_description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  event_location VARCHAR(255) NOT NULL,
  expected_participants INTEGER NOT NULL CHECK (expected_participants > 0),
  additional_message TEXT,
  hosted_event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_host_request_status ON host_event_requests(status);
CREATE INDEX IF NOT EXISTS idx_host_request_event_date ON host_event_requests(event_date);

DROP TRIGGER IF EXISTS set_host_event_requests_updated_at ON host_event_requests;
CREATE TRIGGER set_host_event_requests_updated_at
BEFORE UPDATE ON host_event_requests
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, full_name, password_hash, role)
VALUES ('admin@example.com', 'Admin User', '$2a$10$ubiOdpinUxegnzpwtP/vZO.EtZu225qjM9IpBV1vRiitTvwIVW0.m', 'admin')
ON CONFLICT (email) DO NOTHING;
