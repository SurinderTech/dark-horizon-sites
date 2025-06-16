
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the `scheduled-twitter-poster` edge function to run every minute using Supabase's pg_cron.
-- This ensures your scheduled posts are processed and posted to X (Twitter) automatically!

select
cron.schedule(
  'run-scheduled-twitter-poster-every-minute',
  '* * * * *', -- every minute
  $$
  select
    net.http_post(
        url:='https://qaojozbqboktlhtyvyrd.supabase.co/functions/v1/scheduled-twitter-poster',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhb2pvemJxYm9rdGxodHl2eXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjE0MDAsImV4cCI6MjA2MzU5NzQwMH0.N-IkS2bmj34mTm03rjwKfqqGOK4iVB3319DTYHzbD8I"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- If you ever want to remove this job, use:
-- select cron.unschedule('run-scheduled-twitter-poster-every-minute');
