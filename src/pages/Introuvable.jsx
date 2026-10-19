import { Action, Aplat } from '../components/Nouveau.jsx'

export default function Introuvable() {
  return (
    <Aplat couleur="olive" interieur="py-24 sm:py-32">
      <h1 className="text-5xl sm:text-7xl max-w-[14ch]">Cette trace ne mène nulle part… pour l'instant.</h1>
      <Action to="/" sombre className="mt-10">Retour à l'accueil</Action>
    </Aplat>
  )
}
