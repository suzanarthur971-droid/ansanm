import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { EnTete, Groupe, champ } from '../components/Elements.jsx'

const DOMAINES = ['Terre', 'Alimentation', 'Matière', 'Artisanat', 'Services', 'Culture', 'Autre']
const CHECKLIST = [
  { k: 'demande_ok', q: 'Des gens l’attendent-ils ?', a: 'On ne construit pas une route vers nulle part.' },
  { k: 'referent_ok', q: 'Quelqu’un est-il prêt à le porter ?', a: 'Un projet sans référent, c’est un outil qui rouille.' },
  { k: 'emploi_ok', q: 'Crée-t-il de l’emploi ou une activité durable ?', a: 'On ne finance pas un achat, on finance un avenir.' },
]

export default function Proposer() {
  const { ajouterProposition } = useData()
  const [f, setF] = useState({ titre: '', domaine: 'Terre', description: '', emplois: '', referent: '', preuve: '', besoins: '', contact: '' })
  const [coche, setCoche] = useState({})
  const [envoye, setEnvoye] = useState(false)
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const pret = f.titre.trim() && f.description.trim() && f.contact.trim().length >= 5

  const envoyer = (e) => {
    e.preventDefault()
    if (!pret) return
    ajouterProposition({ ...f, ...Object.fromEntries(CHECKLIST.map((c) => [c.k, !!coche[c.k]])) })
    setEnvoye(true)
  }

  if (envoye) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-20 fondu" role="status">
        <h1 className="text-4xl">Merci.</h1>
        <p className="mt-4 text-lg text-gris leading-relaxed">
          Ton idée « {f.titre} » sera présentée à la prochaine assemblée générale. Les adhérents décideront ensemble des
          projets qui rejoignent la Trace.
        </p>
        <Link to="/rendez-vous" className="mt-6 inline-block underline hover:text-terre-fonce">Date de la prochaine AG</Link>
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
      <EnTete titre="Tu as une idée pour la Guadeloupe ?">
        Les meilleurs projets viennent de ceux qui vivent les problèmes au quotidien. Si tu as une idée qui crée de
        l'emploi et rend notre territoire plus autonome, propose-la.
      </EnTete>

      <form onSubmit={envoyer} className="mt-10">
        <Groupe titre="Avant de commencer">
          <p className="text-gris mb-4">Pour qu'un projet arrive sur la Trace, il doit répondre « oui » à trois questions :</p>
          <div className="space-y-4">
            {CHECKLIST.map((c) => (
              <label key={c.k} className="flex gap-3 items-baseline cursor-pointer">
                <input type="checkbox" checked={!!coche[c.k]} onChange={(e) => setCoche({ ...coche, [c.k]: e.target.checked })} className="accent-terre translate-y-[1px]" />
                <span><span className="text-encre">{c.q}</span> <span className="text-gris">{c.a}</span></span>
              </label>
            ))}
          </div>
          <p className="mt-5 text-sm text-gris">Si tu n'as pas encore toutes les réponses, ce n'est pas grave : propose quand même, on t'aidera à les trouver.</p>
        </Groupe>

        <Groupe titre="Ton projet">
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
            {zone('preuve', 'Qui l’attend ?', { placeholder: '40 personnes sondées au marché' })}
            {zone('besoins', 'Besoins : argent, matériel, temps, compétences', { rows: 3 })}
            {zone('contact', 'Ton e-mail ou téléphone, pour qu’on te recontacte', { autoComplete: 'email' })}
          </div>
        </Groupe>

        <div className="pt-8 border-t border-ligne">
          <button type="submit" disabled={!pret} className="bg-encre text-papier px-8 py-3.5 rounded-[3px] hover:bg-terre-fonce transition-colors disabled:opacity-30 disabled:hover:bg-encre disabled:cursor-not-allowed">
            Envoyer ma proposition
          </button>
          {!pret && <p className="mt-3 text-sm text-gris">Il nous faut au moins un titre, une description et un moyen de te recontacter.</p>}
        </div>
      </form>
    </div>
  )
}
