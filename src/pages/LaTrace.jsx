import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData, useProjet } from '../lib/store.jsx'
import { euros } from '../lib/paves.js'
import Trace, { FichePave, Legende } from '../components/Trace.jsx'
import { Barre, Bouton, EnTete } from '../components/Elements.jsx'

export default function LaTrace() {
  const { projects } = useData()
  const [params, setParams] = useSearchParams()
  const id = projects.some((p) => p.id === params.get('projet')) ? params.get('projet') : projects[0].id
  const { projet, paves, promis, progression } = useProjet(id)
  const [choisi, setChoisi] = useState(null)

  return (
    <div className="max-w-5xl mx-auto px-5 pt-14">
      <EnTete titre="La Trace" kreyol={['Sé ansanm nou ka vansé', 'C’est ensemble que nous avançons']}>
        <p>
          En Guadeloupe, une trace, c'est un chemin ouvert à la main à travers la forêt. Personne ne la construit seul,
          et personne ne la construit en un jour.
        </p>
        <p className="mt-4">
          Ici, chaque pavé est une contribution : un don, un outil prêté, quelques heures offertes. Plus la contribution
          est grande, plus la pierre est large. Mais chaque pierre compte : sans les petites, la route a des trous.
        </p>
      </EnTete>

      <div className="mt-10 flex gap-6 overflow-x-auto border-b border-ligne -mx-5 px-5" role="tablist" aria-label="Choisir un projet">
        {projects.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === id}
            onClick={() => setParams({ projet: p.id }, { replace: true })}
            className={`shrink-0 pb-3 -mb-px border-b-2 transition-colors ${p.id === id ? 'border-encre text-encre' : 'border-transparent text-gris hover:text-encre'}`}
          >
            {p.titre}
          </button>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-[1fr_400px] gap-12 items-start">
        <div className="md:sticky md:top-10 order-2 md:order-1">
          <p className="text-sm text-gris">{projet.domaine}</p>
          <h2 className="text-3xl mt-1">{projet.titre}</h2>
          <p className="mt-3 text-gris leading-relaxed">{projet.accroche}</p>
          <Barre valeur={progression} className="mt-6" />
          <p className="mt-2 text-sm text-gris"><span className="text-encre">{euros(promis)}</span> promis sur {euros(projet.objectif_montant)} · {paves.length} pavés</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Bouton to={`/contribuer?projet=${id}`} variante="terre">Poser mon pavé</Bouton>
            <Link to={`/projets/${id}`} className="underline hover:text-terre-fonce">Fiche du projet</Link>
          </div>
          <div className="mt-12 pt-6 border-t border-ligne">
            <Legende />
          </div>
        </div>

        <div className="order-1 md:order-2">
          {paves.length > 0 ? (
            <Trace projet={projet} paves={paves} progression={progression} onChoisir={setChoisi} />
          ) : (
            <div className="py-10 border-y border-ligne">
              <p className="font-display text-xl">Cette trace attend sa première pierre.</p>
              <p className="mt-1 text-gris">Et si c'était la tienne ?</p>
              <Bouton to={`/contribuer?projet=${id}`} variante="terre" className="mt-5">Poser le premier pavé</Bouton>
            </div>
          )}
        </div>
      </div>

      <FichePave pave={choisi} projet={projet} onFermer={() => setChoisi(null)} />
    </div>
  )
}
