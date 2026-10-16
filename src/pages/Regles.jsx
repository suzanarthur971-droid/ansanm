import { Link } from 'react-router-dom'
import { EnTete } from '../components/Elements.jsx'

const PRINCIPES = [
  ['100 % des dons vont aux projets.', 'Le fonctionnement de l’association est financé par les adhésions.'],
  ['Pas de projet sans demande.', 'On vérifie qu’il y a des utilisateurs ou des clients avant de lancer.'],
  ['Un projet, un référent.', 'Une personne porte le projet et le guide.'],
  ['Chacun contribue comme il peut.', 'Argent, matériel, temps, compétences : toute contribution compte.'],
  ['Chaque projet crée de l’emploi.', 'Ou une activité durable, pas juste un achat.'],
  ['Une personne, une voix.', 'En assemblée générale, quel que soit le montant donné.'],
  ['Transparence totale.', 'Chaque contribution est visible sur la Trace, sauf choix d’anonymat.'],
]

export default function Regles() {
  return (
    <div className="max-w-3xl mx-auto px-5 pt-14">
      <EnTete titre="Nos règles">
        Ansanm, c'est notre koudmen moderne : nous avançons ensemble, avec des règles claires pour tout le monde.
      </EnTete>

      <ol className="mt-12 border-t border-ligne">
        {PRINCIPES.map(([titre, detail], i) => (
          <li key={i} className="grid grid-cols-[2.5rem_1fr] py-5 border-b border-ligne">
            <span className="font-display text-xl text-gris">{i + 1}.</span>
            <div>
              <p className="font-display text-xl">{titre}</p>
              <p className="mt-1 text-gris">{detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 text-3xl">Gouvernance</h2>
      <p className="mt-4 text-gris leading-relaxed">
        Nous nous réunissons en assemblée générale tous les six mois. Chacun de nous y a une voix, quel que soit le montant donné.
        Nous y étudions et votons les nouveaux projets, et nous publions nos comptes dans le magazine trimestriel.
      </p>

      <h2 className="mt-12 text-3xl">Des financements diversifiés</h2>
      <p className="mt-4 text-gris leading-relaxed">
        Comme dans le vivant, nous préférons la diversité à la dépendance : nos adhésions font vivre l'association, les dons et
        le mécénat vont aux projets, les marchés trimestriels et la vente de t-shirts (dont la marge rejoint la cagnotte)
        complètent l'ensemble.
      </p>

      <h2 className="mt-12 text-3xl">Horizon</h2>
      <p className="mt-4 text-gris leading-relaxed">
        Demain, nous voulons créer une coopérative pour investir ensemble : terrains, locaux, logements.
      </p>

      <p className="mt-12 flex gap-6">
        <Link to="/adherer" className="underline hover:text-terre-fonce">Adhérer</Link>
        <Link to="/proposer" className="underline hover:text-terre-fonce">Proposer un projet</Link>
      </p>
    </div>
  )
}
