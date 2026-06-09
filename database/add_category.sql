-- Add category column to existing events table
ALTER TABLE events ADD COLUMN category ENUM('Conference', 'Seminar', 'Workshop', 'Social Gathering', 'Networking', 'Webinar', 'Training', 'Meetup') DEFAULT 'Conference' AFTER registration_deadline;

-- Add index on category
CREATE INDEX idx_category ON events(category);
