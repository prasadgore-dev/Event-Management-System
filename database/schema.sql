-- Create the Event Management database
CREATE DATABASE IF NOT EXISTS event_management_db;
USE event_management_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('attendee', 'admin') DEFAULT 'attendee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_date DATETIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  registration_deadline DATETIME,
  category ENUM('Conference', 'Seminar', 'Workshop', 'Social Gathering', 'Networking', 'Webinar', 'Training', 'Meetup') DEFAULT 'Conference',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_date (event_date),
  INDEX idx_registration_deadline (registration_deadline),
  INDEX idx_category (category)
);

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_event (user_id, event_id),
  INDEX idx_user_id (user_id),
  INDEX idx_event_id (event_id),
  INDEX idx_registration_date (registration_date)
);

-- Insert sample admin user (password: admin123)
-- bcrypt hash of 'admin123' with 10 salt rounds
INSERT INTO users (email, full_name, password_hash, role) 
VALUES ('admin@example.com', 'Admin User', '$2a$10$ubiOdpinUxegnzpwtP/vZO.EtZu225qjM9IpBV1vRiitTvwIVW0.m', 'admin')
ON DUPLICATE KEY UPDATE id=id;
