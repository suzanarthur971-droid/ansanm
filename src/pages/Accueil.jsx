import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { euros } from '../lib/paves.js'
import { Boucle, Bouton, CarteProjet, Compteur } from '../components/Elements.jsx'
import { PaveForme } from '../components/Trace.jsx'
import Icone from '../components/Icones.jsx'

function DecorPaves() {
  // Quelques pavés posés en diagonale dans le bandeau d'accueil
  const paves = [
    { type: 'argent', taille: 'dalle', x: 30, y: 210, r: -8 },
    { type: 'temps', taille: 'grand', x: 80, y: 168, r: 12 },
    { type: 'argent', taille: 'pave', x: 122, y: 136, r: -4 },
    { type: 'materiel', taille: 'grand', x: 166, y: 110, r: 9 },
    { type: 'argent', taille: 'galet', x: 204, y: 86, r: 0 },
    { type: 'competences', taille: 'pave', x: 236, y: 68, r: -12 },
    { type: 'argent', taille: 'grand', x: 276, y: 46, r: 6 },
  ]
  return (
    <svg viewBox="0 0 320 250" className="w-full h-full" aria-hidden="true">
      <path d="M10 240 C 120 200, 160 120, 310 30" stroke="#E4CFA9" strokeWidth="58" strokeLinecap="round" fill="none" />
      {paves.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
          <PaveForme type={p.type} taille={p.taille} />
        </g>
      ))}
      <g transform="translate(300 28)" opacity="0.5">
        <circle r="7" fill="none" stroke="#7A2E17" strokeDasharray="3 3" />
      </g>
    </svg>
  )
}

export default function Accueil() {
  const { projects, stats } = useData()

  return (
    <>
      {/* Bandeau */}
      <section className="relative overflow-hidden bg-sable">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-feuille">Plateforme associative guadeloupéenne</p>
            <h1 className="mt-3 text-4xl sm:text-6xl font-extrabold text-terre-fonce leading-[1.05]">
              Une autre façon de faire avancer la Guadeloupe&nbsp;:
              <span className="block text-terre">pavé par pavé.</span>
            </h1>
            <p className="mt-5 text-lg text-encre-doux max-w-xl">
              Ansanm transforme l'envie d'agir en actions concrètes. Entreprises, associations et citoyens financent et
              soutiennent des projets communautaires qui créent de l'emploi et renforcent l'autonomie du territoire.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Bouton to="/contribuer">Poser mon pavé</Bouton>
              <Bouton to="/trace" variante="contour">Voir la Trace <Icone nom="fleche" className="w-4 h-4" /></Bouton>
              <Bouton to="/adherer" variante="vert">Adhérer</Bouton>
            </div>
          </div>
          <div className="h-56 sm:h-72 md:h-96 -mx-4 md:mx-0">
            <DecorPaves />
          </div>
        </div>
      </section>

      {/* Compteurs */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Compteur valeur={stats.totalPromis} format={euros} label="promis aux projets" />
          <Compteur valeur={stats.paves} label="pavés posés" />
          <Compteur valeur={stats.projets} label="projets en cours" />
          <Compteur valeur={stats.membres} label="membres" />
        </div>
      </section>

      {/* Projets */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-terre-fonce">Les projets en cours</h2>
            <p className="mt-1 text-encre-doux">Chaque projet a un référent, une demande vérifiée et des emplois à la clé.</p>
          </div>
          <Link to="/trace" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-terre">
            Toute la Trace <Icone nom="fleche" className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {projects.map((p) => <CarteProjet key={p.id} id={p.id} />)}
        </div>
      </section>

      {/* Philosophie */}
      <section className="max-w-6xl mx-auto px-4 mt-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-feuille">Imiter le vivant</p>
          <h2 className="mt-2 text-3xl font-extrabold text-terre-fonce">Des projets qui se nourrissent les uns les autres</h2>
          <p className="mt-4 text-encre-doux text-lg">
            Comme dans une forêt, la diversité vaut mieux que la dépendance. Le jardin nourrit la cuisine, la cuisine
            récupère les invendus de nos partenaires, et les restes retournent en compost au jardin. Les ressources
            se succèdent comme les saisons.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-feuille/10 p-4">
              <p className="font-display font-bold text-feuille-fonce">Économie bleue & syntropie</p>
              <p className="text-sm text-encre-doux mt-1">Des cycles fermés, où les déchets de l'un deviennent la ressource de l'autre.</p>
            </div>
            <div className="rounded-2xl bg-terre/10 p-4">
              <p className="font-display font-bold text-terre-fonce">Un koudmen moderne</p>
              <p className="text-sm text-encre-doux mt-1">Comme le coup de main d'antan, chacun vient poser sa pierre.</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-4 ring-1 ring-sable-fonce/60">
          <Boucle />
        </div>
      </section>

      {/* Engagement */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div className="rounded-3xl bg-terre-fonce text-sable p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="font-display text-4xl md:text-5xl font-extrabold text-mangue">100 %</p>
            <p className="mt-2 text-xl font-semibold">des dons vont aux projets.</p>
            <p className="mt-2 text-sable/80 max-w-xl">
              L'association vit uniquement des adhésions. Une personne = une voix en assemblée générale, quel que soit le
              montant donné.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Bouton to="/regles" variante="contour" className="!bg-transparent !text-sable ring-sable/40">Nos règles</Bouton>
            <Bouton to="/adherer" className="!bg-mangue !text-encre">Adhérer</Bouton>
          </div>
        </div>
      </section>
    </>
  )
}
