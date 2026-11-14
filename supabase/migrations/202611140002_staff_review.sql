begin;

create table mysociety.staff_members (
  user_id uuid primary key
);

alter table mysociety.wards
  add column center_latitude double precision check (center_latitude between -85 and 85),
  add column center_longitude double precision check (center_longitude between -180 and 180),
  add check ((center_latitude is null) = (center_longitude is null));

commit;
