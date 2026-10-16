import { Bouton } from '../components/Elements.jsx'

export default function Introuvable() {
  return (
    <div className="max-w-xl mx-auto px-4 pt-20 text-center">
      <p className="font-display text-6xl font-extrabold text-terre">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">Ce chemin n'est pas encore pavé.</h1>
      <Bouton to="/" className="mt-6">Retour à l'accueil</Bouton>
    </div>
  )
}
