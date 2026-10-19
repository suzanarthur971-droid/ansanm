import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Action, Aplat, Kreyol } from '../components/Nouveau.jsx'

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
  const { partenaires } = useData()
  return (
    <div>
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12 grid md:grid-cols-2 gap-8 md:gap-16 items-end">
        <div>
          <Kreyol texte="On sèl dwèt pa ka manjé kalalou" traduction="Un seul doigt ne peut pas manger le calalou" clair />
          <h1 className="mt-6 text-5xl sm:text-7xl">Ce qui ne bougera jamais</h1>
        </div>
        <p className="text-xl leading-relaxed text-beige/90">
          Une route solide repose sur des fondations solides. Voici les nôtres.
        </p>
      </Aplat>

      <Aplat interieur="py-16">
        <ol className="grid md:grid-cols-2 gap-x-14 gap-y-10">
          {REGLES.map(([titre, detail], i) => (
            <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-4">
              <span className="titre text-5xl text-terre-fonce">{i + 1}</span>
              <div>
                <p className="text-2xl font-[700] leading-snug tracking-tight">{titre}</p>
                {detail && <p className="mt-1 text-lg text-olive/80">{detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Aplat>

      <Aplat couleur="sauge" interieur="py-16 grid md:grid-cols-[1fr_1.3fr] gap-10">
        <h2 className="text-4xl sm:text-6xl">Faire comme le vivant</h2>
        <div className="space-y-5 text-xl leading-relaxed">
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
      </Aplat>

      <Aplat interieur="py-16 grid md:grid-cols-[1fr_1.3fr] gap-10">
        <div>
          <h2 className="text-4xl sm:text-6xl">Ils construisent aussi</h2>
          <p className="mt-5 text-xl leading-relaxed">
            Ansanm ne veut remplacer personne. Quand une belle initiative existe déjà, on s'associe pour qu'elle grandisse.
            Plusieurs arbres, une même forêt.
          </p>
        </div>
        {partenaires.length > 0 ? (
          <ul className="space-y-4">
            {partenaires.map((p) => (
              <li key={p.id} className="bg-beige rounded-[22px] p-6">
                <a href={p.lien} className="titre text-3xl underline underline-offset-4 hover:text-terre-fonce" target="_blank" rel="noreferrer">{p.nom}</a>
                <p className="mt-2 text-lg">{p.description}</p>
                {p.type_de_partenariat && <p className="mt-2 font-semibold text-terre-fonce">{p.type_de_partenariat}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[22px] border-[3px] border-dashed border-beige p-8 grid place-items-center text-center">
            <p className="text-xl leading-relaxed max-w-sm">
              Bientôt : les premières structures amies apparaîtront ici, dès que nous aurons construit le partenariat
              ensemble.
            </p>
          </div>
        )}
      </Aplat>

      <Aplat couleur="brique" interieur="py-16">
        <h2 className="text-4xl sm:text-6xl">Et demain ?</h2>
        <p className="mt-5 text-xl leading-relaxed max-w-3xl text-papier/90">
          Un jour, nous voulons aller plus loin : permettre à chacun d'investir dans des terres, des locaux ou des
          logements qui appartiennent à la communauté. Ce sera l'objet d'une future coopérative. Si ça t'intéresse,{' '}
          <Link to="/adherer" className="text-papier font-semibold underline decoration-2 underline-offset-4">dis-le-nous</Link>.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 items-center">
          <Action to="/adherer" sombre>Adhérer</Action>
          <Action to="/proposer" discret>Proposer un projet</Action>
        </div>
      </Aplat>
    </div>
  )
}
