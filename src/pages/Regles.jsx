import { Bouton, EnTete } from '../components/Elements.jsx'

const PRINCIPES = [
  ['100 % des dons vont aux projets.', 'Le fonctionnement de l’association est financé par les adhésions.'],
  ['Pas de projet sans demande.', 'On vérifie qu’il y a des utilisateurs ou des clients avant de lancer.'],
  ['Un projet = un référent.', 'Une personne porte le projet et le guide.'],
  ['Chacun contribue comme il peut.', 'Argent, matériel, temps, compétences : toute contribution compte.'],
  ['Chaque projet crée de l’emploi.', 'Ou une activité durable, pas juste un achat.'],
  ['Une personne = une voix.', 'En assemblée générale, quel que soit le montant donné.'],
  ['Transparence totale.', 'Chaque contribution est visible sur la Trace, sauf choix d’anonymat.'],
]

const FINANCEMENT = [
  ['Adhésions', 'font vivre l’association'],
  ['Dons et mécénat', 'vont à 100 % aux projets'],
  ['Marchés trimestriels', 'stands et animations'],
  ['T-shirts Ansanm', 'la marge rejoint la cagnotte des projets'],
]

export default function Regles() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-8">
      <EnTete surtitre="Nos règles" titre="Sept principes non négociables.">
        Ansanm est un koudmen moderne : on avance ensemble, avec des règles claires pour tout le monde.
      </EnTete>

      <ol className="mt-8 space-y-3">
        {PRINCIPES.map(([titre, detail], i) => (
          <li key={i} className="bg-white rounded-3xl p-5 ring-1 ring-sable-fonce/60 flex gap-4 items-start">
            <span className="font-display text-3xl font-extrabold text-terre w-8 shrink-0 leading-none">{i + 1}</span>
            <div>
              <p className="font-display text-lg font-bold">{titre}</p>
              <p className="text-encre-doux">{detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-14 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-feuille-fonce text-sable p-6">
          <h2 className="text-2xl font-extrabold text-sable">Gouvernance</h2>
          <ul className="mt-4 space-y-2 text-sable/90">
            <li>Une assemblée générale tous les six mois.</li>
            <li>Une personne = une voix, quel que soit le montant donné.</li>
            <li>Les nouveaux projets sont étudiés et votés en AG.</li>
            <li>Les comptes sont publiés dans le magazine trimestriel.</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 ring-1 ring-sable-fonce/60">
          <h2 className="text-2xl font-extrabold text-terre-fonce">Des financements diversifiés</h2>
          <p className="mt-2 text-encre-doux">Comme dans le vivant : la diversité plutôt que la dépendance.</p>
          <ul className="mt-4 space-y-2">
            {FINANCEMENT.map(([t, d]) => (
              <li key={t}><strong>{t}</strong> <span className="text-encre-doux">— {d}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-3xl bg-sable p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-feuille">Horizon</p>
        <p className="mt-2 text-lg">
          Demain, une <strong>coopérative</strong> pour les investissements citoyens : terrains, locaux, logements.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Bouton to="/adherer" variante="vert">Adhérer</Bouton>
        <Bouton to="/proposer" variante="contour">Proposer un projet</Bouton>
      </div>
    </div>
  )
}
