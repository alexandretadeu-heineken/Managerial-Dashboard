-- Migration to add role to profiles and setup admin permissions
alter table public.profiles add column if not exists role text default 'user';

-- Update the handle_new_user function to ensure it doesn't break and potentially set initial admin
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.email,
    case 
      when not exists (select 1 from public.profiles) then 'admin'
      else 'user'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Update RLS policies for profiles
alter table public.profiles enable row level security;

-- Drop existing policies to recreate them
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Admins can do everything." on profiles;

-- Everyone can see profiles (or maybe only authenticated?)
create policy "Profiles are viewable by authenticated users." on profiles
  for select to authenticated using (true);

-- Users can update their own basic info
create policy "Users can update own profile." on profiles
  for update to authenticated 
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can manage all profiles
create policy "Admins can manage all profiles." on profiles
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
