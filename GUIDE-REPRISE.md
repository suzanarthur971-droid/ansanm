# Ansanm : guide de reprise

Ce guide s'adresse aux webdesigners, graphistes et développeurs qui reprennent le site après sa première version.

Cette première version a été construite avec l'aide d'une intelligence artificielle (Claude, d'Anthropic), à partir
du cahier des charges et des textes écrits par l'équipe d'Ansanm. Elle sert à montrer l'idée et à recueillir des avis.
Rien n'y est figé : le design, la typographie et la structure des pages sont là pour être repris, contestés et
améliorés par des mains d'ici.

Site en ligne : https://ansanm.lasssaintois.workers.dev

---

## 1. En une minute

- **Ce que c'est** : une plateforme associative guadeloupéenne. Chaque contribution (argent, matériel, temps,
  compétences) devient un « pavé » posé sur la « Trace » d'un projet.
- **Technique** : Vite + React 18 + Tailwind CSS 4, React Router. Données dans Supabase. Hébergé sur Cloudflare
  (Worker avec fichiers statiques), déployé automatiquement à chaque `git push` sur `main`.
- **Phase de lancement** : aucun paiement réel. Les dons sont des promesses. Les projets, personnes et montants de
  démonstration sont fictifs (fichiers JSON de `src/data/`).

## 2. Lancer le site sur son ordinateur

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173. Il lit et écrit dans le vrai Supabase (voir `.env`). Pour travailler sans
toucher aux vraies données, vider les deux variables :

```bash
VITE_SUPABASE_URL= VITE_SUPABASE_KEY= npm run dev
```

Tout est alors gardé dans le navigateur.

## 3. Où est quoi

```
src/
  pages/          une page par écran (Accueil, LaTrace, Projet, Contribuer, Annuaire, BesoinsPros,
                  PublierBesoin, Idees, Adherer, Proposer, RendezVous, Regles, Slogans, Introuvable)
  components/
    Layout.jsx      en-tête, menu (3 familles), barre d'onglets mobile, pied de page
    Nouveau.jsx     briques du design : Aplat, Action, Pierre, Kreyol, Option, champ, TraceHero
    Trace.jsx       la Trace d'un projet (sentier + pavés), la fiche d'un pavé, la légende
    MiniTrace.jsx   les petites Traces animées de l'accueil
    StoryPave.jsx   l'aperçu de la story Instagram après un pavé
    Avis.jsx        le bouton et le formulaire « Donner mon avis »
    Recrutement.jsx le bloc « On recrute » des fiches projets
  lib/
    store.jsx       toutes les données du site (démo + Supabase) et les actions (poser un pavé, adhérer…)
    supabase.js     les appels à Supabase
    paves.js        règles des pavés : tailles, couleurs, formats (euros, dates)
    story.js        le dessin de l'image story (canvas 1080 × 1920)
    partage.js      le partage natif du téléphone
  data/           données de démonstration (projets, besoins, pavés, annuaire, idées, rendez-vous…)
  index.css       couleurs, typographie et animations
supabase/         scripts SQL des tables (voir section 6)
tests/            test complet du site (voir section 8)
public/           logo, icônes, image d'aperçu des liens, maquette t-shirt
```

## 4. Le design actuel

### Couleurs

La palette vient de la planche de l'équipe (colorimétrie Ansanm). Elle est définie une seule fois, en haut de
`src/index.css`, et s'utilise dans les classes Tailwind (`bg-olive`, `text-terre-fonce`…).

| Nom | Couleur | Usage |
|---|---|---|
| `beige` | #E8DCC4 | grands aplats clairs, cartes, sentier de la Trace |
| `olive` | #4E5C4B | texte, aplats sombres, en-têtes de pages |
| `olive-nuit` | #3D4A3B | pied de page, bandeau du haut |
| `terre` | #C57B57 | pavés en argent, barres de progression |
| `terre-fonce` | #A35D3D | boutons et liens (le terracotta d'origine est trop clair pour du petit texte) |
| `sauge` | #A8BFA1 | aplats secondaires, pavés « temps » |
| `papier` | #F5F0E6 | fond des pages |

Les pavés ont une couleur par type de contribution : argent en terracotta, matériel en ocre, temps en sauge,
compétences en olive (`TYPES` dans `src/lib/paves.js`).

### Typographie

Une seule famille, **Bricolage Grotesque** (Google Fonts, police variable). Les titres sont gras et un peu serrés
(classe `.titre` ou balises `h1`, `h2`, `h3`, réglées dans `src/index.css`). Le logo est une image
(`public/logo-ansanm.png`), faite sur Canva.

### Principes

