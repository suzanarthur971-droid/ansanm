import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Action, Aplat, Kreyol, Pierre } from '../components/Nouveau.jsx'

// Chaque règle, puis ce qu'elle veut dire concrètement
const REGLES = [
  ['100 % des dons vont aux projets.', 'Les adhésions font vivre l’association.',
    'Le site, l’assurance et le compte en banque sont payés par les adhésions, jamais par les dons. Un euro posé sur un projet va à ce projet.'],
  ['Pas de projet sans demande.', 'On vérifie que des gens l’attendent avant de construire.',
    'Familles inscrites, clients, écoles qui demandent des ateliers : chaque fiche projet affiche la preuve que le projet est attendu. Et dans les idées en germe, chacun peut dire « je le rechercherais » : la demande se mesure.'],
  ['Un projet, un référent.', 'Quelqu’un qui le porte et le guide.',
    'Le référent fait avancer le projet au quotidien, présente son avancée à chaque assemblée générale et reste le contact de ceux qui y contribuent.'],
  ['Chacun contribue comme il peut.', 'Argent, matériel, temps, compétences : toute pierre compte.',
    'Chaque contribution devient un pavé sur la Trace, qu’elle soit un don, un outil prêté ou quelques heures offertes.'],
  ['Chaque projet crée de l’emploi ou une activité durable.', '',
    'On finance des salaires, des outils de travail et des lieux, pas des achats ponctuels. Chaque fiche dit combien d’emplois le projet crée.'],
  ['Une personne, une voix.', 'Ton vote ne dépend pas de ton don.',
    'En assemblée générale, chaque adhérent a une voix, qu’il ait donné 5 € ou 5 000 €.'],
  ['Tout est visible.', 'Chaque pavé, chaque euro, chaque avancée.',
    'Chaque pavé apparaît sur la Trace, sauf si son auteur choisit l’anonymat. Et chaque trimestre, nous publions ce qui a été reçu et dépensé, projet par projet.'],
]

// Le chemin d'une idée jusqu'à la Trace : une vraie séquence
const ETAPES = [
  ['Quelqu’un propose une idée.', 'Elle peut germer en public : chacun dit s’il la rechercherait, ou propose de la rattacher à un projet existant.', '#C57B57'],
  ['Un comité fait le tri.', 'Un petit groupe d’adhérents vérifie les trois conditions : une demande, un référent, des emplois. Et aide le porteur à compléter ce qui manque.', '#A8BFA1'],
  ['L’assemblée générale vote.', 'Tous les six mois, les adhérents votent parmi les projets retenus. Une personne, une voix.', '#C9A46E'],
  ['Le projet rejoint la Trace.', 'Sa fiche est publiée, et chacun peut commencer à poser ses pavés.', '#F5F0E6'],
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
          {REGLES.map(([titre, detail, concret], i) => (
            <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-4">
              <span className="titre text-5xl text-terre-fonce">{i + 1}</span>
              <div>
                <p className="text-2xl font-[700] leading-snug tracking-tight">{titre}</p>
                {detail && <p className="mt-1 text-lg text-olive/80">{detail}</p>}
                <p className="mt-3 leading-relaxed bg-beige rounded-xl px-4 py-3">
                  <span className="font-[700]">Concrètement : </span>{concret}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Aplat>

      <Aplat couleur="beige" interieur="py-16">
        <h2 className="text-4xl sm:text-6xl">Comment un projet arrive sur la Trace</h2>
        <ol className="mt-12 grid md:grid-cols-4 gap-8">
          {ETAPES.map(([titre, texte, couleur], i) => (
            <li key={titre} className="flex md:flex-col gap-5">
              <Pierre n={i + 1} couleur={couleur} className="w-14 h-12 md:w-20 md:h-16 text-2xl md:text-4xl text-olive-nuit" />
              <div>
                <p className="text-xl font-[700] leading-snug">{titre}</p>
                <p className="mt-2 leading-relaxed">{texte}</p>
              </div>
            </li>
          ))}
        </ol>
        <Action to="/proposer" className="mt-10">Proposer un projet</Action>
      </Aplat>

      <Aplat interieur="py-16">
        <h2 className="text-4xl sm:text-6xl">Les questions qu'on nous pose</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-x-14 gap-y-12">
          <div>
            <h3 className="text-2xl sm:text-3xl">Et si un projet n'atteint pas son objectif ?</h3>
            <div className="mt-4 space-y-3 text-lg leading-relaxed">
              <p>
                Tous les six mois, l'assemblée générale fait le point sur chaque projet : où en est-il, peut-il être
                lancé ?
              </p>
              <p>
                Quand un projet est encore loin de son objectif, on demande à ceux qui y ont contribué s'ils veulent
                basculer leur don vers un projet qui peut démarrer tout de suite. Rien ne bouge sans leur accord : ceux
                qui préfèrent attendre gardent leur pavé là où ils l'ont posé.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl">Où va l'argent ?</h3>
            <ul className="mt-4 space-y-3 text-lg leading-relaxed">
              <li><span className="font-[700]">Les dons</span> vont entièrement au projet choisi.</li>
              <li><span className="font-[700]">Les adhésions</span> paient le fonctionnement : le site, l'assurance, le compte en banque.</li>
              <li><span className="font-[700]">La marge des t-shirts</span> rejoint la cagnotte des projets.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl">Qui décide ?</h3>
            <p className="mt-4 text-lg leading-relaxed">
              Les adhérents, réunis en assemblée générale tous les six mois. Ils votent les nouveaux projets, font le
              point sur ceux en cours et décident de la suite. Chaque adhérent a une voix, quel que soit le montant
              qu'il donne.
            </p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl">Comment je sais ce qui est fait de l'argent ?</h3>
            <p className="mt-4 text-lg leading-relaxed">
              Chaque trimestre, nous publions sur le site et dans le magazine ce qui a été reçu et dépensé, projet par
              projet. Les comptes annuels sont présentés en assemblée générale.
            </p>
          </div>
        </div>
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
