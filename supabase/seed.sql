insert into mysociety.wards (name)
values ('Ward 1'), ('Ward 2'), ('Ward 3')
on conflict (name) do nothing;
