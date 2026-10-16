import { Link } from 'react-router-dom'
import { EnTete } from '../components/Elements.jsx'

const REGLES = [
  ['100 % des dons vont aux projets.', 'Les adhésions font vivre l’association.'],
  ['Pas de projet sans demande.', 'On vérifie que des gens l’attendent avant de construire.'],
  ['Un projet, un référent.', 'Quelqu’un qui le porte et le guide.'],
  ['Chacun contribue comme il peut.', 'Argent, matériel, temps, compétences : toute pierre compte.'],
  ['Chaque projet crée de l’emploi ou une activité durable.', ''],
  ['Une personne, une voix.', 'Ton vote ne dépend pas de ton don.'],
  ['Tout est visible.', 'Chaque pavé, chaque euro, chaque avancée.'],
]

export default function Regles() {
  return (
    <div className="max-w-3xl mx-auto px-5 pt-14">
      <EnTete titre="Ce qui ne bougera jamais" kreyol={['On sèl dwèt pa ka manjé kalalou', 'Un seul doigt ne peut pas manger le calalou']}>
        Une route solide repose sur des fondations solides. Voici les nôtres.
      </EnTete>

      <ol className="mt-12 border-t border-ligne">
        {REGLES.map(([titre, detail], i) => (
          <li key={i} className="grid grid-cols-[2.5rem_1fr] py-5 border-b border-ligne">
            <span className="font-display text-xl text-gris">{i + 1}.</span>
            <div>
              <p className="font-display text-xl">{titre}</p>
              {detail && <p className="mt-1 text-gris">{detail}</p>}
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 text-3xl">Faire comme le vivant</h2>
      <div className="mt-4 space-y-4 text-gris leading-relaxed">
        <p>
          Une forêt ne dépend pas d'un seul arbre. Quand la saison des mangues se termine, celle des avocats commence.
          Rien ne se perd : la feuille qui tombe nourrit la terre qui nourrit l'arbre.
        </p>
        <p>
          Ansanm fonctionne de la même manière. Plusieurs sources plutôt qu'une : adhésions, dons, marchés, t-shirts,
          magazine. Des projets qui se nourrissent entre eux. Une Guadeloupe qui ne dépend plus de quelques-uns, mais qui
          tient debout parce qu'elle est diverse.
        </p>
      </div>

      <h2 className="mt-12 text-3xl">Et demain ?</h2>
      <p className="mt-4 text-gris leading-relaxed">
        Un jour, nous voulons aller plus loin : permettre à chacun d'investir dans des terres, des locaux ou des logements
        qui appartiennent à la communauté. Ce sera l'objet d'une future coopérative. Si ça t'intéresse,{' '}
        <Link to="/adherer" className="underline hover:text-terre-fonce">dis-le-nous</Link>.
      </p>

      <p className="mt-12 flex gap-6">
        <Link to="/adherer" className="underline hover:text-terre-fonce">Adhérer</Link>
        <Link to="/proposer" className="underline hover:text-terre-fonce">Proposer un projet</Link>
      </p>
    </div>
  )
}
