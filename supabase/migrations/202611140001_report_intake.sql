begin;

create schema mysociety;
revoke all on schema mysociety from public;

create table mysociety.wards (
  id integer generated always as identity primary key,
  name text not null unique,
  active boolean not null default true
);

create table mysociety.reports (
  id uuid primary key default gen_random_uuid(),
  ticket_code text not null unique,
  receipt_token_hash text not null unique,
  ward_id integer not null references mysociety.wards(id),
  category text not null check (category in ('water', 'roads', 'waste', 'drainage', 'streetlights', 'other')),
  landmark text not null check (char_length(landmark) between 1 and 200),
  description text not null check (char_length(description) between 1 and 2000),
  status text not null default 'SUBMITTED' check (status in ('SUBMITTED', 'IN_PROGRESS', 'RESOLVED')),
  visibility text not null default 'PENDING_REVIEW' check (visibility in ('PENDING_REVIEW', 'APPROVED', 'REJECTED')),
  version integer not null default 1,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  accuracy_m double precision check (accuracy_m >= 0 and accuracy_m < 'Infinity'::float8),
  pin_source text check (pin_source in ('device', 'manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((latitude is null) = (longitude is null)),
  check ((latitude is null) = (pin_source is null)),
  check (accuracy_m is null or (pin_source is not null and pin_source = 'device'))
);

create table mysociety.report_events (
  id bigint generated always as identity primary key,
  report_id uuid not null references mysociety.reports(id),
  actor_id uuid,
  event_type text not null,
  old_status text,
  new_status text,
  note text,
  created_at timestamptz not null default now()
);

create table mysociety.submission_keys (
  key uuid primary key,
  request_hash text not null,
  report_id uuid not null unique references mysociety.reports(id),
  expires_at timestamptz not null
);

create index reports_public_recent on mysociety.reports (created_at desc, id desc)
  where visibility = 'APPROVED';
create index reports_ward_recent on mysociety.reports (ward_id, created_at desc);
create index report_events_timeline on mysociety.report_events (report_id, id);

commit;
