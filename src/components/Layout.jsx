import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icone from './Icones.jsx'

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
        <rect x="4" y="17" width="10" height="9" rx="2.5" fill="#B84A26" />
        <rect x="15.5" y="14.5" width="11.5" height="11.5" rx="2.5" fill="#3D7A3A" />
        <ellipse cx="12.5" cy="10" rx="5.2" ry="3.7" fill="#D49A2E" />
      </svg>
      <span className="font-display text-2xl font-extrabold text-terre-fonce tracking-tight">Ansanm</span>
    </span>
  )
}

const liensPrincipaux = [
  { to: '/trace', label: 'La Trace' },
  { to: '/annuaire', label: 'Annuaire' },
  { to: '/rendez-vous', label: 'Rendez-vous' },
  { to: '/regles', label: 'Nos règles' },
]

const liensMenu = [
  { to: '/', label: 'Accueil' },
  { to: '/trace', label: 'La Trace' },
  { to: '/contribuer', label: 'Poser mon pavé' },
  { to: '/annuaire', label: 'Annuaire' },
  { to: '/adherer', label: 'Adhérer' },
  { to: '/proposer', label: 'Proposer un projet' },
  { to: '/rendez-vous', label: 'Rendez-vous' },
  { to: '/regles', label: 'Nos règles' },
]

function OngletBas({ to, icone, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium flex-1 py-2 ${isActive ? 'text-terre' : 'text-encre-doux'}`
      }
    >
      <Icone nom={icone} className="w-6 h-6" />
      {label}
    </NavLink>
  )
}

export default function Layout({ children }) {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setMenu(false) }, [pathname])

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="bg-encre text-sable text-center text-xs py-1.5 px-4">
        Version bêta de démonstration — données fictives, aucun paiement réel.
      </div>

      <header className="sticky top-0 z-30 bg-sable-clair/90 backdrop-blur border-b border-sable-fonce/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" aria-label="Ansanm, accueil">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {liensPrincipaux.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-sable text-terre-fonce' : 'text-encre-doux hover:text-encre'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/adherer" className="ml-2 px-4 py-2 rounded-full text-sm font-semibold text-feuille-fonce border border-feuille/40 hover:bg-feuille/10">
              Adhérer
            </Link>
            <Link to="/contribuer" className="px-4 py-2 rounded-full text-sm font-semibold bg-terre text-white hover:bg-terre-fonce">
              Poser mon pavé
            </Link>
          </nav>
          <button onClick={() => setMenu(true)} className="md:hidden p-2 -mr-2 text-encre" aria-label="Ouvrir le menu">
            <Icone nom="menu" className="w-7 h-7" />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <footer className="bg-feuille-fonce text-sable mt-16 pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-extrabold text-sable">Ansanm</p>
            <p className="mt-2 text-sm text-sable/80 max-w-xs">
              Une autre façon de faire avancer la Guadeloupe : pavé par pavé.
            </p>
          </div>
          <ul className="text-sm space-y-2 text-sable/90">
            {liensMenu.slice(1).map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-mangue">{l.label}</Link></li>
            ))}
          </ul>
          <div className="text-sm text-sable/80 space-y-2">
            <p>100 % des dons vont aux projets. L'association vit des adhésions.</p>
            <p className="text-sable/60">Démo bêta — les personnes, entreprises et montants affichés sont fictifs.</p>
          </div>
        </div>
      </footer>

      {/* Barre d'onglets mobile */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sable-clair/95 backdrop-blur border-t border-sable-fonce flex items-end px-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigation mobile"
      >
        <OngletBas to="/" icone="accueil" label="Accueil" end />
        <OngletBas to="/trace" icone="trace" label="La Trace" />
        <Link to="/contribuer" className="flex-1 flex flex-col items-center -mt-5 pb-1.5" aria-label="Poser mon pavé">
          <span className="w-14 h-14 rounded-2xl bg-terre text-white grid place-items-center shadow-lg shadow-terre/30 rotate-3">
            <Icone nom="plus" className="w-7 h-7 -rotate-3" />
          </span>
          <span className="text-[11px] font-semibold text-terre mt-1">Mon pavé</span>
        </Link>
        <OngletBas to="/annuaire" icone="annuaire" label="Annuaire" />
        <button onClick={() => setMenu(true)} className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium flex-1 py-2 text-encre-doux">
          <Icone nom="menu" className="w-6 h-6" />
          Plus
        </button>
      </nav>

      {menu && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-encre/50 fondu" onClick={() => setMenu(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-sable-clair rounded-t-3xl p-6 pb-10 feuille-monte">
            <div className="flex items-center justify-between mb-4">
              <Logo />
              <button onClick={() => setMenu(false)} className="p-2 -mr-2" aria-label="Fermer le menu">
                <Icone nom="fermer" className="w-6 h-6" />
              </button>
            </div>
            <ul className="divide-y divide-sable-fonce">
              {liensMenu.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="flex items-center justify-between py-3.5 text-lg font-medium">
                    {l.label}
                    <Icone nom="fleche" className="w-5 h-5 text-encre-doux" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
