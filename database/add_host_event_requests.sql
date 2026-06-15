USE event_management_db;

CREATE TABLE IF NOT EXISTS host_event_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_category VARCHAR(100) NOT NULL,
  event_description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  event_location VARCHAR(255) NOT NULL,
  expected_participants INT NOT NULL CHECK (expected_participants > 0),
  additional_message TEXT,
  hosted_event_id INT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hosted_event_id) REFERENCES events(id) ON DELETE SET NULL,
  INDEX idx_host_request_status (status),
  INDEX idx_host_request_event_date (event_date)
);
