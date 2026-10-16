import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { EnTete, Groupe, champ } from '../components/Elements.jsx'

const DOMAINES = ['Terre', 'Alimentation', 'Matière', 'Artisanat', 'Services', 'Culture', 'Autre']
const CHECKLIST = [
  { k: 'demande', label: 'La demande est identifiée : des utilisateurs ou des clients attendent ce projet.' },
  { k: 'referent', label: 'Un·e référent·e est trouvé·e pour porter et guider le projet.' },
  { k: 'emploi', label: 'Le projet crée de l’emploi ou une activité durable, pas juste un achat.' },
]

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
      <div className="max-w-2xl mx-auto px-5 pt-20 fondu" role="status">
        <h1 className="text-4xl">Merci pour « {f.titre} ».</h1>
        <p className="mt-4 text-gris">Votre proposition sera présentée à la prochaine assemblée générale. Les projets sont étudiés tous les six mois.</p>
        <Link to="/rendez-vous" className="mt-6 inline-block underline hover:text-terre">Date de la prochaine AG</Link>
      </div>
    )
  }

  const zone = (k, label, props = {}) => (
    <div>
      <label htmlFor={k} className="text-sm text-gris">{label}</label>
      {props.rows ? <textarea id={k} value={f[k]} onChange={maj(k)} className={champ + ' mt-2'} {...props} /> : <input id={k} value={f[k]} onChange={maj(k)} className={champ + ' mt-2'} {...props} />}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-5 pt-14">
      <EnTete titre="Proposer un projet">
        Vous avez une idée qui répond à un vrai besoin ? Les projets sont étudiés en assemblée générale tous les six mois.
      </EnTete>

      <form onSubmit={envoyer} className="mt-10">
        <Groupe titre="Le projet">
          <div className="space-y-5">
            {zone('titre', 'Titre', { placeholder: 'Atelier de réparation de vélos' })}
            <div>
              <label htmlFor="domaine" className="text-sm text-gris">Domaine</label>
              <select id="domaine" value={f.domaine} onChange={maj('domaine')} className={champ + ' mt-2'}>
                {DOMAINES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            {zone('description', 'Description', { rows: 4, placeholder: 'Ce que fait le projet, pour qui, où…' })}
            {zone('emplois', 'Emplois créés', { placeholder: '1 mécanicien·ne à mi-temps' })}
            {zone('referent', 'Référent·e pressenti·e', { placeholder: 'Prénom et rôle' })}
            {zone('preuve', 'Preuve de demande', { placeholder: '40 personnes sondées au marché' })}
            {zone('besoins', 'Besoins : argent, matériel, temps, compétences', { rows: 3 })}
          </div>
        </Groupe>

        <Groupe titre="Avant d'envoyer">
          <div className="space-y-3">
            {CHECKLIST.map((c) => (
              <label key={c.k} className="flex gap-3 items-baseline cursor-pointer">
                <input type="checkbox" checked={!!coche[c.k]} onChange={(e) => setCoche({ ...coche, [c.k]: e.target.checked })} className="accent-terre translate-y-[1px]" />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </Groupe>

        <div className="pt-8 border-t border-ligne">
          <button type="submit" disabled={!pret} className="bg-encre text-papier px-8 py-3.5 rounded-[3px] hover:bg-terre transition-colors disabled:opacity-30 disabled:hover:bg-encre disabled:cursor-not-allowed">
            Envoyer ma proposition
          </button>
          {!pret && <p className="mt-3 text-sm text-gris">Le titre, la description et les trois cases sont nécessaires.</p>}
        </div>
      </form>
    </div>
  )
}
