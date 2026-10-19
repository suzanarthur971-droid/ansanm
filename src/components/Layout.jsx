import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

function Logo({ className = 'h-10' }) {
  return <img src="/logo-ansanm.png" alt="Ansanm" className={`${className} w-auto`} />
}

const liens = [
  { to: '/trace', label: 'La Trace' },
  { to: '/annuaire', label: 'Annuaire' },
  { to: '/besoins-pros', label: 'Entre pros' },
  { to: '/rendez-vous', label: 'Rendez-vous' },
  { to: '/regles', label: 'Nos règles' },
  { to: '/t-shirts', label: 'T-shirts' },
  { to: '/adherer', label: 'Adhérer' },
]

const tousLesLiens = [
  { to: '/', label: 'Accueil' },
  { to: '/trace', label: 'La Trace' },
  { to: '/contribuer', label: 'Poser mon pavé' },
  { to: '/annuaire', label: 'Annuaire' },
  { to: '/besoins-pros', label: 'Besoins des pros' },
  { to: '/adherer', label: 'Adhérer' },
  { to: '/proposer', label: 'Proposer un projet' },
  { to: '/rendez-vous', label: 'Rendez-vous' },
  { to: '/regles', label: 'Nos règles' },
  { to: '/t-shirts', label: 'T-shirts' },
]

// Icônes de la barre d'onglets mobile (trait, couleur héritée)
const trait = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }
const ICONES = {
  accueil: <path d="M4 11l8-6.5L20 11M6 9.5V20h12V9.5" {...trait} />,
  trace: <path d="M6 20c0-4 12-4 12-8S6 8 6 4" {...trait} />,
  pros: <path d="M3 12l4-4 4 3 3-3 3 3 4-1M7 8v9a2 2 0 002 2h6a2 2 0 002-2v-6" {...trait} />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" {...trait} />,
}

function Onglet({ to, icone, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[11.5px] font-semibold ${isActive ? 'text-terre-fonce' : 'text-olive/70'}`}
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">{ICONES[icone]}</svg>
      {label}
    </NavLink>
  )
}

export default function Layout({ children }) {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setMenu(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <div className="nouveau min-h-dvh flex flex-col text-olive">
      <p className="bg-olive-nuit text-beige/90 text-center text-[13px] px-4 py-1.5">
        Version de lancement : les dons sont des promesses en attendant l'ouverture officielle.
      </p>
      <header className="bg-papier">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          <Link to="/" aria-label="Accueil"><Logo /></Link>
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[15.5px] font-semibold" aria-label="Navigation principale">
            {liens.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'text-terre-fonce' : 'text-olive/80 hover:text-olive')}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/contribuer" className="bg-terre-fonce text-papier px-4 py-2.5 rounded-lg hover:bg-terre-profond transition-colors">
              Poser mon pavé
            </Link>
          </nav>
          <Link to="/adherer" className="lg:hidden font-semibold underline decoration-2 underline-offset-4">Adhérer</Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-olive-nuit text-beige pb-24 lg:pb-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="titre text-4xl sm:text-5xl text-beige" lang="gcf">Sé ansanm nou ké rivé.</p>
            <p className="mt-2 text-lg text-beige/75">Ensemble, on y arrivera.</p>
            <p className="mt-8 text-sm text-beige/60 max-w-md">
              Version de lancement : les projets, personnes et montants de démonstration sont fictifs, et aucun paiement
              n'est demandé.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 font-semibold content-start">
            {tousLesLiens.slice(1).map((l) => (
              <li key={l.to}><Link to={l.to} className="text-beige/85 hover:text-beige">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </footer>

      {/* Barre d'onglets mobile : 5 onglets, le pavé à poser au centre */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-papier/95 backdrop-blur border-t-2 border-beige flex items-end px-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigation mobile"
      >
        <Onglet to="/" icone="accueil" label="Accueil" end />
        <Onglet to="/trace" icone="trace" label="La Trace" />
        <Link to="/contribuer" className="flex-1 flex flex-col items-center -mt-6 pb-2" aria-label="Poser mon pavé">
          <span
            className="w-[60px] h-[52px] bg-terre-fonce text-papier grid place-items-center shadow-lg shadow-terre/30"
            style={{ borderRadius: '52% 48% 45% 55% / 50% 56% 44% 50%' }}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true"><path d="M12 5v14M5 12h14" {...trait} strokeWidth="2.4" /></svg>
          </span>
          <span className="mt-1 text-[11.5px] font-semibold text-terre-fonce">Mon pavé</span>
        </Link>
        <Onglet to="/besoins-pros" icone="pros" label="Entre pros" />
        <button onClick={() => setMenu(true)} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[11.5px] font-semibold text-olive/70">
          <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">{ICONES.menu}</svg>
          Menu
        </button>
      </nav>

      {menu && (
        <div className="fixed inset-0 z-50 bg-olive text-beige fondu lg:hidden overflow-y-auto" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="px-5 h-16 flex items-center justify-between">
            <p className="titre text-2xl">Ansanm</p>
            <button onClick={() => setMenu(false)} className="font-semibold underline underline-offset-4">Fermer</button>
          </div>
          <ul className="px-5 pb-10">
            {tousLesLiens.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end className={({ isActive }) => `titre block py-2.5 text-4xl ${isActive ? 'text-sauge' : ''}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
