import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Aplat } from '../components/Nouveau.jsx'
import { TYPES_BESOIN } from './BesoinsPros.jsx'

const champ = 'w-full bg-white/80 border-2 border-beige rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-olive'
const AUTRE = 'autre'

export default function PublierBesoin() {
  const { members, ajouterBesoinPro } = useData()
  const [params] = useSearchParams()
  const depart = members.some((m) => m.id === params.get('structure')) ? params.get('structure') : ''
  const domaines = useMemo(() => [...new Set(members.map((m) => m.domaine))].sort(), [members])

  const [f, setF] = useState({
    member_id: depart,
    structure: '',
    description: '',
    type: 'service',
    domaine: members.find((m) => m.id === depart)?.domaine || domaines[0],
    situation_actuelle: '',
    contact: '',
  })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const choisirStructure = (e) => {
    const id = e.target.value
    setF({ ...f, member_id: id, domaine: members.find((m) => m.id === id)?.domaine || f.domaine })
  }

  const envoyer = (e) => {
    e.preventDefault()
    const autre = f.member_id === AUTRE
    if (!f.member_id || (autre && !f.structure.trim())) return setErreur('Indiquez votre structure.')
    if (f.description.trim().length < 5) return setErreur('Décrivez votre besoin en une phrase.')
    if (f.contact.trim().length < 5) return setErreur('Indiquez un e-mail ou un téléphone pour qu’on puisse vous transmettre les réponses.')
    ajouterBesoinPro({
      member_id: autre ? null : f.member_id,
      structure: autre ? f.structure.trim() : members.find((m) => m.id === f.member_id).nom,
      description: f.description.trim(),
      type: f.type,
      domaine: f.domaine,
      situation_actuelle: f.situation_actuelle.trim() || null,
      contact: f.contact.trim(),
    })
    setEnvoye(true)
  }

  return (
    <div className="nouveau">
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12">
        <Link to="/besoins-pros" className="text-beige/75 hover:text-beige underline underline-offset-4">Tous les besoins des pros</Link>
        <h1 className="mt-8 text-5xl sm:text-7xl">Publier un besoin</h1>
        <p className="mt-5 text-xl leading-relaxed max-w-2xl text-beige/90">
          Un service à trouver, un coup de pouce, un achat à relocaliser : dites-le, et les membres d'Ansanm pourront
          vous répondre.
        </p>
      </Aplat>

      <Aplat interieur="!max-w-3xl py-12">
        {envoye ? (
          <div className="bg-beige rounded-[22px] p-8 fondu" role="status">
            <p className="text-3xl font-[760] tracking-tight">Votre besoin est en ligne.</p>
            <p className="mt-3 text-lg">Les membres d'Ansanm vont pouvoir vous répondre.</p>
            <Link to="/besoins-pros" className="mt-6 inline-block font-semibold underline decoration-2 underline-offset-4">Voir les besoins des pros</Link>
          </div>
        ) : (
          <form onSubmit={envoyer} className="space-y-7" noValidate>
            <div>
              <label htmlFor="p-structure" className="text-xl font-[700]">Votre structure</label>
              <select id="p-structure" value={f.member_id} onChange={choisirStructure} className={champ + ' mt-2'}>
                <option value="">Choisir dans l'annuaire</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                <option value={AUTRE}>Ma structure n'est pas encore dans l'annuaire</option>
              </select>
              {f.member_id === AUTRE && (
                <input value={f.structure} onChange={maj('structure')} placeholder="Nom de votre structure" aria-label="Nom de votre structure" className={champ + ' mt-2'} autoComplete="organization" />
              )}
            </div>

            <div>
              <label htmlFor="p-besoin" className="text-xl font-[700]">De quoi avez-vous besoin ?</label>
              <textarea id="p-besoin" rows="2" maxLength={200} value={f.description} onChange={maj('description')} placeholder="On cherche un comptable qui connaît les associations" className={champ + ' mt-2'} />
            </div>

            <fieldset>
              <legend className="text-xl font-[700] mb-2">Type</legend>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TYPES_BESOIN).map(([k, t]) => (
                  <label key={k} className={`flex items-baseline gap-2.5 rounded-lg px-4 py-3 cursor-pointer transition-colors ${f.type === k ? 'bg-olive text-beige' : 'bg-beige/70 hover:bg-beige'}`}>
                    <input type="radio" name="type" value={k} checked={f.type === k} onChange={maj('type')} className="accent-terre" />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="p-domaine" className="text-xl font-[700]">Domaine</label>
              <select id="p-domaine" value={f.domaine} onChange={maj('domaine')} className={champ + ' mt-2 capitalize'}>
                {domaines.map((d) => <option key={d} value={d}>{d}</option>)}
                <option value="autre">autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="p-situation" className="text-xl font-[700]">Aujourd'hui, comment faites-vous ? <span className="font-normal text-olive/70">(facultatif)</span></label>
              <input id="p-situation" value={f.situation_actuelle} onChange={maj('situation_actuelle')} placeholder="On fait appel à un prestataire en Hexagone" className={champ + ' mt-2'} />
            </div>

            <div>
              <label htmlFor="p-contact" className="text-xl font-[700]">E-mail ou téléphone</label>
              <p className="text-olive/70">Pour vous transmettre les réponses. Il n'est pas affiché sur le site.</p>
              <input id="p-contact" value={f.contact} onChange={maj('contact')} className={champ + ' mt-2'} autoComplete="email" />
            </div>

            {erreur && <p className="text-terre-fonce font-semibold" role="alert">{erreur}</p>}
            <button type="submit" className="bg-terre-fonce text-papier text-xl font-semibold px-9 py-4 rounded-lg hover:bg-terre-profond transition-colors">
              Publier mon besoin
            </button>
          </form>
        )}
      </Aplat>
    </div>
  )
}
