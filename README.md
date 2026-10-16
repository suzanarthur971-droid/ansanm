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
- `src/lib/store.jsx` — données + promesses enregistrées dans le navigateur (à remplacer par Supabase).
- `src/pages/` — une page par écran.

## Déploiement Cloudflare Pages

- Commande de build : `npm run build`
- Dossier de sortie : `dist`
- `public/_redirects` renvoie toutes les routes vers l'app.
