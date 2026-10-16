import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData, useProjet } from '../lib/store.jsx'
import { euros } from '../lib/paves.js'
import Trace, { FichePave, Legende } from '../components/Trace.jsx'
import { Barre, Bouton, EnTete } from '../components/Elements.jsx'
import Icone from '../components/Icones.jsx'

export default function LaTrace() {
  const { projects } = useData()
  const [params, setParams] = useSearchParams()
  const id = projects.some((p) => p.id === params.get('projet')) ? params.get('projet') : projects[0].id
  const { projet, paves, promis, progression, reste } = useProjet(id)
  const [choisi, setChoisi] = useState(null)

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8">
      <EnTete surtitre="La Trace" titre="Chaque contribution est un pavé posé sur le chemin.">
        Argent, matériel, temps ou compétences : toutes les contributions comptent. Touchez un pavé pour découvrir qui l'a posé, et pourquoi.
      </EnTete>

      <div className="mt-6 -mx-4 px-4 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Choisir un projet">
        {projects.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === id}
            onClick={() => setParams({ projet: p.id }, { replace: true })}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ring-1 ${p.id === id ? 'text-white ring-transparent' : 'bg-white text-encre ring-sable-fonce'}`}
            style={p.id === id ? { background: p.couleur } : undefined}
          >
            {p.titre}
          </button>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_440px] gap-8 items-start">
        <div className="lg:sticky lg:top-24 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-6 ring-1 ring-sable-fonce/60">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: projet.couleur }}>{projet.domaine}</p>
            <h2 className="mt-1 text-2xl font-extrabold">{projet.titre}</h2>
            <p className="mt-2 text-encre-doux">{projet.accroche}</p>
            <div className="mt-5">
              <Barre valeur={progression} couleur={projet.couleur} />
              <div className="mt-2 flex flex-wrap justify-between gap-x-4 text-sm">
                <span><strong>{euros(promis)}</strong> promis sur {euros(projet.objectif_montant)}</span>
                <span className="text-encre-doux">reste {euros(reste)}</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Bouton to={`/contribuer?projet=${id}`}>Poser mon pavé</Bouton>
              <Bouton to={`/projets/${id}`} variante="contour">Fiche du projet</Bouton>
            </div>
          </div>
          <div className="bg-white/60 rounded-3xl p-6 ring-1 ring-sable-fonce/60">
            <Legende />
          </div>
          <p className="text-sm text-encre-doux flex gap-2">
            <Icone nom="boucle" className="w-5 h-5 shrink-0 text-feuille" />
            <span>Les trois traces se rejoignent : le jardin nourrit la cuisine, et les restes de la cuisine retournent au jardin. <Link to="/" className="underline">Voir la boucle</Link></span>
          </p>
        </div>

        <div className="order-1 lg:order-2 bg-sable/60 rounded-3xl py-4 -mx-4 sm:mx-0">
          <Trace projet={projet} paves={paves} progression={progression} onChoisir={setChoisi} />
        </div>
      </div>

      <FichePave pave={choisi} projet={projet} onFermer={() => setChoisi(null)} />
    </div>
  )
}
