-- Ansanm : entraide entre pros (besoins, réponses, diagnostic de visibilité).
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».
--
-- besoins_pros         : lisibles par tous (sauf le contact), publiables par tous
-- reponses_besoins     : ajout seulement (privé)
-- demandes_diagnostic  : ajout seulement (privé)

create table if not exists public.besoins_pros (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  member_id text check (char_length(member_id) <= 40),
  structure text not null check (char_length(structure) between 1 and 120),
  description text not null check (char_length(description) between 5 and 200),
  type text not null check (type in ('service', 'coup_de_pouce', 'relocalisation')),
  domaine text check (char_length(domaine) <= 40),
  situation_actuelle text check (char_length(situation_actuelle) <= 300),
  statut text not null default 'ouvert' check (statut in ('ouvert', 'en cours', 'pourvu')),
  contact text not null check (char_length(contact) between 5 and 254)
);

create table if not exists public.reponses_besoins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  need_id text not null check (char_length(need_id) <= 60),
  type text not null check (type in ('service', 'coup_de_pouce')),
  nom text not null check (char_length(nom) between 1 and 120),
  contact text not null check (char_length(contact) between 5 and 254),
  message text not null check (char_length(message) between 1 and 1000),
  statut text not null default 'envoyé' check (statut in ('envoyé', 'accepté', 'partenariat'))
);

create table if not exists public.demandes_diagnostic (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  structure text not null check (char_length(structure) between 1 and 120),
  liens text check (char_length(liens) <= 500),
  contact text not null check (char_length(contact) between 5 and 254),
  message text check (char_length(message) <= 1000)
);

alter table public.besoins_pros enable row level security;
alter table public.reponses_besoins enable row level security;
alter table public.demandes_diagnostic enable row level security;

drop policy if exists "Besoins lisibles" on public.besoins_pros;
create policy "Besoins lisibles" on public.besoins_pros for select to anon, authenticated using (true);
drop policy if exists "Publier un besoin" on public.besoins_pros;
create policy "Publier un besoin" on public.besoins_pros for insert to anon, authenticated with check (statut = 'ouvert');
drop policy if exists "Répondre à un besoin" on public.reponses_besoins;
create policy "Répondre à un besoin" on public.reponses_besoins for insert to anon, authenticated with check (statut = 'envoyé');
drop policy if exists "Demander un diagnostic" on public.demandes_diagnostic;
create policy "Demander un diagnostic" on public.demandes_diagnostic for insert to anon, authenticated with check (true);

revoke all on public.besoins_pros, public.reponses_besoins, public.demandes_diagnostic from anon, authenticated;
grant select (id, created_at, member_id, structure, description, type, domaine, situation_actuelle, statut)
  on public.besoins_pros to anon, authenticated;
grant insert (id, member_id, structure, description, type, domaine, situation_actuelle, contact)
  on public.besoins_pros to anon, authenticated;
grant insert (need_id, type, nom, contact, message) on public.reponses_besoins to anon, authenticated;
grant insert (structure, liens, contact, message) on public.demandes_diagnostic to anon, authenticated;
