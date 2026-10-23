-- Ansanm : avis de la phase de lancement, et ajout du projet « Média collectif ».
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

-- Avis des visiteurs (privé : ajout seulement, lecture dans le tableau de bord)
create table if not exists public.avis (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  page text check (char_length(page) <= 120),
  poserait text check (poserait in ('oui', 'peut-etre', 'non')),
  plu text check (char_length(plu) <= 1000),
  manque text check (char_length(manque) <= 1000),
  contact text check (char_length(contact) <= 254)
);
alter table public.avis enable row level security;
drop policy if exists "Donner son avis" on public.avis;
create policy "Donner son avis" on public.avis for insert to anon, authenticated with check (true);
revoke all on public.avis from anon, authenticated;
grant insert (page, poserait, plu, manque, contact) on public.avis to anon, authenticated;

-- Le 4e projet peut recevoir des pavés et des candidatures
alter table public.paves drop constraint if exists paves_project_id_check;
alter table public.paves add constraint paves_project_id_check check (project_id in ('jardin-nourricier', 'cuisine-collective', 'atelier-upcycling', 'media-collectif'));
alter table public.interets drop constraint if exists interets_project_id_check;
alter table public.interets add constraint interets_project_id_check check (project_id in ('jardin-nourricier', 'cuisine-collective', 'atelier-upcycling', 'media-collectif'));
