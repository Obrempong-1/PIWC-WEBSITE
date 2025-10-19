-- Update events table to match the Event interface

-- Rename event_date to start_date
ALTER TABLE public.events RENAME COLUMN event_date TO start_date;

-- Add icon column
ALTER TABLE public.events ADD COLUMN icon TEXT;