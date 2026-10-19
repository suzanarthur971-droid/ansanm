import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Accueil from './pages/Accueil.jsx'
import LaTrace from './pages/LaTrace.jsx'
import Projet from './pages/Projet.jsx'
import Contribuer from './pages/Contribuer.jsx'
import Annuaire from './pages/Annuaire.jsx'
import Adherer from './pages/Adherer.jsx'
import Proposer from './pages/Proposer.jsx'
import RendezVous from './pages/RendezVous.jsx'
import Regles from './pages/Regles.jsx'
import Slogans from './pages/Slogans.jsx'
import BesoinsPros from './pages/BesoinsPros.jsx'
import PublierBesoin from './pages/PublierBesoin.jsx'
import Idees from './pages/Idees.jsx'
import Introuvable from './pages/Introuvable.jsx'

function RemonteEnHaut() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <Layout>
      <RemonteEnHaut />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/trace" element={<LaTrace />} />
        <Route path="/projets/:id" element={<Projet />} />
        <Route path="/contribuer" element={<Contribuer />} />
        <Route path="/annuaire" element={<Annuaire />} />
        <Route path="/adherer" element={<Adherer />} />
        <Route path="/proposer" element={<Proposer />} />
        <Route path="/rendez-vous" element={<RendezVous />} />
        <Route path="/regles" element={<Regles />} />
        <Route path="/t-shirts" element={<Slogans />} />
        <Route path="/besoins-pros" element={<BesoinsPros />} />
        <Route path="/idees" element={<Idees />} />
        <Route path="/besoins-pros/publier" element={<PublierBesoin />} />
        <Route path="*" element={<Introuvable />} />
      </Routes>
    </Layout>
  )
}
