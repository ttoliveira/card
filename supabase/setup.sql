-- ============================================================
-- Rode ESTE arquivo inteiro no SQL Editor do Supabase (uma vez)
-- Depois configure apenas o .env no frontend
-- ============================================================

-- Tabela
create table if not exists virtual_cards (
  id uuid primary key default gen_random_uuid(),
  edit_key text not null,
  slug text unique not null,
  template text not null default 'minimal',
  primary_color text,
  background_color text,
  button_color text,
  photo_url text,
  name text not null,
  whatsapp text,
  description text,
  services text,
  instagram text,
  linkedin text,
  website text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists virtual_cards_slug_idx on virtual_cards (slug);

-- RLS na tabela
alter table virtual_cards enable row level security;

drop policy if exists "Permitir insert anonimo" on virtual_cards;
drop policy if exists "Leitura publica" on virtual_cards;
drop policy if exists "Atualizar com edit_key" on virtual_cards;

create policy "Permitir insert anonimo"
  on virtual_cards for insert to anon, authenticated
  with check (true);

create policy "Leitura publica"
  on virtual_cards for select to anon, authenticated
  using (true);

create policy "Atualizar com edit_key"
  on virtual_cards for update to anon, authenticated
  using (true)
  with check (true);

-- Bucket de fotos (via SQL — não precisa abrir o Dashboard)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'card-photos',
  'card-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies do Storage
drop policy if exists "Leitura publica fotos" on storage.objects;
drop policy if exists "Upload fotos cartao" on storage.objects;
drop policy if exists "Atualizar fotos cartao" on storage.objects;

create policy "Leitura publica fotos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'card-photos');

create policy "Upload fotos cartao"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'card-photos');

create policy "Atualizar fotos cartao"
  on storage.objects for update to anon, authenticated
  using (bucket_id = 'card-photos');
