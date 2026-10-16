import { useCallback, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useProjet } from '../lib/store.jsx'
import { TYPES, euros } from '../lib/paves.js'
import { partager } from '../lib/partage.js'
import Trace, { FichePave, Legende } from '../components/Trace.jsx'
import { Barre, Bouton } from '../components/Elements.jsx'
import Recrutement from '../components/Recrutement.jsx'
import Introuvable from './Introuvable.jsx'

export default function Projet() {
  const { id } = useParams()
  const data = useProjet(id)
  const [params, setParams] = useSearchParams()
  const nouveauId = params.get('nouveau')
  const [choisi, setChoisi] = useState(null)
  const [message, setMessage] = useState(!!nouveauId)
  const [etatPartage, setEtatPartage] = useState('')
  const fermer = useCallback(() => setChoisi(null), [])

  if (!data) return <Introuvable />
  const { projet, paves, besoins, promis, progression, reste } = data
  const nouveau = paves.find((p) => p.id === nouveauId)

  const partagerProjet = async (aPose) => {
    const r = await partager({
      titre: `Ansanm — ${projet.titre}`,
      texte: aPose
        ? `J'ai posé mon pavé sur la trace « ${projet.titre} » avec Ansanm. Et toi, tu poses quoi ?`
        : `Découvre la trace « ${projet.titre} » sur Ansanm. Et toi, tu poses quoi ?`,
      url: `${window.location.origin}/projets/${projet.id}`,
    })
    setEtatPartage(r === 'copie' ? 'Lien copié, colle-le où tu veux !' : r === 'echec' ? 'Copie impossible, partage l’adresse de la page.' : '')
  }

  const voirMaPierre = () => document.getElementById('pave-' + nouveauId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <div className="max-w-5xl mx-auto px-5 pt-10">
      <Link to="/trace" className="text-sm text-gris hover:text-encre">← La Trace</Link>

      <div className="mt-8 grid md:grid-cols-[1fr_400px] gap-12 items-start">
        <div>
          <p className="text-sm text-gris">{projet.domaine}</p>
          <h1 className="text-5xl sm:text-6xl mt-1 leading-none">{projet.titre}</h1>
          <p className="mt-6 font-display text-2xl leading-snug text-terre-fonce">{projet.accroche}</p>

          <Barre valeur={progression} className="mt-10" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <p><span className="font-display text-3xl">{euros(promis)}</span> <span className="text-gris">promis sur {euros(projet.objectif_montant)}</span></p>
            <p className="text-sm text-gris">Reste à financer : <span className="text-encre">{euros(reste)}</span></p>
          </div>

          <h2 className="mt-14 text-2xl sm:text-3xl">L'histoire</h2>
          <div className="mt-4 space-y-4 text-lg text-gris leading-relaxed">
            {projet.histoire.map((t, i) => <p key={i}>{t}</p>)}
          </div>

          <h2 className="mt-14 text-2xl sm:text-3xl">Ce que ça change</h2>
          <ul className="mt-4 border-t border-ligne">
            {projet.impacts.map((t) => <li key={t} className="py-3 border-b border-ligne">{t}</li>)}
          </ul>

          <dl className="mt-14 grid sm:grid-cols-2 gap-8">
            <div>
              <dt className="font-display text-xl">Qui le porte</dt>
              <dd className="mt-2 text-gris leading-relaxed">{projet.porteur}</dd>
            </div>
            <div>
              <dt className="font-display text-xl">Qui l'attend</dt>
              <dd className="mt-2 text-gris leading-relaxed">{projet.attente}</dd>
            </div>
          </dl>

          <h2 className="mt-14 text-2xl sm:text-3xl">Ce dont on a besoin</h2>
          <p className="mt-4 text-gris leading-relaxed">
            Chaque projet est découpé en besoins précis. Tu peux en remplir un avec de l'argent, mais aussi avec du
            matériel, ton temps ou tes compétences. Le restaurateur qui donne son four, la retraitée qui offre trois
            heures par semaine, l'entreprise qui finance le reste : chacun pose sa pierre.
          </p>
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
                  <span className={`text-sm shrink-0 ${pourvu ? 'text-gris' : 'text-terre-fonce'}`}>{pourvu ? 'pourvu' : 'ouvert'}</span>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Bouton to={`/contribuer?projet=${projet.id}`} variante="terre">Contribuer à ce projet</Bouton>
            <button onClick={() => partagerProjet(false)} className="underline hover:text-terre-fonce">Partager ce projet</button>
          </div>
          {etatPartage && !message && <p className="mt-3 text-sm text-gris" role="status">{etatPartage}</p>}

          {projet.recrute && <Recrutement projet={projet} />}
        </div>

        <div className="md:sticky md:top-10">
          <h2 className="text-2xl mb-2">Sa trace</h2>
          {paves.length > 0 ? (
            <>
              <p className="text-sm text-gris mb-4">{paves.length} pavés posés. Touches-en un.</p>
              <Trace projet={projet} paves={paves} progression={progression} nouveauId={nouveauId} onChoisir={setChoisi} />
            </>
          ) : (
            <div className="py-10 border-y border-ligne">
              <p className="font-display text-xl">Cette trace attend sa première pierre.</p>
              <p className="mt-1 text-gris">Et si c'était la tienne ?</p>
              <Bouton to={`/contribuer?projet=${projet.id}`} variante="terre" className="mt-5">Poser le premier pavé</Bouton>
            </div>
          )}
          <div className="mt-6 pt-6 border-t border-ligne"><Legende /></div>
        </div>
      </div>

      {nouveau && message && (
        <div className="fixed bottom-5 inset-x-0 z-40 px-5 fondu" role="status">
          <div className="max-w-md mx-auto bg-encre text-papier px-5 py-4 flex gap-4 items-start">
            <div className="flex-1">
              <p className="font-display text-xl">Ta pierre est posée.</p>
              <p className="text-sm opacity-80 mt-1">
                {etatPartage || `Merci. Grâce à toi, la trace ${projet.titre} avance d'un pas. Partage-la autour de toi : une route se construit plus vite à plusieurs.`}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 items-center">
                <button onClick={() => partagerProjet(true)} className="bg-papier text-encre px-4 py-2 rounded-[3px] text-sm hover:bg-beige transition-colors">
                  Partager
                </button>
                <button onClick={voirMaPierre} className="text-sm underline opacity-90 hover:opacity-100">Voir ma pierre sur la Trace</button>
              </div>
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
