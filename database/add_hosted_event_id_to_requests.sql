USE event_management_db;

ALTER TABLE host_event_requests
  ADD COLUMN hosted_event_id INT NULL AFTER additional_message;

ALTER TABLE host_event_requests
  ADD CONSTRAINT fk_host_requests_hosted_event
  FOREIGN KEY (hosted_event_id) REFERENCES events(id) ON DELETE SET NULL;
