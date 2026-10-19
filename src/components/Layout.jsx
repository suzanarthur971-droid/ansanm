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

export default function Layout({ children }) {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setMenu(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <div className="min-h-dvh flex flex-col">
      <p className="bg-encre text-papier text-center text-xs px-4 py-1.5">
        Version de lancement — les dons sont des promesses en attendant l'ouverture officielle.
      </p>
      <header className="border-b border-ligne">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
          <Link to="/" aria-label="Accueil"><Logo /></Link>
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[15px]" aria-label="Navigation principale">
            {liens.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'text-encre underline' : 'text-gris hover:text-encre')}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/contribuer" className="bg-encre text-papier px-4 py-2 rounded-[3px] hover:bg-terre-fonce transition-colors">
              Poser mon pavé
            </Link>
          </nav>
          <button onClick={() => setMenu(true)} className="lg:hidden text-[15px] py-2" aria-label="Ouvrir le menu">
            Menu
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ligne mt-24">
        <div className="max-w-5xl mx-auto px-5 py-10 grid gap-8 sm:grid-cols-[1fr_auto] text-sm text-gris">
          <div className="max-w-sm space-y-3">
            <Logo className="h-12 -ml-1" />
            <p className="font-display text-2xl text-encre leading-tight">Sé ansanm nou ké rivé.</p>
            <p>Ensemble, on y arrivera.</p>
            <p className="pt-3 text-xs">Version de lancement : les projets, personnes et montants de démonstration sont fictifs, et aucun paiement n'est demandé.</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
            {tousLesLiens.slice(1).map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-encre">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </footer>

      {menu && (
        <div className="fixed inset-0 z-50 bg-papier fondu lg:hidden overflow-y-auto" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="px-5 h-16 flex items-center justify-between border-b border-ligne">
            <Link to="/" aria-label="Accueil"><Logo /></Link>
            <button onClick={() => setMenu(false)} className="text-[15px] py-2">Fermer</button>
          </div>
          <ul className="px-5">
            {tousLesLiens.map((l) => (
              <li key={l.to} className="border-b border-ligne">
                <NavLink to={l.to} end className={({ isActive }) => `block py-4 font-display text-2xl ${isActive ? 'text-terre-fonce' : ''}`}>
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
