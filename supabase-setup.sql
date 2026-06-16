-- Run this in your Supabase SQL Editor

create table inbox_messages (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  ts timestamptz default now(),
  read boolean default false
);

alter table inbox_messages enable row level security;

create policy "allow insert" on inbox_messages for insert to anon with check (true);
create policy "allow select" on inbox_messages for select using (true);
create policy "allow update" on inbox_messages for update using (true);
create policy "allow delete" on inbox_messages for delete using (true);
