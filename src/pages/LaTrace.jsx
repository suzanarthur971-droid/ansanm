import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData, useProjet } from '../lib/store.jsx'
import { euros } from '../lib/paves.js'
import Trace, { FichePave, Legende } from '../components/Trace.jsx'
import { Action, Aplat } from '../components/Nouveau.jsx'

export default function LaTrace() {
  const { projects } = useData()
  const [params, setParams] = useSearchParams()
  const id = projects.some((p) => p.id === params.get('projet')) ? params.get('projet') : projects[0].id
  const { projet, paves, promis, progression } = useProjet(id)
  const [choisi, setChoisi] = useState(null)

  return (
    <div className="nouveau">
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-10 grid md:grid-cols-[1fr_1fr] gap-8 md:gap-16 items-end">
        <div>
          <p className="text-xl font-semibold text-sauge" lang="gcf">Sé ansanm nou ka vansé</p>
          <p className="text-beige/70">C'est ensemble que nous avançons</p>
          <h1 className="mt-6 text-6xl sm:text-8xl">La Trace</h1>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-beige/90">
          <p>
            En Guadeloupe, une trace, c'est un chemin ouvert à la main à travers la forêt. Personne ne la construit seul,
            et personne ne la construit en un jour.
          </p>
          <p>
            Ici, chaque pavé est une contribution : un don, un outil prêté, quelques heures offertes. Plus la contribution
            est grande, plus la pierre est large. Mais chaque pierre compte : sans les petites, la route a des trous.
          </p>
        </div>
        <div className="md:col-span-2 mt-4 flex gap-2 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="Choisir un projet">
          {projects.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={p.id === id}
              onClick={() => setParams({ projet: p.id }, { replace: true })}
              className={`shrink-0 px-5 py-3 rounded-lg text-lg font-semibold transition-colors ${p.id === id ? 'bg-beige text-olive-nuit' : 'bg-olive-nuit text-beige hover:bg-[#344033]'}`}
            >
              {p.titre}
            </button>
          ))}
        </div>
      </Aplat>

      <Aplat interieur="py-12 grid md:grid-cols-[1fr_420px] gap-12 items-start">
        <div className="md:sticky md:top-8 order-2 md:order-1">
          <h2 className="text-4xl sm:text-5xl">{projet.titre}</h2>
          <p className="mt-3 text-xl leading-snug text-olive/85 max-w-md">{projet.accroche}</p>
          <p className="mt-8 text-2xl font-[650]">
            {euros(promis)} <span className="font-normal text-olive/75">sur {euros(projet.objectif_montant)}</span>
          </p>
          <div className="mt-3 h-3 rounded-full bg-beige overflow-hidden max-w-md" role="progressbar" aria-valuenow={Math.round(progression * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-terre" style={{ width: `${Math.max(2, progression * 100)}%` }} />
          </div>
          <p className="mt-2 text-olive/75">{paves.length} pavés posés</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Action to={`/contribuer?projet=${id}`}>Poser mon pavé</Action>
            <Link to={`/projets/${id}`} className="font-semibold underline decoration-2 underline-offset-4 hover:decoration-terre">Lire l'histoire du projet</Link>
          </div>
          <div className="mt-12 bg-beige rounded-[22px] p-6 max-w-md">
            <Legende />
          </div>
        </div>

        <div className="order-1 md:order-2">
          {paves.length > 0 ? (
            <Trace projet={projet} paves={paves} progression={progression} onChoisir={setChoisi} />
          ) : (
            <div className="bg-beige rounded-[22px] p-8">
              <p className="text-2xl font-[700]">Cette trace attend sa première pierre.</p>
              <p className="mt-1 text-lg">Et si c'était la tienne ?</p>
              <Action to={`/contribuer?projet=${id}`} className="mt-6">Poser le premier pavé</Action>
            </div>
          )}
        </div>
      </Aplat>

      <FichePave pave={choisi} projet={projet} onFermer={() => setChoisi(null)} />
    </div>
  )
}
