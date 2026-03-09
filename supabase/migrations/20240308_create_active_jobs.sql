-- Migration: Create active_jobs table
-- Description: Table to track jobs currently in progress

-- Create active_jobs table
CREATE TABLE IF NOT EXISTS public.active_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_code TEXT NOT NULL,
    process_description TEXT,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completion_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'finished')),
    progress_percentage NUMERIC DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.active_jobs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read
CREATE POLICY "Allow authenticated users to read active_jobs"
ON public.active_jobs FOR SELECT
TO authenticated
USING (true);

-- Create policy for authenticated users to manage active_jobs
CREATE POLICY "Allow authenticated users to manage active_jobs"
ON public.active_jobs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_active_jobs_updated_at
    BEFORE UPDATE ON public.active_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
