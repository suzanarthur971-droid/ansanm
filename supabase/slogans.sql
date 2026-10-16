-- Ansanm bêta : slogans t-shirts et votes.
-- À coller dans Supabase > SQL Editor > New query, puis « Run » (après schema.sql).
--
-- Sécurité : tout le monde peut lire les slogans et leur nombre de votes, proposer un slogan et voter.
-- Personne ne peut modifier ni supprimer depuis le site.

create table if not exists public.slogans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  texte text not null check (char_length(btrim(texte)) between 3 and 60),
  votes_depart integer not null default 0
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slogan_id uuid not null references public.slogans (id) on delete cascade
);

alter table public.slogans enable row level security;
alter table public.votes enable row level security;

drop policy if exists "Slogans lisibles" on public.slogans;
create policy "Slogans lisibles" on public.slogans for select to anon, authenticated using (true);
drop policy if exists "Proposer un slogan" on public.slogans;
create policy "Proposer un slogan" on public.slogans for insert to anon, authenticated with check (votes_depart = 0);
drop policy if exists "Votes lisibles" on public.votes;
create policy "Votes lisibles" on public.votes for select to anon, authenticated using (true);
drop policy if exists "Voter" on public.votes;
create policy "Voter" on public.votes for insert to anon, authenticated with check (true);

revoke all on public.slogans, public.votes from anon, authenticated;
grant select on public.slogans to anon, authenticated;
grant insert (id, texte) on public.slogans to anon, authenticated;
grant select (slogan_id) on public.votes to anon, authenticated;
grant insert (slogan_id) on public.votes to anon, authenticated;

-- Classement : votes de départ (démo) + votes reçus
create or replace view public.slogans_classement with (security_invoker = on) as
  select s.id, s.texte, s.created_at, s.votes_depart + count(v.slogan_id)::int as votes
  from public.slogans s
  left join public.votes v on v.slogan_id = s.id
  group by s.id;

grant select on public.slogans_classement to anon, authenticated;

-- Slogans de démonstration
insert into public.slogans (texte, votes_depart)
select t, n from (values
  ('Pavé par pavé.', 34),
  ('Un pavé, c''est déjà un chemin.', 27),
  ('Je pose mon pavé.', 21),
  ('Ici, on plante l''avenir.', 18),
  ('Fait ici, pour ici.', 12),
  ('Ensemble, on va plus loin.', 9)
) as d(t, n)
where not exists (select 1 from public.slogans);
