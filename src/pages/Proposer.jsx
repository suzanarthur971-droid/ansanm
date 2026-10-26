import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Aplat, champ } from '../components/Nouveau.jsx'

const DOMAINES = ['Terre', 'Alimentation', 'Matière', 'Artisanat', 'Services', 'Culture', 'Autre']
const CHECKLIST = [
  { k: 'demande_ok', q: 'Des gens l’attendent-ils ?', a: 'On ne construit pas une route vers nulle part.' },
  { k: 'referent_ok', q: 'Quelqu’un est-il prêt à le porter ?', a: 'Un projet sans référent, c’est un outil qui rouille.' },
  { k: 'emploi_ok', q: 'Crée-t-il de l’emploi ou une activité durable ?', a: 'On ne finance pas un achat, on finance un avenir.' },
]

export default function Proposer() {
  const { ajouterProposition } = useData()
  const [f, setF] = useState({ titre: '', domaine: 'Terre', description: '', emplois: '', referent: '', preuve: '', besoins: '', contact: '', porteur: '' })
  const [publique, setPublique] = useState(true)
  const [coche, setCoche] = useState({})
  const [envoye, setEnvoye] = useState(false)
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const pret = f.titre.trim() && f.description.trim() && f.contact.trim().length >= 5

  const envoyer = (e) => {
    e.preventDefault()
    if (!pret) return
    ajouterProposition({ ...f, porteur: f.porteur.trim() || null, publique, ...Object.fromEntries(CHECKLIST.map((c) => [c.k, !!coche[c.k]])) })
    setEnvoye(true)
  }

  const zone = (k, label, props = {}) => (
    <div className={props.large ? 'sm:col-span-2' : ''}>
      <label htmlFor={k} className="font-semibold">{label}</label>
      {props.rows
        ? <textarea id={k} rows={props.rows} placeholder={props.placeholder} value={f[k]} onChange={maj(k)} className={champ + ' mt-2'} />
        : <input id={k} placeholder={props.placeholder} autoComplete={props.autoComplete} value={f[k]} onChange={maj(k)} className={champ + ' mt-2'} />}
    </div>
  )

  return (
    <div>
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12 grid md:grid-cols-2 gap-8 md:gap-16 items-end">
        <h1 className="text-5xl sm:text-7xl">Tu as une idée pour la Guadeloupe ?</h1>
        <p className="text-lg leading-relaxed text-beige/90">
          Les meilleurs projets viennent de ceux qui vivent les problèmes au quotidien. Si tu as une idée qui crée de
          l'emploi et rend notre territoire plus autonome, propose-la.
        </p>
      </Aplat>

      <Aplat interieur="py-14">
        {envoye ? (
          <div className="bg-beige rounded-[22px] p-8 sm:p-12 max-w-3xl fondu" role="status">
            <p className="titre text-5xl">Merci.</p>
            <p className="mt-4 text-xl leading-relaxed">
              Ton idée « {f.titre} » sera présentée à la prochaine assemblée générale. Les adhérents décideront ensemble des
              projets qui rejoignent la Trace.
            </p>
            {publique && (
              <p className="mt-4 text-lg leading-relaxed">
                Elle est aussi visible dans les idées en germe : chacun peut dire qu'il la rechercherait, ou la rapprocher
                d'un projet existant.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              {publique && <Link to="/idees" className="font-semibold underline decoration-2 underline-offset-4">Voir les idées en germe</Link>}
              <Link to="/rendez-vous" className="font-semibold underline decoration-2 underline-offset-4">Date de la prochaine AG</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={envoyer} className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
            <fieldset className="bg-sauge text-olive-nuit rounded-[22px] p-6 sm:p-8 lg:sticky lg:top-8">
              <legend className="sr-only">Avant de commencer</legend>
              <p className="titre text-3xl">Avant de commencer</p>
              <p className="mt-3 text-lg">Pour qu'un projet arrive sur la Trace, il doit répondre « oui » à trois questions :</p>
              <div className="mt-5 space-y-4">
                {CHECKLIST.map((c) => (
                  <label key={c.k} className="flex gap-3 items-baseline cursor-pointer">
                    <input type="checkbox" checked={!!coche[c.k]} onChange={(e) => setCoche({ ...coche, [c.k]: e.target.checked })} className="accent-terre w-5 h-5 shrink-0 translate-y-[3px]" />
                    <span>
                      <span className="block text-xl font-[700] leading-snug">{c.q}</span>
                      <span className="block mt-0.5">{c.a}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-6 text-lg font-[700] leading-snug">Si tu n'as pas toutes les réponses, ton projet est encore une idée. Et Ansanm peut t'aider à en faire un projet.</p>
              <p className="mt-2 leading-relaxed">Propose-la quand même : dans les idées en germe, chacun pourra dire qu'il la rechercherait, ou la rapprocher d'un projet existant.</p>
              <Link to="/idees" className="mt-3 inline-block font-semibold underline decoration-2 underline-offset-4">Voir les idées en germe</Link>
            </fieldset>

            <div className="bg-beige rounded-[22px] p-6 sm:p-8">
              <p className="titre text-3xl">Ton projet</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                {zone('titre', 'Titre', { placeholder: 'Atelier de réparation de vélos', large: true })}
                <div>
                  <label htmlFor="domaine" className="font-semibold">Domaine</label>
                  <select id="domaine" value={f.domaine} onChange={maj('domaine')} className={champ + ' mt-2'}>
                    {DOMAINES.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                {zone('emplois', 'Emplois créés', { placeholder: '1 mécanicien·ne à mi-temps' })}
                {zone('description', 'Description', { rows: 4, placeholder: 'Ce que fait le projet, pour qui, où…', large: true })}
                {zone('referent', 'Référent·e pressenti·e', { placeholder: 'Prénom et rôle' })}
                {zone('preuve', 'Qui l’attend ?', { placeholder: '40 personnes sondées au marché' })}
                {zone('besoins', 'Besoins : argent, matériel, temps, compétences', { rows: 3, large: true })}
                {zone('contact', 'Ton e-mail ou téléphone, pour qu’on te recontacte', { autoComplete: 'email', large: true })}
              </div>
              <div className="mt-6 bg-papier rounded-xl p-5">
                <label className="flex gap-3 items-baseline cursor-pointer">
                  <input type="checkbox" checked={publique} onChange={(e) => setPublique(e.target.checked)} className="accent-terre w-5 h-5 shrink-0 translate-y-[3px]" />
                  <span>
                    <span className="font-[700]">Montrer mon idée dans les idées en germe</span>
                    <span className="block text-olive/75">Chacun pourra dire qu'il la rechercherait, et la rapprocher d'un projet existant. Ton contact reste privé.</span>
                  </span>
                </label>
                {publique && (
                  <div className="mt-4">
                    <label htmlFor="porteur" className="font-semibold">Nom affiché <span className="font-normal text-olive/70">(facultatif)</span></label>
                    <input id="porteur" value={f.porteur} onChange={maj('porteur')} placeholder="Marlène, ancienne libraire" className={champ + ' mt-2'} />
                  </div>
                )}
              </div>
              <button type="submit" disabled={!pret} className="mt-7 bg-terre-fonce text-papier text-xl font-semibold px-9 py-4 rounded-lg hover:bg-terre-profond transition-colors disabled:opacity-40 disabled:hover:bg-terre-fonce disabled:cursor-not-allowed">
                Envoyer ma proposition
              </button>
              {!pret && <p className="mt-3 text-olive/75">Il nous faut au moins un titre, une description et un moyen de te recontacter.</p>}
            </div>
          </form>
        )}
      </Aplat>
    </div>
  )
}
