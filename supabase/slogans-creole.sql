-- Ansanm : remplace les slogans de démo par des expressions créoles, avec leur traduction.
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

alter table public.slogans add column if not exists traduction text check (char_length(traduction) <= 120);

create or replace view public.slogans_classement with (security_invoker = on) as
  select s.id, s.texte, s.created_at, s.votes_depart + count(v.slogan_id)::int as votes, s.traduction
  from public.slogans s
  left join public.votes v on v.slogan_id = s.id
  group by s.id;

grant select on public.slogans_classement to anon, authenticated;

delete from public.slogans where texte in (
  'Pavé par pavé.', 'Un pavé, c''est déjà un chemin.', 'Je pose mon pavé.',
  'Ici, on plante l''avenir.', 'Fait ici, pour ici.', 'Ensemble, on va plus loin.'
);

insert into public.slogans (texte, traduction)
select t, tr from (values
  ('Sé on min ka lavé lòt', 'Une main lave l''autre'),
  ('Ansanm nou pli fò', 'Ensemble, nous sommes plus forts'),
  ('Men nan men', 'Main dans la main'),
  ('Yonn pou lòt', 'L''un pour l''autre'),
  ('Chak moun ni on bagay a pòté', 'Chaque personne a quelque chose à apporter'),
  ('Sé ansanm nou ka vansé', 'C''est ensemble que nous avançons'),
  ('On sèl dwèt pa ka manjé kalalou', 'Un seul doigt ne peut pas manger le calalou')
) as d(t, tr)
where not exists (select 1 from public.slogans s where s.texte = d.t);
