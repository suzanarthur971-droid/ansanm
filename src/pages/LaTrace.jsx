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
      <EnTete titre="La Trace">
        Ensemble, nous construisons le chemin de chaque projet, pavé par pavé. Touche un pavé pour savoir qui l'a posé, et pourquoi.
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
          <Trace projet={projet} paves={paves} progression={progression} onChoisir={setChoisi} />
        </div>
      </div>

      <FichePave pave={choisi} projet={projet} onFermer={() => setChoisi(null)} />
    </div>
  )
}
