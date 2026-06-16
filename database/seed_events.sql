-- Insert 10 realistic test events with categories.
-- Run with: psql -d event_management_db -f database/seed_events.sql

INSERT INTO events (title, description, event_date, location, capacity, registration_deadline, category)
SELECT *
FROM (
  VALUES
  (
    'React Advanced Patterns Conference 2026',
    'Join us for an in-depth conference on advanced React patterns, hooks, and performance optimization. Learn from industry experts about the latest trends in React development and best practices for building scalable applications.',
    '2026-07-15 09:00:00'::timestamp,
    'San Francisco Convention Center',
    500,
    '2026-07-08 23:59:59'::timestamp,
    'Conference'
  ),
  (
    'JavaScript Security Seminar',
    'A comprehensive seminar covering security vulnerabilities in JavaScript applications, OWASP top 10, secure coding practices, and how to protect your applications from common attacks.',
    '2026-06-20 14:00:00'::timestamp,
    'New York Tech Hub',
    150,
    '2026-06-18 23:59:59'::timestamp,
    'Seminar'
  ),
  (
    'Web Development Workshop: Building Full-Stack Apps',
    'Hands-on workshop where you will learn to build complete full-stack applications using Node.js, React, and PostgreSQL. Perfect for intermediate developers looking to expand their skill set.',
    '2026-07-01 10:00:00'::timestamp,
    'Austin Tech Center',
    80,
    '2026-06-25 23:59:59'::timestamp,
    'Workshop'
  ),
  (
    'Tech Community Social Gathering',
    'Casual networking event for developers, designers, and tech enthusiasts. Connect with like-minded professionals, share ideas, and enjoy light refreshments.',
    '2026-06-28 18:00:00'::timestamp,
    'Downtown Coffee House',
    100,
    '2026-06-27 23:59:59'::timestamp,
    'Social Gathering'
  ),
  (
    'Professional Networking Breakfast',
    'Morning networking event featuring breakfast and discussions with senior software engineers and tech leads. Great opportunity to build professional connections.',
    '2026-07-10 08:00:00'::timestamp,
    'Hilton Downtown Seattle',
    120,
    '2026-07-09 23:59:59'::timestamp,
    'Networking'
  ),
  (
    'AI and Machine Learning Webinar Series',
    'Live webinar discussing the latest advancements in AI and machine learning. Topics include neural networks, deep learning, and practical applications in industry.',
    '2026-06-22 16:00:00'::timestamp,
    'Virtual Event',
    500,
    '2026-06-21 23:59:59'::timestamp,
    'Webinar'
  ),
  (
    'Database Design and Optimization Training',
    'Intensive training course on designing efficient databases, query optimization, indexing strategies, and scaling databases for high-traffic applications.',
    '2026-07-05 09:00:00'::timestamp,
    'Boston Innovation Hub',
    60,
    '2026-07-02 23:59:59'::timestamp,
    'Training'
  ),
  (
    'Cloud Architecture Meetup',
    'Casual meetup for cloud engineers to discuss AWS, Azure, and GCP best practices. Share experiences and learn from peers about cloud architecture patterns.',
    '2026-06-30 17:30:00'::timestamp,
    'Chicago Tech Lounge',
    80,
    '2026-06-29 23:59:59'::timestamp,
    'Meetup'
  ),
  (
    'DevOps Best Practices Workshop',
    'Comprehensive workshop covering CI/CD pipelines, containerization with Docker, Kubernetes, Infrastructure as Code, and monitoring strategies for modern applications.',
    '2026-07-12 10:00:00'::timestamp,
    'Los Angeles Tech Park',
    90,
    '2026-07-10 23:59:59'::timestamp,
    'Workshop'
  ),
  (
    'Frontend Developer Seminar: Performance Optimization',
    'Seminar focused on optimizing web application performance, lazy loading, code splitting, caching strategies, and browser optimization techniques.',
    '2026-07-18 13:00:00'::timestamp,
    'Miami Beach Convention Center',
    200,
    '2026-07-15 23:59:59'::timestamp,
    'Seminar'
  )
) AS seed(title, description, event_date, location, capacity, registration_deadline, category)
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE events.title = seed.title
);
