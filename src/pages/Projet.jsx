import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useProjet } from '../lib/store.jsx'
import { TYPES, euros } from '../lib/paves.js'
import Trace, { FichePave, Legende } from '../components/Trace.jsx'
import { Barre, Bouton, Domaine } from '../components/Elements.jsx'
import Icone from '../components/Icones.jsx'
import Introuvable from './Introuvable.jsx'

function Info({ icone, titre, children }) {
  return (
    <div className="flex gap-3">
      <span className="w-10 h-10 rounded-xl bg-sable grid place-items-center shrink-0 text-terre-fonce">
        <Icone nom={icone} />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-encre-doux">{titre}</p>
        <p className="font-medium">{children}</p>
      </div>
    </div>
  )
}

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

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <Link to="/trace" className="inline-flex items-center gap-1 text-sm text-encre-doux hover:text-encre">
        <Icone nom="retour" className="w-4 h-4" /> La Trace
      </Link>

      <div className="mt-4 grid lg:grid-cols-[1fr_440px] gap-10 items-start">
        <div>
          <Domaine couleur={projet.couleur}>{projet.domaine}</Domaine>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-terre-fonce">{projet.titre}</h1>
          <p className="mt-4 text-lg text-encre-doux">{projet.description}</p>

          <div className="mt-6 bg-white rounded-3xl p-5 ring-1 ring-sable-fonce/60">
            <Barre valeur={progression} couleur={projet.couleur} className="h-4" />
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <p><span className="font-display text-3xl font-extrabold">{euros(promis)}</span> <span className="text-encre-doux">promis sur {euros(projet.objectif_montant)}</span></p>
              <p className="text-sm"><strong>Reste à financer : {euros(reste)}</strong> · {paves.length} pavés</p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <Info icone="emploi" titre="Impact">{projet.emplois_crees}</Info>
            <Info icone="personne" titre="Référent·e">{projet.referent.prenom}, {projet.referent.role}</Info>
            <Info icone="preuve" titre="Preuve de demande">{projet.preuve_demande}</Info>
          </div>

          <h2 className="mt-12 text-2xl font-extrabold text-terre-fonce">Ce dont le projet a besoin</h2>
          <ul className="mt-4 space-y-2">
            {besoins.map((b) => {
              const type = TYPES[b.type]
              const pourvu = b.statut === 'pourvu'
              return (
                <li key={b.id} className={`flex items-center gap-3 rounded-2xl p-4 ring-1 ${pourvu ? 'bg-sable/50 ring-transparent' : 'bg-white ring-sable-fonce/60'}`}>
                  <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0 text-white" style={{ background: type.couleur }}>
                    <Icone nom={b.type} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${pourvu ? 'text-encre-doux' : ''}`}>{b.libelle}</p>
                    <p className="text-sm text-encre-doux">
                      {type.label} · {b.type === 'argent' ? `reste ${euros(reste)}` : b.quantite}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${pourvu ? 'bg-feuille/15 text-feuille-fonce' : 'bg-mangue/20 text-terre-fonce'}`}>
                    {pourvu ? 'Pourvu' : 'Ouvert'}
                  </span>
                </li>
              )
            })}
          </ul>

          {projet.recrute && (
            <div className="mt-10 rounded-3xl bg-feuille-fonce text-sable p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-mangue">On recrute</p>
              <p className="mt-2 font-display text-2xl font-bold">{projet.recrute.poste}</p>
              <p className="mt-2 text-sable/80">{projet.recrute.detail}</p>
              <p className="mt-4 text-sm text-sable/70">Candidatures ouvertes dès que le financement est réuni. Parlez-en autour de vous !</p>
            </div>
          )}

          <div className="mt-10 hidden lg:block bg-white/60 rounded-3xl p-6 ring-1 ring-sable-fonce/60">
            <Legende />
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-extrabold text-terre-fonce">Sa trace</h2>
            <span className="text-sm text-encre-doux">touchez un pavé</span>
          </div>
          <div className="bg-sable/60 rounded-3xl py-4 -mx-4 sm:mx-0">
            <Trace projet={projet} paves={paves} progression={progression} nouveauId={nouveauId} onChoisir={setChoisi} />
          </div>
        </div>
      </div>

      {/* bouton fixe pour contribuer */}
      <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-20 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <Bouton to={`/contribuer?projet=${projet.id}`} className="w-full shadow-lg py-3.5">
            Contribuer à ce projet
          </Bouton>
        </div>
      </div>

      {nouveau && message && (
        <div className="fixed top-24 inset-x-0 z-40 px-4 fondu" role="status">
          <div className="max-w-md mx-auto bg-encre text-sable rounded-2xl px-5 py-4 shadow-xl flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-mangue text-encre grid place-items-center shrink-0"><Icone nom="check" /></span>
            <div className="flex-1">
              <p className="font-semibold">Ton pavé est posé !</p>
              <p className="text-sm text-sable/80">Merci pour ta promesse. Partage la Trace pour que d'autres posent le leur.</p>
            </div>
            <button onClick={() => { setMessage(false); setParams({}, { replace: true }) }} aria-label="Fermer" className="p-1">
              <Icone nom="fermer" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <FichePave pave={choisi} projet={projet} onFermer={fermer} />
    </div>
  )
}
