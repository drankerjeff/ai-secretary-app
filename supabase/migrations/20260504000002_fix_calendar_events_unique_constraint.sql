DROP INDEX IF EXISTS calendar_events_google_event_id_user_id_idx;

ALTER TABLE calendar_events
  ADD CONSTRAINT calendar_events_google_event_id_user_id_unique
  UNIQUE (google_event_id, user_id);
