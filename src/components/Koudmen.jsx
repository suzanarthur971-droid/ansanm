import { useState } from 'react'
import { useData } from '../lib/store.jsx'
import { Exemple, champ } from './Nouveau.jsx'

const dateKoudmen = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

// S'inscrire à un koudmen : on prévient l'équipe, et le coup de main devient un pavé de temps sur la Trace
function JeViens({ koudmen, onFermer }) {
  const { inscrireKoudmen, ajouterContribution } = useData()
  const [f, setF] = useState({ prenom: '', contact: '', afficher: true })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const envoyer = (e) => {
    e.preventDefault()
    if (!f.prenom.trim() || f.contact.trim().length < 5) return setErreur('Indique ton prénom et un e-mail ou un numéro pour recevoir les détails.')
    inscrireKoudmen({ koudmen, prenom: f.prenom.trim(), contact: f.contact.trim() })
    ajouterContribution({
      project_id: koudmen.project_id,
      need_id: null,
      type: 'temps',
      description: `Koudmen : ${koudmen.titre.toLowerCase()}, ${koudmen.lieu.nom}`,
      valeur_estimee: 30,
      motivation: '',
      nom_affiche: f.afficher ? f.prenom.trim() : 'Anonyme',
      profil: 'particulier',
      anonyme: !f.afficher,
      consentement_contact: false,
    })
    setEnvoye(true)
  }

  if (envoye) {
    return (
      <div className="mt-5 bg-olive text-beige rounded-xl p-5 fondu" role="status">
        <p className="text-xl font-[700]">C'est noté, à {dateKoudmen(koudmen.date).split(' ')[0]} !</p>
        <p className="mt-1 text-beige/85">On t'envoie l'adresse et les détails. Ton coup de main est déjà un pavé sur la Trace.</p>
      </div>
    )
  }

  return (
    <form onSubmit={envoyer} className="mt-5 bg-papier rounded-xl p-5 space-y-4 fondu" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`kp-${koudmen.id}`} className="font-semibold">Ton prénom</label>
          <input id={`kp-${koudmen.id}`} value={f.prenom} onChange={maj('prenom')} className={champ + ' mt-1'} autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor={`kc-${koudmen.id}`} className="font-semibold">E-mail ou téléphone</label>
          <input id={`kc-${koudmen.id}`} value={f.contact} onChange={maj('contact')} className={champ + ' mt-1'} autoComplete="tel" />
        </div>
      </div>
      <label className="flex gap-3 items-baseline cursor-pointer">
        <input type="checkbox" checked={f.afficher} onChange={maj('afficher')} className="accent-terre w-5 h-5 shrink-0 translate-y-[3px]" />
        <span>Afficher mon prénom sur la Trace</span>
      </label>
      {erreur && <p className="text-terre-fonce font-semibold" role="alert">{erreur}</p>}
      <div className="flex items-center gap-5">
        <button type="submit" className="bg-terre-fonce text-papier font-semibold px-6 py-3 rounded-lg hover:bg-terre-profond transition-colors">Je m'inscris</button>
        <button type="button" onClick={onFermer} className="underline underline-offset-4">Annuler</button>
      </div>
    </form>
  )
}

export function CarteKoudmen({ koudmen }) {
  const [ouvert, setOuvert] = useState(false)
  const restantes = Math.max(0, koudmen.places - koudmen.inscrits)
  const complet = restantes === 0

  return (
    <li className="bg-beige rounded-[22px] p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-semibold text-terre-fonce first-letter:uppercase">{dateKoudmen(koudmen.date)}</span>
        <span className="text-olive/75">{koudmen.heure}</span>
        {koudmen.exemple && <Exemple className="ml-auto" />}
      </div>
      <h3 className="mt-3 text-2xl sm:text-3xl">{koudmen.titre}</h3>
      <p className="mt-1 font-semibold">{koudmen.lieu.nom}, {koudmen.lieu.commune}</p>
      <p className="mt-3 text-lg leading-relaxed">{koudmen.description}</p>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: koudmen.places }, (_, i) => (
            <span key={i} className={`w-4 h-3.5 rounded-[3px] ${i < koudmen.inscrits ? 'bg-terre' : 'bg-papier border border-olive/25'}`} />
          ))}
        </div>
        <p className="text-olive/80">
          {koudmen.inscrits} inscrit{koudmen.inscrits > 1 ? 's' : ''} sur {koudmen.places}
          {!complet && `, il reste ${restantes} place${restantes > 1 ? 's' : ''}`}
        </p>
      </div>

      {complet ? (
        <p className="mt-5 font-semibold">Complet, merci à tous !</p>
      ) : ouvert ? (
        <JeViens koudmen={koudmen} onFermer={() => setOuvert(false)} />
      ) : (
        <button onClick={() => setOuvert(true)} className="mt-5 bg-olive text-beige font-semibold px-6 py-3 rounded-lg hover:bg-olive-nuit transition-colors">
          Je viens
        </button>
      )}
    </li>
  )
}

export function CarteLieu({ lieu, nbKoudmen }) {
  return (
    <li className="bg-papier rounded-[22px] p-6 ring-2 ring-beige">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl">{lieu.nom}</h3>
          <p className="mt-1 text-olive/75">{lieu.commune}</p>
        </div>
        {lieu.exemple && <Exemple />}
      </div>
      <p className="mt-3 leading-relaxed">{lieu.description}</p>
      <p className="mt-4 flex flex-wrap gap-2">
        {lieu.besoins.map((b) => (
          <span key={b} className="text-[15px] font-semibold bg-sauge/50 rounded-md px-2.5 py-1">{b}</span>
        ))}
      </p>
      {nbKoudmen > 0 && <p className="mt-3 text-[15px] font-semibold text-terre-fonce">{nbKoudmen} koudmen à venir ici</p>}
    </li>
  )
}
