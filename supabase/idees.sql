-- Ansanm : idées en germe (propositions publiques, « je le rechercherais », rapprochements).
-- À coller dans Supabase > SQL Editor > New query, puis « Run » (après schema.sql et recrutement.sql).

-- Une proposition peut être rendue publique, avec un nom affiché
alter table public.propositions add column if not exists publique boolean not null default false;
alter table public.propositions add column if not exists porteur text check (char_length(porteur) <= 80);

-- Seules les propositions publiques sont lisibles, et seulement leurs colonnes publiques
drop policy if exists "Idées publiques lisibles" on public.propositions;
create policy "Idées publiques lisibles" on public.propositions for select to anon, authenticated using (publique = true);
grant select (id, created_at, titre, domaine, description, porteur, publique) on public.propositions to anon, authenticated;

-- « Je le rechercherais »
create table if not exists public.idees_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  proposition_id uuid not null references public.propositions (id) on delete cascade
);

-- « Ça irait avec tel projet »
create table if not exists public.idees_liens (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  proposition_id uuid not null references public.propositions (id) on delete cascade,
  project_id text not null check (project_id in ('jardin-nourricier', 'cuisine-collective', 'atelier-upcycling', 'media-collectif')),
  message text not null check (char_length(message) between 5 and 200)
);

alter table public.idees_votes enable row level security;
alter table public.idees_liens enable row level security;

drop policy if exists "Votes d'idées lisibles" on public.idees_votes;
create policy "Votes d'idées lisibles" on public.idees_votes for select to anon, authenticated using (true);
drop policy if exists "Voter pour une idée" on public.idees_votes;
create policy "Voter pour une idée" on public.idees_votes for insert to anon, authenticated
  with check (exists (select 1 from public.propositions p where p.id = proposition_id and p.publique));

drop policy if exists "Rapprochements lisibles" on public.idees_liens;
create policy "Rapprochements lisibles" on public.idees_liens for select to anon, authenticated using (true);
drop policy if exists "Proposer un rapprochement" on public.idees_liens;
create policy "Proposer un rapprochement" on public.idees_liens for insert to anon, authenticated
  with check (exists (select 1 from public.propositions p where p.id = proposition_id and p.publique));

revoke all on public.idees_votes, public.idees_liens from anon, authenticated;
grant select (proposition_id) on public.idees_votes to anon, authenticated;
grant insert (proposition_id) on public.idees_votes to anon, authenticated;
grant select (proposition_id, project_id, message, created_at) on public.idees_liens to anon, authenticated;
grant insert (proposition_id, project_id, message) on public.idees_liens to anon, authenticated;
