import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import BoutonAvis, { FormulaireAvis } from './Avis.jsx'

function Logo({ className = 'h-10' }) {
  return <img src="/logo-ansanm.png" alt="Ansanm" className={`${className} w-auto`} />
}

// Toutes les pages, rangées en 3 familles
const FAMILLES = [
  {
    titre: 'Les projets',
    liens: [
      { to: '/trace', label: 'La Trace' },
      { to: '/contribuer', label: 'Poser mon pavé' },
      { to: '/idees', label: 'Idées en germe' },
      { to: '/proposer', label: 'Proposer un projet' },
    ],
  },
  {
    titre: 'La communauté',
    liens: [
      { to: '/annuaire', label: 'Annuaire' },
      { to: '/besoins-pros', label: 'Entre pros' },
    ],
  },
  {
    titre: "L'association",
    liens: [
      { to: '/regles', label: 'Nos règles' },
      { to: '/rendez-vous', label: 'Rendez-vous' },
      { to: '/t-shirts', label: 'T-shirts' },
      { to: '/adherer', label: 'Adhérer' },
    ],
  },
]

// En haut sur ordinateur : les pages principales, puis « L'association » qui déroule le reste
const liens = [
  { to: '/trace', label: 'La Trace' },
  { to: '/idees', label: 'Idées' },
  { to: '/annuaire', label: 'Annuaire' },
  { to: '/besoins-pros', label: 'Entre pros' },
]
const deroule = [...FAMILLES[2].liens, { to: '/proposer', label: 'Proposer un projet' }]

function MenuAssociation() {
  const [ouvert, setOuvert] = useState(false)
  const ref = useRef(null)
  const { pathname } = useLocation()
  const actif = deroule.some((l) => pathname.startsWith(l.to))
  useEffect(() => { setOuvert(false) }, [pathname])
  useEffect(() => {
    if (!ouvert) return
    const dehors = (e) => !ref.current?.contains(e.target) && setOuvert(false)
    const echap = (e) => e.key === 'Escape' && setOuvert(false)
    document.addEventListener('mousedown', dehors)
    document.addEventListener('keydown', echap)
    return () => {
      document.removeEventListener('mousedown', dehors)
      document.removeEventListener('keydown', echap)
    }
  }, [ouvert])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 ${actif ? 'text-terre-fonce' : 'text-olive/80 hover:text-olive'}`}
      >
        L'association
        <svg viewBox="0 0 12 12" className={`w-3 h-3 transition-transform ${ouvert ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {ouvert && (
        <ul className="absolute right-0 top-full mt-3 w-60 bg-papier rounded-2xl shadow-xl ring-2 ring-beige p-2 z-40 fondu">
          {deroule.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => `block rounded-lg px-4 py-2.5 hover:bg-beige ${isActive ? 'text-terre-fonce' : ''}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Icônes de la barre d'onglets mobile (trait, couleur héritée)
const trait = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }
const ICONES = {
  annuaire: <path d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4zM9 9h6M9 13h6M5 18a2 2 0 012-2h12" {...trait} />,
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
  const [avis, setAvis] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setMenu(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <div className="nouveau min-h-dvh flex flex-col text-olive">
      <p className="bg-olive-nuit text-beige/90 text-center text-[13px] px-4 py-1.5">
        Version de lancement : les dons sont des promesses en attendant l'ouverture officielle.{' '}
        <button onClick={() => setAvis(true)} className="font-semibold text-beige underline underline-offset-2">Donner mon avis</button>
      </p>
      <header className="bg-papier">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          <Link to="/" aria-label="Accueil"><Logo /></Link>
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15.5px] font-semibold" aria-label="Navigation principale">
            {liens.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'text-terre-fonce' : 'text-olive/80 hover:text-olive')}>
                {l.label}
              </NavLink>
            ))}
            <MenuAssociation />
            <Link to="/contribuer" className="bg-terre-fonce text-papier px-4 py-2.5 rounded-lg hover:bg-terre-profond transition-colors">
              Poser mon pavé
            </Link>
          </nav>
          <Link to="/adherer" className="lg:hidden font-semibold underline decoration-2 underline-offset-4">Adhérer</Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-olive-nuit text-beige pb-24 lg:pb-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="titre text-4xl sm:text-5xl text-beige" lang="gcf">Sé ansanm nou ké rivé.</p>
            <p className="mt-2 text-lg text-beige/75">Ensemble, on y arrivera.</p>
            <p className="mt-8 text-sm text-beige/60 max-w-md">
              Version de lancement : les projets, personnes et montants de démonstration sont fictifs, et aucun paiement
              n'est demandé.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 content-start">
            {FAMILLES.map((f) => (
              <div key={f.titre}>
                <p className="text-sm text-sauge font-semibold">{f.titre}</p>
                <ul className="mt-3 space-y-2.5 font-semibold">
                  {f.liens.map((l) => (
                    <li key={l.to}><Link to={l.to} className="text-beige/85 hover:text-beige">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Barre d'onglets mobile : 5 onglets, le pavé à poser au centre. L'accueil passe par le logo et le menu. */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-papier/95 backdrop-blur border-t-2 border-beige flex items-end px-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigation mobile"
      >
        <Onglet to="/trace" icone="trace" label="La Trace" />
        <Onglet to="/annuaire" icone="annuaire" label="Annuaire" />
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

      <BoutonAvis onOuvrir={() => setAvis(true)} />
      {avis && <FormulaireAvis onFermer={() => setAvis(false)} />}

      {menu && (
        <div className="fixed inset-0 z-50 bg-olive text-beige fondu lg:hidden overflow-y-auto" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="px-5 h-16 flex items-center justify-between">
            <p className="titre text-2xl">Ansanm</p>
            <button onClick={() => setMenu(false)} className="font-semibold underline underline-offset-4">Fermer</button>
          </div>
          <div className="px-5 pb-12">
            <NavLink to="/" end className={({ isActive }) => `titre block py-2 text-4xl ${isActive ? 'text-sauge' : ''}`}>Accueil</NavLink>
            {FAMILLES.map((f) => (
              <div key={f.titre} className="mt-7">
                <p className="text-sauge font-semibold">{f.titre}</p>
                <ul className="mt-1">
                  {f.liens.map((l) => (
                    <li key={l.to}>
                      <NavLink to={l.to} className={({ isActive }) => `titre block py-1.5 text-[2rem] ${isActive ? 'text-sauge' : ''}`}>
                        {l.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
