-- Ansanm : inscriptions aux koudmen, et correction « biten » dans les slogans.
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

-- Inscriptions : le nombre d'inscrits est public, le prénom et le contact restent privés
create table if not exists public.koudmen_inscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  koudmen_id text not null check (char_length(koudmen_id) <= 80),
  prenom text not null check (char_length(prenom) between 1 and 80),
  contact text not null check (char_length(contact) between 5 and 254)
);
alter table public.koudmen_inscriptions enable row level security;
drop policy if exists "Compter les inscrits" on public.koudmen_inscriptions;
create policy "Compter les inscrits" on public.koudmen_inscriptions for select to anon, authenticated using (true);
drop policy if exists "S'inscrire à un koudmen" on public.koudmen_inscriptions;
create policy "S'inscrire à un koudmen" on public.koudmen_inscriptions for insert to anon, authenticated with check (true);
revoke all on public.koudmen_inscriptions from anon, authenticated;
grant select (koudmen_id) on public.koudmen_inscriptions to anon, authenticated;
grant insert (koudmen_id, prenom, contact) on public.koudmen_inscriptions to anon, authenticated;

-- « bagay » est martiniquais : en Guadeloupe, on dit « biten »
update public.slogans set texte = 'Chak moun ni on biten a pòté' where texte = 'Chak moun ni on bagay a pòté';
