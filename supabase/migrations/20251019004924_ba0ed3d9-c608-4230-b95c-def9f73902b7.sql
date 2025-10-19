-- Create welcome_section table
CREATE TABLE public.welcome_section (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  video_url text,
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.welcome_section ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published welcome sections"
ON public.welcome_section
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage welcome sections"
ON public.welcome_section
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create notice_board table
CREATE TABLE public.notice_board (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  media_url text,
  media_type text DEFAULT 'image',
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notice_board ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published notice board items"
ON public.notice_board
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage notice board"
ON public.notice_board
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_welcome_section_updated_at
BEFORE UPDATE ON public.welcome_section
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notice_board_updated_at
BEFORE UPDATE ON public.notice_board
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Make event_date and event_time nullable in announcements (they might already be)
-- Make event_date and event_time nullable in events (they might already be)
-- Add end_date for date ranges in events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date date;