- Des **aplats pleine largeur** de la palette, plutôt que des cartes avec ombres.
- **Un seul élément fort par page**. Sur l'accueil, c'est la grande Trace du bandeau.
- Une animation seulement quand elle a un sens : un pavé qui se pose.
- **Mobile d'abord** : la plupart des visiteurs viennent d'Instagram. Barre d'onglets en bas, avec 5 onglets
  maximum et le pavé à poser au centre.

## 5. Les textes

- **Ton** : chaleureux, simple, fier, jamais contre quelqu'un. On tutoie le visiteur, on dit « nous » pour Ansanm.
  On parle de construire, pas de dénoncer. On vouvoie seulement les structures (annuaire, Entre pros).
- **Vocabulaire** : pavé, pierre, Trace, koudmen, référent.
- **Créole** : chaque expression est suivie de sa traduction (composant `Kreyol`).
- **Où les modifier** : les textes des pages sont dans `src/pages/`. Les contenus des projets, de l'annuaire et des
  rendez-vous sont dans `src/data/*.json`.

## 6. Supabase (les données)

Projet Supabase : `wyswtspobnulvbkjjdaa`. La clé utilisée par le site (`.env`) est la clé **publishable**. Elle est
publique par conception : la sécurité repose sur les règles de chaque table (Row Level Security).

> Ne jamais mettre la clé **secret** ou **service_role** dans le code, dans `.env` ou sur GitHub.

| Table | Public peut lire | Public peut ajouter | Rôle |
|---|---|---|---|
| `paves` | oui | oui | les pavés de la Trace |
| `contacts` | non | oui | e-mails des personnes à tenir informées |
| `adhesions` | non | oui | pré-adhésions |
| `propositions` | seulement celles marquées `publique` | oui | projets proposés, et les idées en germe |
| `idees_votes`, `idees_liens` | oui | oui | « je le rechercherais » et rapprochements |
| `interets` | non | oui | candidatures du bloc « On recrute » |
| `slogans`, `votes` | oui | oui | slogans t-shirts et votes |
| `besoins_pros` | oui (sans le contact) | oui | besoins publiés dans « Entre pros » |
| `reponses_besoins` | non | oui | réponses aux besoins des pros |
| `demandes_diagnostic` | non | oui | demandes de diagnostic de visibilité |
| `avis` | non | oui | avis de la phase de lancement |

Personne ne peut modifier ni supprimer depuis le site : la modération et les changements de statut (un besoin
« pourvu », par exemple) se font dans le tableau de bord Supabase (Table Editor).

Les scripts de `supabase/` recréent tout, dans cet ordre : `schema.sql`, `recrutement.sql`, `slogans.sql`,
`slogans-creole.sql`, `besoins-pros.sql`, `idees.sql`, `avis-media.sql`.

**Ajouter un projet** : l'ajouter dans `src/data/projects.json` (et ses besoins dans `needs.json`), puis autoriser son
identifiant dans les contraintes `project_id` des tables `paves`, `interets` et `idees_liens` (voir
`supabase/avis-media.sql` pour l'exemple).

## 7. Mise en ligne

Chaque `git push` sur la branche `main` du dépôt GitHub déclenche un déploiement sur Cloudflare (environ une minute).
La configuration est dans `wrangler.jsonc` : le site est construit (`npm run build`), puis le dossier `dist/` est
publié. Toute adresse inconnue renvoie l'application (React Router gère la page « introuvable »).

## 8. Tester avant une démo

Le test parcourt les pages sur mobile et sur ordinateur, vérifie les liens et remplit tous les formulaires, avec
Supabase débranché pour ne rien écrire dans la vraie base :

```bash
VITE_SUPABASE_URL= VITE_SUPABASE_KEY= npx vite --port 5174 &
/usr/local/bin/python3 tests/test_site.py
```

Il faut Python avec Playwright. Les captures d'écran de chaque page arrivent dans `tests/captures/`.

## 9. Ce qui reste à faire

Prévu dans la feuille de route, mais pas encore construit :

- paiements réels via HelloAsso, une fois l'association créée ;
- comptes utilisateurs (« mes pavés », « mes besoins ») ;
- espace d'administration : modérer les pavés, slogans, besoins et idées avant affichage, changer les statuts ;
- messagerie entre membres (aujourd'hui, la mise en relation se fait par e-mail) ;
- page d'aperçu propre à chaque projet quand on partage son lien ;
- nom de domaine définitif ;
- identité graphique complète (pictogrammes, affiches, visuels réseaux), photos des projets.

Les besoins du site sont aussi publiés sur la page « Entre pros », au nom d'Ansanm.
