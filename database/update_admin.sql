-- Update admin password hash
UPDATE users SET password_hash='$2a$10$ubiOdpinUxegnzpwtP/vZO.EtZu225qjM9IpBV1vRiitTvwIVW0.m' WHERE email='admin@example.com';
SELECT email, password_hash FROM users WHERE email='admin@example.com';
