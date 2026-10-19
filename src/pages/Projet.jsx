import { useCallback, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useProjet } from '../lib/store.jsx'
import { TYPES, euros } from '../lib/paves.js'
import { partager } from '../lib/partage.js'
import Trace, { FichePave, Legende } from '../components/Trace.jsx'
import { Action, Aplat } from '../components/Nouveau.jsx'
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
    <div className="nouveau">
      <Aplat couleur="olive" interieur="pt-10 sm:pt-14 pb-12 sm:pb-16">
        <Link to="/trace" className="text-beige/75 hover:text-beige underline underline-offset-4">Toutes les traces</Link>
        <p className="mt-10 text-lg text-sauge font-semibold">{projet.domaine}</p>
        <h1 className="mt-1 text-6xl sm:text-8xl">{projet.titre}</h1>
        <p className="mt-6 text-2xl sm:text-3xl leading-snug max-w-3xl text-beige/90">{projet.accroche}</p>
        <div className="mt-10 max-w-xl">
          <p className="text-2xl">
            <strong className="font-[750]">{euros(promis)}</strong> sur {euros(projet.objectif_montant)}
          </p>
          <div className="mt-3 h-3 rounded-full bg-olive-nuit overflow-hidden" role="progressbar" aria-valuenow={Math.round(progression * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-terre" style={{ width: `${Math.max(2, progression * 100)}%` }} />
          </div>
          <p className="mt-2 text-beige/75">Il reste {euros(reste)} à réunir, et {paves.length} pavés sont déjà posés.</p>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Action to={`/contribuer?projet=${projet.id}`} sombre>Contribuer à ce projet</Action>
          <Action onClick={() => partagerProjet(false)} discret>Partager ce projet</Action>
        </div>
        {etatPartage && !message && <p className="mt-3 text-beige/80" role="status">{etatPartage}</p>}
      </Aplat>

      <Aplat interieur="py-16 sm:py-20 grid md:grid-cols-[1fr_420px] gap-14 items-start">
        <div>
          <h2 className="text-4xl sm:text-5xl">L'histoire</h2>
          <div className="mt-6 space-y-5 text-xl leading-relaxed max-w-[62ch]">
            {projet.histoire.map((t, i) => <p key={i}>{t}</p>)}
          </div>

          <h2 className="mt-16 text-4xl sm:text-5xl">Ce que ça change</h2>
          <ul className="mt-6 space-y-3 text-xl">
            {projet.impacts.map((t, i) => (
              <li key={t} className="flex gap-4 items-baseline">
                <span className="w-4 h-3.5 shrink-0 rounded-[3px] translate-y-[1px]" style={{ background: ['#C57B57', '#A8BFA1', '#C9A46E', '#4E5C4B'][i % 4], rotate: `${(i % 2 ? -1 : 1) * 8}deg` }} aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-16 grid sm:grid-cols-2 gap-4">
            <div className="bg-beige rounded-[22px] p-6">
              <h3 className="text-2xl">Qui le porte</h3>
              <p className="mt-3 text-lg leading-relaxed">{projet.porteur}</p>
            </div>
            <div className="bg-sauge rounded-[22px] p-6 text-olive-nuit">
              <h3 className="text-2xl">Qui l'attend</h3>
              <p className="mt-3 text-lg leading-relaxed">{projet.attente}</p>
            </div>
          </div>

          <h2 className="mt-16 text-4xl sm:text-5xl">Ce dont on a besoin</h2>
          <p className="mt-6 text-lg leading-relaxed max-w-[62ch] text-olive/85">
            Chaque projet est découpé en besoins précis. Tu peux en remplir un avec de l'argent, mais aussi avec du
            matériel, ton temps ou tes compétences. Le restaurateur qui donne son four, la retraitée qui offre trois
            heures par semaine, l'entreprise qui finance le reste : chacun pose sa pierre.
          </p>
          <ul className="mt-8 space-y-2">
            {besoins.map((b) => {
              const pourvu = b.statut === 'pourvu'
              return (
                <li key={b.id} className={`flex items-center gap-4 rounded-xl px-5 py-4 ${pourvu ? 'bg-transparent border-2 border-dashed border-beige' : 'bg-beige'}`}>
                  <span className="w-5 h-4 rounded-[3px] shrink-0" style={{ background: TYPES[b.type].couleur }} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg font-semibold leading-snug ${pourvu ? 'text-olive/60' : ''}`}>{b.libelle}</p>
                    <p className="text-olive/75">{TYPES[b.type].label}, {b.type === 'argent' ? `il reste ${euros(reste)}` : b.quantite}</p>
                  </div>
                  <span className={`shrink-0 font-semibold ${pourvu ? 'text-olive/60' : 'text-terre-fonce'}`}>{pourvu ? 'Pourvu' : 'Ouvert'}</span>
                </li>
              )
            })}
          </ul>

          {projet.recrute && <Recrutement projet={projet} />}
        </div>

        <div className="md:sticky md:top-8">
          <h2 className="text-3xl">Sa trace</h2>
          {paves.length > 0 ? (
            <>
              <p className="mt-1 mb-4 text-olive/75">Touche un pavé pour savoir qui l'a posé.</p>
              <Trace projet={projet} paves={paves} progression={progression} nouveauId={nouveauId} onChoisir={setChoisi} />
            </>
          ) : (
            <div className="mt-4 bg-beige rounded-[22px] p-8">
              <p className="text-2xl font-[700]">Cette trace attend sa première pierre.</p>
              <p className="mt-1 text-lg">Et si c'était la tienne ?</p>
              <Action to={`/contribuer?projet=${projet.id}`} className="mt-6">Poser le premier pavé</Action>
            </div>
          )}
          <div className="mt-6 bg-beige rounded-[22px] p-6"><Legende /></div>
        </div>
      </Aplat>

      {nouveau && message && (
        <div className="fixed bottom-24 lg:bottom-4 inset-x-0 z-40 px-4 fondu" role="status">
          <div className="max-w-md mx-auto bg-olive-nuit text-beige rounded-2xl px-6 py-5 shadow-2xl flex gap-4 items-start">
            <div className="flex-1">
              <p className="text-2xl font-[760] tracking-tight">Ta pierre est posée.</p>
              <p className="mt-1 text-beige/85">
                {etatPartage || `Merci. Grâce à toi, la trace ${projet.titre} avance d'un pas. Partage-la autour de toi : une route se construit plus vite à plusieurs.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 items-center">
                <button onClick={() => partagerProjet(true)} className="bg-beige text-olive-nuit font-semibold px-5 py-2.5 rounded-lg hover:bg-papier transition-colors">
                  Partager
                </button>
                <button onClick={voirMaPierre} className="font-semibold underline underline-offset-4">Voir ma pierre sur la Trace</button>
              </div>
            </div>
            <button onClick={() => { setMessage(false); setParams({}, { replace: true }) }} className="text-beige/75 hover:text-beige">
              Fermer
            </button>
          </div>
        </div>
      )}

      <FichePave pave={choisi} projet={projet} onFermer={fermer} />
    </div>
  )
}
