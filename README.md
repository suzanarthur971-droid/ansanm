# Ansanm — démo bêta

Démo cliquable d'Ansanm, plateforme associative guadeloupéenne : « pavé par pavé ».

## Lancer en local

```bash
npm install
npm run dev
```

## Structure

- `src/data/` — données de démonstration (projets, besoins, pavés, annuaire, rendez-vous). Tout est fictif.
- `src/components/Trace.jsx` — la Trace : sentier, pavés, fiche d'un pavé, légende.
- `src/lib/store.jsx` + `src/lib/supabase.js` — données de démo + pavés, adhésions et propositions enregistrés dans Supabase.
- `supabase/schema.sql` — tables et règles de sécurité, à exécuter dans le SQL Editor de Supabase.
- `.env` — URL et clé **publishable** Supabase (publiques par conception). Ne jamais y mettre la clé secret / service_role.
- `src/pages/` — une page par écran.

## Déploiement Cloudflare

Le projet est déployé comme Worker avec fichiers statiques (`wrangler.jsonc`).

- Commande de build : `npm run build`
- Commande de déploiement : `npx wrangler deploy`
- Les routes inconnues renvoient l'app (`not_found_handling: single-page-application`).

## Tester tout le site avant une démo

Teste les 15 pages (mobile et ordinateur), les liens et tous les formulaires, avec Supabase débranché
pour ne laisser aucune donnée de test. Nécessite Python et Playwright.

```bash
VITE_SUPABASE_URL= VITE_SUPABASE_KEY= npx vite --port 5174 &
/usr/local/bin/python3 tests/test_site.py
```

Les captures sont enregistrées dans `tests/captures/`.
