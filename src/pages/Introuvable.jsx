import { Link } from 'react-router-dom'

export default function Introuvable() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-24">
      <h1 className="text-4xl">Ce chemin n'est pas encore pavé.</h1>
      <Link to="/" className="mt-6 inline-block underline hover:text-terre-fonce">Retour à l'accueil</Link>
    </div>
  )
}
