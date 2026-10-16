// Icônes au trait, 24×24, couleur héritée.
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const chemins = {
  accueil: <path d="M4 11l8-6.5L20 11M6 9.5V20h12V9.5" />,
  trace: <path d="M6 20c0-4 12-4 12-8S6 8 6 4M5 4h2M17 12h2M5 20h2" />,
  plus: <path d="M12 5v14M5 12h14" />,
  annuaire: <path d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4zM9 9h6M9 13h6M5 18a2 2 0 012-2h12" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fermer: <path d="M6 6l12 12M18 6L6 18" />,
  fleche: <path d="M5 12h14M13 6l6 6-6 6" />,
  retour: <path d="M19 12H5M11 6l-6 6 6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  argent: <path d="M12 3.5v17M16.5 7.5c-.6-1.4-2.3-2.2-4.5-2.2-2.6 0-4.3 1.3-4.3 3.1 0 4.4 9 2.4 9 6.9 0 1.9-1.9 3.3-4.7 3.3-2.3 0-4-.9-4.7-2.4" />,
  materiel: <path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8" />,
  temps: <><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></>,
  competences: <path d="M12 3l2.4 5.6 6 .5-4.6 4 1.4 5.9L12 16l-5.2 3 1.4-5.9-4.6-4 6-.5z" />,
  calendrier: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  lieu: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  personne: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.6 3.7-5.5 7-5.5s6.2 1.9 7 5.5" /></>,
  emploi: <><rect x="4" y="8" width="16" height="11" rx="2" /><path d="M9 8V6a1 1 0 011-1h4a1 1 0 011 1v2M4 13h16" /></>,
  preuve: <><path d="M9 12l2 2 4-4" /><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" /></>,
  boucle: <path d="M4 12a8 8 0 0113.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 01-13.7 5.6L4 15M4 20v-5h5" />,
  marmite: <path d="M3 10h18M5 10v6a4 4 0 004 4h6a4 4 0 004-4v-6M9 7c0-1.2 1-1.2 1-2.5M14 7c0-1.2 1-1.2 1-2.5" />,
  feuille:<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7" />,
  vote: <path d="M7 11l3 3 7-7M4 20h16" />,
  magazine: <><path d="M5 4h11l3 3v13H5z" /><path d="M9 9h6M9 13h6M9 17h3" /></>,
}

export default function Icone({ nom, className = 'w-5 h-5', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} {...rest}>
      {chemins[nom]}
    </svg>
  )
}
