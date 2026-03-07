-- Migration to create profiles table and setup admin permissions
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  email text,
  role text default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policies to recreate them
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Profiles are viewable by authenticated users." on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Admins can manage all profiles." on profiles;

-- Everyone can see profiles
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

-- Function to handle new user registration
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

-- Trigger to call handle_new_user on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
