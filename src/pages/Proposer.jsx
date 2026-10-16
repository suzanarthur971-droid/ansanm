import { useState } from 'react'
import { useData } from '../lib/store.jsx'
import { Bouton, EnTete } from '../components/Elements.jsx'
import Icone from '../components/Icones.jsx'

const DOMAINES = ['Terre', 'Alimentation', 'Matière', 'Artisanat', 'Services', 'Culture', 'Autre']
const CHECKLIST = [
  { k: 'demande', label: 'La demande est identifiée : des utilisateurs ou des clients attendent ce projet.' },
  { k: 'referent', label: 'Un·e référent·e est trouvé·e pour porter et guider le projet.' },
  { k: 'emploi', label: 'Le projet crée de l’emploi ou une activité durable, pas juste un achat.' },
]

const champ = 'w-full rounded-2xl bg-sable-clair ring-1 ring-sable-fonce px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-terre'

export default function Proposer() {
  const { ajouterProposition } = useData()
  const [f, setF] = useState({ titre: '', domaine: 'Terre', description: '', emplois: '', referent: '', preuve: '', besoins: '' })
  const [coche, setCoche] = useState({})
  const [envoye, setEnvoye] = useState(false)
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const pret = CHECKLIST.every((c) => coche[c.k]) && f.titre.trim() && f.description.trim()

  const envoyer = (e) => {
    e.preventDefault()
    if (!pret) return
    ajouterProposition(f)
    setEnvoye(true)
  }

  if (envoye) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-16 text-center fondu" role="status">
        <span className="mx-auto w-14 h-14 rounded-full bg-feuille text-white grid place-items-center"><Icone nom="check" className="w-7 h-7" /></span>
        <h1 className="mt-4 text-3xl font-extrabold text-terre-fonce">Merci pour « {f.titre} » !</h1>
        <p className="mt-3 text-encre-doux">Ta proposition sera présentée à la prochaine assemblée générale. Les projets sont étudiés tous les six mois.</p>
        <Bouton to="/rendez-vous" className="mt-6">Voir la date de la prochaine AG</Bouton>
      </div>
    )
  }

  const zone = (k, label, props = {}) => (
    <div>
      <label htmlFor={k} className="font-medium">{label}</label>
      {props.rows ? <textarea id={k} value={f[k]} onChange={maj(k)} className={champ + ' mt-2'} {...props} /> : <input id={k} value={f[k]} onChange={maj(k)} className={champ + ' mt-2'} {...props} />}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      <EnTete surtitre="Proposer un projet" titre="Tu as une idée qui répond à un vrai besoin ?">
        Les projets sont étudiés en assemblée générale tous les six mois.
      </EnTete>

      <form onSubmit={envoyer} className="mt-8 space-y-4">
        <div className="bg-white rounded-3xl p-5 sm:p-6 ring-1 ring-sable-fonce/60 space-y-4">
          {zone('titre', 'Titre du projet', { placeholder: 'Ex. : Atelier de réparation de vélos' })}
          <div>
            <label htmlFor="domaine" className="font-medium">Domaine</label>
            <select id="domaine" value={f.domaine} onChange={maj('domaine')} className={champ + ' mt-2'}>
              {DOMAINES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          {zone('description', 'Description', { rows: 4, placeholder: 'Ce que fait le projet, pour qui, où…' })}
          {zone('emplois', 'Emplois créés', { placeholder: 'Ex. : 1 mécanicien·ne à mi-temps' })}
          {zone('referent', 'Référent·e pressenti·e', { placeholder: 'Prénom et rôle' })}
          {zone('preuve', 'Preuve de demande', { placeholder: 'Ex. : 40 personnes sondées au marché' })}
          {zone('besoins', 'Besoins (argent, matériel, temps, compétences)', { rows: 3 })}
        </div>

        <fieldset className="bg-feuille/10 rounded-3xl p-5 sm:p-6">
          <legend className="font-display text-lg font-bold text-feuille-fonce px-1">Avant d'envoyer, on vérifie</legend>
          <div className="space-y-3 mt-2">
            {CHECKLIST.map((c) => (
              <label key={c.k} className="flex gap-3 items-start cursor-pointer">
                <input type="checkbox" checked={!!coche[c.k]} onChange={(e) => setCoche({ ...coche, [c.k]: e.target.checked })} className="mt-1 w-5 h-5 accent-feuille shrink-0" />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Bouton type="submit" disabled={!pret} className="w-full disabled:opacity-40 disabled:cursor-not-allowed">
          Envoyer ma proposition
        </Bouton>
        {!pret && <p className="text-sm text-encre-doux text-center">Le titre, la description et les trois cases sont nécessaires.</p>}
      </form>
    </div>
  )
}
