-- Update 'galleries' table for video and carousel support
ALTER TABLE public.galleries RENAME COLUMN image_url TO image_urls;
ALTER TABLE public.galleries ALTER COLUMN image_urls TYPE TEXT[] USING ARRAY[image_urls];
ALTER TABLE public.galleries ALTER COLUMN image_urls SET NOT NULL;
ALTER TABLE public.galleries ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image';
ALTER TABLE public.galleries ADD COLUMN video_url TEXT;

-- Update 'events' table for video support
ALTER TABLE public.events ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image';
ALTER TABLE public.events ADD COLUMN video_url TEXT;
