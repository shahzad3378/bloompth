alter table public.products
  add column if not exists video_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-videos',
  'product-videos',
  true,
  20971520,
  array['video/mp4', 'video/webm']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product videos" on storage.objects;
create policy "Public can view product videos"
on storage.objects for select
to public
using (bucket_id = 'product-videos');

drop policy if exists "Authenticated users can upload product videos" on storage.objects;
create policy "Authenticated users can upload product videos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-videos');

drop policy if exists "Authenticated users can update product videos" on storage.objects;
create policy "Authenticated users can update product videos"
on storage.objects for update
to authenticated
using (bucket_id = 'product-videos')
with check (bucket_id = 'product-videos');

drop policy if exists "Authenticated users can delete product videos" on storage.objects;
create policy "Authenticated users can delete product videos"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-videos');
