-- Create the gallery_sections table
CREATE TABLE public.gallery_sections (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    name TEXT NOT NULL,
    display_order INT NOT NULL
);

ALTER TABLE public.gallery_sections OWNER TO postgres;
ALTER TABLE ONLY public.gallery_sections
    ADD CONSTRAINT gallery_sections_pkey PRIMARY KEY (id);

-- Add initial gallery sections
INSERT INTO public.gallery_sections (name, display_order) VALUES
    ('General Photos', 1),
    ('Services in Display', 2),
    ('Videos', 3);

-- Update the galleries table
ALTER TABLE public.galleries
ADD COLUMN section_id UUID REFERENCES public.gallery_sections(id);

-- Update existing gallery items to use the new sections
UPDATE public.galleries
SET section_id = (SELECT id FROM public.gallery_sections WHERE name = 'General Photos')
WHERE media_type = 'image' AND category != 'service';

UPDATE public.galleries
SET section_id = (SELECT id FROM public.gallery_sections WHERE name = 'Services in Display')
WHERE media_type = 'image' AND category = 'service';

UPDATE public.galleries
SET section_id = (SELECT id FROM public.gallery_sections WHERE name = 'Videos')
WHERE media_type = 'video';

-- Remove the old columns
ALTER TABLE public.galleries
DROP COLUMN category,
DROP COLUMN media_type;

-- RLS Policies for gallery_sections
ALTER TABLE public.gallery_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.gallery_sections
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow admin all access" ON public.gallery_sections
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
