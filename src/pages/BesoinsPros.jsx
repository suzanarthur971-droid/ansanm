import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Action, Aplat, Exemple } from '../components/Nouveau.jsx'

export const TYPES_BESOIN = {
  service: { label: 'Service à trouver', couleur: '#C57B57' },
  coup_de_pouce: { label: 'Coup de pouce', couleur: '#A8BFA1' },
  relocalisation: { label: 'Relocalisation', couleur: '#C9A46E' },
}

export const REGLE_COUP_DE_POUCE =
  'Un coup de pouce, ce sont des pistes, pas une production. Quelques idées, un avis, une heure de regard. Pour aller plus loin, on en parle ensemble : le travail mérite d’être rémunéré.'

const champ = 'w-full bg-white/80 border-2 border-beige rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-olive'

export function nomStructure(b, members) {
  return members.find((m) => m.id === b.member_id)?.nom || b.structure || 'Une structure'
}

function Repondre({ besoin, typeDepart, onFermer }) {
  const { ajouterReponsePro } = useData()
  const [f, setF] = useState({ type: typeDepart, nom: '', contact: '', message: '', regle: false })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const envoyer = (e) => {
    e.preventDefault()
    if (!f.nom.trim() || f.contact.trim().length < 5 || !f.message.trim()) return setErreur('Indiquez votre nom, un moyen de vous joindre et un message.')
    if (f.type === 'coup_de_pouce' && !f.regle) return setErreur('Cochez la case pour confirmer que vous avez lu la règle du coup de pouce.')
    ajouterReponsePro({ need_id: besoin.id, type: f.type, nom: f.nom.trim(), contact: f.contact.trim(), message: f.message.trim() })
    setEnvoye(true)
  }

  if (envoye) {
    return (
      <div className="mt-5 bg-olive text-beige rounded-xl p-5 fondu" role="status">
        <p className="text-xl font-[700]">Merci ! Votre réponse a été transmise.</p>
        <p className="mt-1 text-beige/85">C'est comme ça qu'on se renforce : ansanm.</p>
      </div>
    )
  }

  return (
    <form onSubmit={envoyer} className="mt-5 bg-papier rounded-xl p-5 space-y-4 fondu" noValidate>
      <fieldset>
        <legend className="font-[700] text-lg mb-2">Comment voulez-vous aider ?</legend>
        <div className="flex flex-wrap gap-2">
          {[['service', 'Je peux le faire (service)'], ['coup_de_pouce', 'Je donne un coup de pouce (bénévole)']].map(([v, l]) => (
            <label key={v} className={`flex items-baseline gap-2 rounded-lg px-4 py-2.5 cursor-pointer ${f.type === v ? 'bg-olive text-beige' : 'bg-beige/70'}`}>
              <input type="radio" name={`type-${besoin.id}`} value={v} checked={f.type === v} onChange={maj('type')} className="accent-terre" />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`nom-${besoin.id}`} className="text-olive/80">Votre nom ou votre structure</label>
          <input id={`nom-${besoin.id}`} value={f.nom} onChange={maj('nom')} className={champ + ' mt-1'} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor={`contact-${besoin.id}`} className="text-olive/80">E-mail ou téléphone</label>
          <input id={`contact-${besoin.id}`} value={f.contact} onChange={maj('contact')} className={champ + ' mt-1'} autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor={`msg-${besoin.id}`} className="text-olive/80">Votre message</label>
        <textarea id={`msg-${besoin.id}`} rows="3" maxLength={1000} value={f.message} onChange={maj('message')} className={champ + ' mt-1'} />
      </div>
      {f.type === 'coup_de_pouce' && (
        <div className="bg-sauge/40 rounded-lg p-4">
          <p className="text-olive-nuit">{REGLE_COUP_DE_POUCE}</p>
          <label className="mt-3 flex gap-3 items-baseline cursor-pointer">
            <input type="checkbox" checked={f.regle} onChange={maj('regle')} className="accent-terre w-5 h-5 shrink-0 translate-y-[2px]" />
            <span className="font-semibold">J'ai lu la règle du coup de pouce</span>
          </label>
        </div>
      )}
      {erreur && <p className="text-terre-fonce font-semibold" role="alert">{erreur}</p>}
      <div className="flex items-center gap-5">
        <button type="submit" className="bg-terre-fonce text-papier font-semibold px-6 py-3 rounded-lg hover:bg-terre-profond transition-colors">Envoyer</button>
        <button type="button" onClick={onFermer} className="underline underline-offset-4">Annuler</button>
      </div>
    </form>
  )
}

function CarteBesoin({ besoin }) {
  const { members, reponsesPros } = useData()
  const [reponse, setReponse] = useState(null)
  const type = TYPES_BESOIN[besoin.type]
  const pourvu = besoin.statut === 'pourvu'
  const histoire = reponsesPros.find((r) => r.need_id === besoin.id && r.statut === 'partenariat')

  return (
    <li className="bg-beige rounded-[22px] p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px]">
        <span className="inline-flex items-center gap-2 font-semibold">
          <span className="w-3.5 h-3 rounded-[3px]" style={{ background: type.couleur }} aria-hidden="true" />
          {type.label}
        </span>
        <span className="text-olive/70 capitalize">{besoin.domaine}</span>
        {besoin.exemple && <Exemple />}
        {besoin.statut !== 'ouvert' && (
          <span className={`ml-auto font-semibold ${pourvu ? 'text-olive' : 'text-terre-fonce'}`}>{pourvu ? 'Pourvu' : 'En cours'}</span>
        )}
      </div>
      <p className="mt-4 text-lg"><strong className="font-[750]">{nomStructure(besoin, members)}</strong> cherche :</p>
      <p className="mt-1 text-2xl sm:text-[1.7rem] font-[700] leading-snug tracking-tight">{besoin.description}</p>
      {besoin.situation_actuelle && <p className="mt-3 text-olive/80">Aujourd'hui : {besoin.situation_actuelle}</p>}
      {histoire && <p className="mt-4 bg-papier rounded-xl p-4 leading-relaxed">{histoire.histoire}</p>}
      {!pourvu && !reponse && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => setReponse('service')} className="bg-olive text-beige font-semibold px-5 py-2.5 rounded-lg hover:bg-olive-nuit transition-colors">Je peux le faire</button>
          <button onClick={() => setReponse('coup_de_pouce')} className="bg-papier font-semibold px-5 py-2.5 rounded-lg hover:bg-white transition-colors">Je donne un coup de pouce</button>
        </div>
      )}
      {reponse && <Repondre besoin={besoin} typeDepart={reponse} onFermer={() => setReponse(null)} />}
    </li>
  )
}

function Diagnostic() {
  const { demanderDiagnostic } = useData()
  const [ouvert, setOuvert] = useState(false)
  const [f, setF] = useState({ structure: '', liens: '', contact: '', message: '' })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const envoyer = (e) => {
    e.preventDefault()
    if (!f.structure.trim() || f.contact.trim().length < 5) return setErreur('Indiquez le nom de votre structure et un moyen de vous joindre.')
    demanderDiagnostic({ structure: f.structure.trim(), liens: f.liens.trim() || null, contact: f.contact.trim(), message: f.message.trim() || null })
    setEnvoye(true)
  }

  return (
    <div className="bg-sauge text-olive-nuit rounded-[22px] p-6 sm:p-8">
      <h2 className="text-3xl sm:text-4xl">Votre structure est-elle facile à trouver ?</h2>
      <p className="mt-4 text-lg leading-relaxed max-w-2xl">
        De bonnes idées restent invisibles faute d'être bien référencées. Des bénévoles peuvent regarder votre site et
        vos réseaux, et vous envoyer une liste claire de ce qui bloque.
      </p>
      {envoye ? (
        <p className="mt-6 text-xl font-[700] fondu" role="status">Demande envoyée. Un bénévole vous recontacte pour démarrer.</p>
      ) : !ouvert ? (
        <button onClick={() => setOuvert(true)} className="mt-6 bg-olive-nuit text-beige font-semibold px-6 py-3.5 rounded-lg hover:bg-olive transition-colors">
          Demander un diagnostic de visibilité
        </button>
      ) : (
        <form onSubmit={envoyer} className="mt-6 grid sm:grid-cols-2 gap-4 fondu" noValidate>
          <div>
            <label htmlFor="d-structure">Votre structure</label>
            <input id="d-structure" value={f.structure} onChange={maj('structure')} className={champ + ' mt-1'} autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="d-contact">E-mail ou téléphone</label>
            <input id="d-contact" value={f.contact} onChange={maj('contact')} className={champ + ' mt-1'} autoComplete="email" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="d-liens">Votre site et vos réseaux (facultatif)</label>
            <input id="d-liens" value={f.liens} onChange={maj('liens')} placeholder="monsite.gp, instagram.com/…" className={champ + ' mt-1'} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="d-msg">Ce qui vous préoccupe (facultatif)</label>
            <textarea id="d-msg" rows="2" value={f.message} onChange={maj('message')} className={champ + ' mt-1'} />
          </div>
          {erreur && <p className="sm:col-span-2 text-terre-profond font-semibold" role="alert">{erreur}</p>}
          <div className="sm:col-span-2">
            <button type="submit" className="bg-olive-nuit text-beige font-semibold px-6 py-3.5 rounded-lg hover:bg-olive transition-colors">Envoyer ma demande</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function BesoinsPros() {
  const { besoinsPros } = useData()
  const [type, setType] = useState('tous')
  const [domaine, setDomaine] = useState('tous')

  const domaines = useMemo(() => [...new Set(besoinsPros.map((b) => b.domaine).filter(Boolean))].sort(), [besoinsPros])
  const ordre = { ouvert: 0, 'en cours': 1, pourvu: 2 }
  const liste = besoinsPros
    .filter((b) => (type === 'tous' || b.type === type) && (domaine === 'tous' || b.domaine === domaine))
    .sort((a, b) => ordre[a.statut] - ordre[b.statut] || (a.date < b.date ? 1 : -1))

  return (
    <div className="nouveau">
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12 grid md:grid-cols-[1fr_1fr] gap-8 md:gap-16 items-end">
        <h1 className="text-5xl sm:text-7xl">Entre pros, on se donne la main.</h1>
        <div>
          <p className="text-lg leading-relaxed text-beige/90">
            Chaque fois qu'une entreprise guadeloupéenne va chercher ailleurs ce qu'elle pourrait trouver ici, c'est une
            richesse qui quitte l'île. Ici, les structures de l'annuaire disent ce dont elles ont besoin. Et d'autres
            répondent : avec un service, ou avec un coup de pouce.
          </p>
          <Action to="/besoins-pros/publier" sombre className="mt-7">Publier un besoin</Action>
        </div>
      </Aplat>

      <Aplat interieur="py-12 grid lg:grid-cols-[1fr_340px] gap-10 items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer par type">
            {[['tous', 'Tous'], ...Object.entries(TYPES_BESOIN).map(([k, v]) => [k, v.label])].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setType(k)}
                aria-pressed={type === k}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${type === k ? 'bg-olive text-beige' : 'bg-beige hover:bg-[#E2D4B8]'}`}
              >
                {l}
              </button>
            ))}
            <label htmlFor="f-domaine" className="sr-only">Domaine</label>
            <select id="f-domaine" value={domaine} onChange={(e) => setDomaine(e.target.value)} className="px-4 py-2.5 rounded-lg bg-papier border-2 border-beige font-semibold">
              <option value="tous">Tous les domaines</option>
              {domaines.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {liste.length === 0 ? (
            <p className="mt-10 text-lg">Rien ici pour le moment. La route commence toujours par un premier pas.</p>
          ) : (
            <ul className="mt-8 space-y-4">
              {liste.map((b) => <CarteBesoin key={b.id} besoin={b} />)}
            </ul>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="bg-olive text-beige rounded-[22px] p-6">
            <h2 className="text-2xl">La règle du coup de pouce</h2>
            <p className="mt-3 leading-relaxed text-beige/90">{REGLE_COUP_DE_POUCE}</p>
          </div>
          <div className="bg-beige rounded-[22px] p-6">
            <h2 className="text-2xl">Vous avez un besoin ?</h2>
            <p className="mt-3 leading-relaxed">Les structures de l'annuaire peuvent publier un ou plusieurs besoins.</p>
            <Link to="/besoins-pros/publier" className="mt-4 inline-block font-semibold underline decoration-2 underline-offset-4 hover:decoration-terre">Publier un besoin</Link>
          </div>
        </aside>
      </Aplat>

      <Aplat interieur="pb-16">
        <Diagnostic />
      </Aplat>
    </div>
  )
}
