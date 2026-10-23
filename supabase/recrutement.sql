-- Ansanm : bloc « On recrute » et nouveaux champs de « Proposer un projet ».
-- À coller dans Supabase > SQL Editor > New query, puis « Run » (après schema.sql).

-- Personnes intéressées par un poste, ou qui recommandent quelqu'un (privé : ajout seulement)
create table if not exists public.interets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id text not null check (project_id in ('jardin-nourricier', 'cuisine-collective', 'atelier-upcycling', 'media-collectif')),
  type text not null check (type in ('moi', 'proche')),
  nom text not null check (char_length(nom) between 1 and 120),
  contact text not null check (char_length(contact) between 5 and 254),
  message text check (char_length(message) <= 600)
);

alter table public.interets enable row level security;
drop policy if exists "Se signaler pour un poste" on public.interets;
create policy "Se signaler pour un poste" on public.interets for insert to anon, authenticated with check (true);
revoke all on public.interets from anon, authenticated;
grant insert on public.interets to anon, authenticated;

-- Propositions : contact du porteur et réponses aux trois questions
alter table public.propositions add column if not exists contact text check (char_length(contact) <= 254);
alter table public.propositions add column if not exists demande_ok boolean not null default false;
alter table public.propositions add column if not exists referent_ok boolean not null default false;
alter table public.propositions add column if not exists emploi_ok boolean not null default false;
