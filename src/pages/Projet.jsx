import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useProjet } from '../lib/store.jsx'
import { TYPES, euros } from '../lib/paves.js'
import Trace, { FichePave, Legende } from '../components/Trace.jsx'
import { Barre, Bouton } from '../components/Elements.jsx'
import Introuvable from './Introuvable.jsx'

export default function Projet() {
  const { id } = useParams()
  const data = useProjet(id)
  const [params, setParams] = useSearchParams()
  const nouveauId = params.get('nouveau')
  const [choisi, setChoisi] = useState(null)
  const [message, setMessage] = useState(!!nouveauId)
  const fermer = useCallback(() => setChoisi(null), [])

  useEffect(() => {
    if (!nouveauId) return
    const t = setTimeout(() => setMessage(false), 6000)
    return () => clearTimeout(t)
  }, [nouveauId])

  if (!data) return <Introuvable />
  const { projet, paves, besoins, promis, progression, reste } = data
  const nouveau = paves.find((p) => p.id === nouveauId)

  const infos = [
    ['Impact', projet.emplois_crees],
    ['Référent·e', `${projet.referent.prenom}, ${projet.referent.role}`],
    ['Demande', projet.preuve_demande],
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 pt-10">
      <Link to="/trace" className="text-sm text-gris hover:text-encre">← La Trace</Link>

      <div className="mt-8 grid md:grid-cols-[1fr_400px] gap-12 items-start">
        <div>
          <p className="text-sm text-gris">{projet.domaine}</p>
          <h1 className="text-5xl sm:text-6xl mt-1 leading-none">{projet.titre}</h1>
          <p className="mt-6 text-lg text-gris leading-relaxed">{projet.description}</p>

          <Barre valeur={progression} className="mt-10" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <p><span className="font-display text-3xl">{euros(promis)}</span> <span className="text-gris">promis sur {euros(projet.objectif_montant)}</span></p>
            <p className="text-sm text-gris">Reste à financer : <span className="text-encre">{euros(reste)}</span></p>
          </div>

          <dl className="mt-10 border-t border-ligne">
            {infos.map(([t, v]) => (
              <div key={t} className="grid grid-cols-[110px_1fr] gap-4 py-3 border-b border-ligne">
                <dt className="text-sm text-gris pt-0.5">{t}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-16 text-2xl sm:text-3xl">Besoins</h2>
          <ul className="mt-5 border-t border-ligne">
            {besoins.map((b) => {
              const pourvu = b.statut === 'pourvu'
              return (
                <li key={b.id} className="flex items-baseline gap-3 py-3.5 border-b border-ligne">
                  <span className="w-2.5 h-2.5 rounded-[2px] shrink-0 translate-y-[-1px]" style={{ background: TYPES[b.type].couleur }} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className={pourvu ? 'text-gris line-through decoration-1' : ''}>{b.libelle}</p>
                    <p className="text-sm text-gris">{TYPES[b.type].label} · {b.type === 'argent' ? `reste ${euros(reste)}` : b.quantite}</p>
                  </div>
                  <span className={`text-sm shrink-0 ${pourvu ? 'text-gris' : 'text-terre'}`}>{pourvu ? 'pourvu' : 'ouvert'}</span>
                </li>
              )
            })}
          </ul>

          {projet.recrute && (
            <div className="mt-16">
              <h2 className="text-2xl sm:text-3xl">On recrute</h2>
              <p className="mt-4 text-lg">{projet.recrute.poste}</p>
              <p className="mt-1 text-gris leading-relaxed">{projet.recrute.detail} Candidatures ouvertes dès que le financement est réuni.</p>
            </div>
          )}

          <div className="mt-12">
            <Bouton to={`/contribuer?projet=${projet.id}`} variante="terre">Contribuer à ce projet</Bouton>
          </div>
        </div>

        <div className="md:sticky md:top-10">
          <h2 className="text-2xl mb-2">Sa trace</h2>
          <p className="text-sm text-gris mb-4">{paves.length} pavés posés. Touchez-en un.</p>
          <Trace projet={projet} paves={paves} progression={progression} nouveauId={nouveauId} onChoisir={setChoisi} />
          <div className="mt-6 pt-6 border-t border-ligne"><Legende /></div>
        </div>
      </div>

      {nouveau && message && (
        <div className="fixed bottom-5 inset-x-0 z-40 px-5 fondu" role="status">
          <div className="max-w-md mx-auto bg-encre text-papier px-5 py-4 flex gap-4 items-start">
            <div className="flex-1">
              <p className="font-display text-lg">Votre pavé est posé.</p>
              <p className="text-sm opacity-75 mt-0.5">Merci. Partagez la Trace pour que d'autres posent le leur.</p>
            </div>
            <button onClick={() => { setMessage(false); setParams({}, { replace: true }) }} className="text-sm opacity-75 hover:opacity-100">
              Fermer
            </button>
          </div>
        </div>
      )}

      <FichePave pave={choisi} projet={projet} onFermer={fermer} />
    </div>
  )
}
