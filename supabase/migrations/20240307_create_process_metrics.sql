-- Migration to create the process_metrics table
create table process_metrics (
  id uuid default gen_random_uuid() primary key,
  process_code varchar(50) not null,
  process_description varchar(200),
  group_code varchar(50) not null,
  group_description varchar(200),
  reference_date date,
  period varchar(7), -- Format MM/YYYY
  job_name varchar(100),
  program_name varchar(100),
  variant_name varchar(100),
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  responsible_user varchar(20),
  responsible_name varchar(100),
  processing_time_seconds bigint,
  processing_time_days int,
  processing_time_hours int,
  processing_time_minutes int,
  status varchar(50),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table process_metrics enable row level security;

-- Policies
create policy "Allow public read access" on process_metrics
  for select using (true);

-- Indexes for performance
create index idx_process_metrics_group on process_metrics(group_code);
create index idx_process_metrics_period on process_metrics(period);
create index idx_process_metrics_status on process_metrics(status);
