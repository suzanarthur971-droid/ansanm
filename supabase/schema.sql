-- Ansanm bêta : tables Supabase.
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».
--
-- Sécurité (Row Level Security) :
--   paves        : tout le monde peut lire et ajouter (c'est la Trace publique), personne ne modifie ni ne supprime
--   contacts     : ajout seulement (les e-mails ne sont jamais lisibles depuis le site)
--   adhesions    : ajout seulement
--   propositions : ajout seulement
-- Les données privées se consultent dans le tableau de bord Supabase (Table Editor).

create table if not exists public.paves (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id text not null check (project_id in ('jardin-nourricier', 'cuisine-collective', 'atelier-upcycling', 'media-collectif')),
  need_id text check (char_length(need_id) <= 40),
  type text not null check (type in ('argent', 'materiel', 'temps', 'competences')),
  montant integer check (montant between 1 and 100000),
  description text check (char_length(description) <= 300),
  valeur_estimee integer check (valeur_estimee between 0 and 100000),
  motivation text check (char_length(motivation) <= 140),
  nom_affiche text not null check (char_length(nom_affiche) between 1 and 80),
  profil text not null check (profil in ('particulier', 'entreprise', 'association')),
  anonyme boolean not null default false,
  consentement_contact boolean not null default false,
  check ((type = 'argent' and montant is not null) or (type <> 'argent' and description is not null))
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  pave_id uuid references public.paves (id) on delete cascade,
  email text not null check (char_length(email) between 3 and 254 and email like '%@%')
);

create table if not exists public.adhesions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('particulier', 'association', 'entreprise')),
  nom text not null check (char_length(nom) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254 and email like '%@%'),
  commune text check (char_length(commune) <= 80)
);

create table if not exists public.propositions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  titre text not null check (char_length(titre) between 1 and 120),
  domaine text check (char_length(domaine) <= 40),
  description text not null check (char_length(description) <= 3000),
  emplois text check (char_length(emplois) <= 300),
  referent text check (char_length(referent) <= 200),
  preuve text check (char_length(preuve) <= 500),
  besoins text check (char_length(besoins) <= 2000)
);

alter table public.paves enable row level security;
alter table public.contacts enable row level security;
alter table public.adhesions enable row level security;
alter table public.propositions enable row level security;

drop policy if exists "Trace lisible par tous" on public.paves;
create policy "Trace lisible par tous" on public.paves for select to anon, authenticated using (true);
drop policy if exists "Poser un pavé" on public.paves;
create policy "Poser un pavé" on public.paves for insert to anon, authenticated with check (true);

drop policy if exists "Laisser un contact" on public.contacts;
create policy "Laisser un contact" on public.contacts for insert to anon, authenticated with check (true);
drop policy if exists "Pré-adhérer" on public.adhesions;
create policy "Pré-adhérer" on public.adhesions for insert to anon, authenticated with check (true);
drop policy if exists "Proposer un projet" on public.propositions;
create policy "Proposer un projet" on public.propositions for insert to anon, authenticated with check (true);

-- Seules les colonnes publiques de la Trace sont lisibles depuis le site
revoke all on public.paves, public.contacts, public.adhesions, public.propositions from anon, authenticated;
grant select (id, created_at, project_id, need_id, type, montant, description, valeur_estimee, motivation, nom_affiche, profil, anonyme)
  on public.paves to anon, authenticated;
grant insert on public.paves, public.contacts, public.adhesions, public.propositions to anon, authenticated;
