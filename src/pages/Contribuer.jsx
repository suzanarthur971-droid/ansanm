import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { PROFILS, TYPES, euros, tailleDeMontant } from '../lib/paves.js'
import { PaveForme } from '../components/Trace.jsx'
import { EnTete } from '../components/Elements.jsx'
import Icone from '../components/Icones.jsx'

const MONTANTS = [5, 10, 20, 50, 100, 200]
const EXEMPLES = {
  materiel: 'Ex. : un lot de bocaux, une brouette, des chutes de tissu…',
  temps: 'Ex. : 2 heures par semaine pour les ateliers…',
  competences: 'Ex. : photos, comptabilité, menuiserie, formation…',
}

function Etape({ n, titre, children }) {
  return (
    <fieldset className="bg-white rounded-3xl p-5 sm:p-6 ring-1 ring-sable-fonce/60">
      <legend className="sr-only">{titre}</legend>
      <p className="flex items-center gap-3 font-display text-lg font-bold" aria-hidden="true">
        <span className="w-7 h-7 rounded-full bg-terre text-white text-sm grid place-items-center font-sans">{n}</span>
        {titre}
      </p>
      <div className="mt-4">{children}</div>
    </fieldset>
  )
}

const champ = 'w-full rounded-2xl bg-sable-clair ring-1 ring-sable-fonce px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-terre'

export default function Contribuer() {
  const { projects, needs, ajouterContribution } = useData()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [f, setF] = useState({
    project_id: projects.some((p) => p.id === params.get('projet')) ? params.get('projet') : projects[0].id,
    type: 'argent',
    montant: 20,
    description: '',
    need_id: '',
    motivation: '',
    nom: '',
    profil: 'particulier',
    afficher: true,
    tenirInforme: false,
    email: '',
  })
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const montant = Number(f.montant) || 0
  const taille = f.type === 'argent' ? tailleDeMontant(montant) : tailleDeMontant(30)
  const besoins = needs.filter((n) => n.project_id === f.project_id && n.type === f.type && n.statut === 'ouvert')
  const projet = projects.find((p) => p.id === f.project_id)

  const envoyer = (e) => {
    e.preventDefault()
    if (f.type === 'argent' && montant < 1) return setErreur('Indique un montant d’au moins 1 €.')
    if (f.type !== 'argent' && f.description.trim().length < 3) return setErreur('Décris en quelques mots ce que tu proposes.')
    if (f.afficher && !f.nom.trim()) return setErreur('Indique le nom à afficher, ou décoche l’affichage pour rester anonyme.')
    setErreur('')
    const id = ajouterContribution({
      project_id: f.project_id,
      need_id: f.need_id || besoins[0]?.id || null,
      type: f.type,
      montant: f.type === 'argent' ? montant : undefined,
      description: f.type === 'argent' ? undefined : f.description.trim(),
      valeur_estimee: f.type === 'argent' ? undefined : 30,
      motivation: f.afficher ? f.motivation.trim() : '',
      nom_affiche: f.afficher ? f.nom.trim() : 'Anonyme',
      profil: f.profil,
      anonyme: !f.afficher,
      consentement_contact: f.tenirInforme,
      email: f.tenirInforme ? f.email.trim() : undefined,
    })
    navigate(`/projets/${f.project_id}?nouveau=${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      <EnTete surtitre="Poser mon pavé" titre="Chacun contribue comme il peut.">
        De l'argent, du matériel, du temps ou des compétences : toute contribution compte et devient un pavé sur la Trace.
      </EnTete>
      <p className="mt-4 text-sm bg-mangue/15 text-terre-fonce rounded-2xl px-4 py-3">
        Version bêta : ta contribution est enregistrée comme une <strong>promesse</strong>. Aucun paiement n'est demandé.
      </p>

      <form onSubmit={envoyer} className="mt-6 space-y-4" noValidate>
        <Etape n="1" titre="Quel projet ?">
          <div className="grid gap-2 sm:grid-cols-3">
            {projects.map((p) => (
              <label key={p.id} className={`cursor-pointer rounded-2xl p-4 ring-2 transition ${f.project_id === p.id ? 'bg-sable-clair' : 'ring-sable-fonce/60 hover:ring-sable-fonce'}`} style={f.project_id === p.id ? { '--tw-ring-color': p.couleur } : undefined}>
                <input type="radio" name="projet" value={p.id} checked={f.project_id === p.id} onChange={maj('project_id')} className="sr-only" />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: p.couleur }}>{p.domaine}</span>
                <span className="block font-display font-bold text-lg leading-tight mt-0.5">{p.titre}</span>
              </label>
            ))}
          </div>
        </Etape>

        <Etape n="2" titre="Que veux-tu apporter ?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(TYPES).map(([k, t]) => (
              <label key={k} className={`cursor-pointer rounded-2xl p-3 flex flex-col items-center gap-1.5 ring-2 transition ${f.type === k ? 'text-white ring-transparent' : 'ring-sable-fonce/60'}`} style={f.type === k ? { background: t.couleur } : undefined}>
                <input type="radio" name="type" value={k} checked={f.type === k} onChange={(e) => setF({ ...f, type: e.target.value, need_id: '' })} className="sr-only" />
                <Icone nom={k} className="w-6 h-6" style={f.type === k ? undefined : { color: t.couleur }} />
                <span className="font-semibold text-sm">{t.label}</span>
              </label>
            ))}
          </div>

          {f.type === 'argent' ? (
            <div className="mt-5">
              <label htmlFor="montant" className="font-medium">Montant de ta promesse</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {MONTANTS.map((m) => (
                  <button type="button" key={m} onClick={() => setF({ ...f, montant: m })} className={`px-4 py-2 rounded-full text-sm font-semibold ring-1 ${montant === m ? 'bg-terre text-white ring-terre' : 'ring-sable-fonce bg-sable-clair'}`}>
                    {m} €
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative w-40">
                  <input id="montant" type="number" inputMode="numeric" min="1" value={f.montant} onChange={maj('montant')} className={champ + ' pr-10'} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-encre-doux">€</span>
                </div>
                <div className="flex items-center gap-2" aria-live="polite">
                  <svg viewBox="-26 -22 52 44" className="w-12 h-10" aria-hidden="true">
                    <PaveForme type="argent" taille={taille.key} />
                  </svg>
                  <span className="text-sm">Ce sera un <strong>{taille.label.toLowerCase()}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="description" className="font-medium">Décris ta contribution</label>
                <textarea id="description" rows="2" value={f.description} onChange={maj('description')} placeholder={EXEMPLES[f.type]} className={champ + ' mt-2'} />
              </div>
              {besoins.length > 0 && (
                <div>
                  <label htmlFor="besoin" className="font-medium">Elle répond à quel besoin ? <span className="text-encre-doux font-normal">(facultatif)</span></label>
                  <select id="besoin" value={f.need_id} onChange={maj('need_id')} className={champ + ' mt-2'}>
                    <option value="">— Autre / je ne sais pas</option>
                    {besoins.map((b) => <option key={b.id} value={b.id}>{b.libelle}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
        </Etape>

        <Etape n="3" titre="Qui pose ce pavé ?">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Profil">
            {Object.entries(PROFILS).map(([k, label]) => (
              <label key={k} className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold ring-1 ${f.profil === k ? 'bg-encre text-sable ring-encre' : 'ring-sable-fonce bg-sable-clair'}`}>
                <input type="radio" name="profil" value={k} checked={f.profil === k} onChange={maj('profil')} className="sr-only" />
                {label}
              </label>
            ))}
          </div>

          <label className="mt-5 flex gap-3 items-start cursor-pointer">
            <input type="checkbox" checked={f.afficher} onChange={maj('afficher')} className="mt-1 w-5 h-5 accent-terre shrink-0" />
            <span>Afficher mon nom et ma motivation sur la Trace <span className="text-encre-doux">(sinon, ton pavé sera anonyme)</span></span>
          </label>

          {f.afficher && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="nom" className="font-medium">Nom affiché</label>
                <input id="nom" value={f.nom} onChange={maj('nom')} placeholder={f.profil === 'particulier' ? 'Ex. : Arthur S., coach' : 'Nom de la structure'} className={champ + ' mt-2'} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="motivation" className="font-medium">Ta motivation, en une phrase <span className="text-encre-doux font-normal">(facultatif)</span></label>
                <textarea id="motivation" rows="2" maxLength={140} value={f.motivation} onChange={maj('motivation')} placeholder="Pourquoi ce projet te tient à cœur ?" className={champ + ' mt-2'} />
                <p className="text-xs text-encre-doux text-right mt-1">{f.motivation.length}/140</p>
              </div>
            </div>
          )}

          <label className="mt-4 flex gap-3 items-start cursor-pointer">
            <input type="checkbox" checked={f.tenirInforme} onChange={maj('tenirInforme')} className="mt-1 w-5 h-5 accent-terre shrink-0" />
            <span>Me tenir informé·e des projets similaires</span>
          </label>
          {f.tenirInforme && (
            <div className="mt-3">
              <label htmlFor="email" className="sr-only">Adresse e-mail</label>
              <input id="email" type="email" value={f.email} onChange={maj('email')} placeholder="ton@email.fr" className={champ} autoComplete="email" />
            </div>
          )}
        </Etape>

        {erreur && <p className="text-terre-fonce bg-terre/10 rounded-2xl px-4 py-3 font-medium" role="alert">{erreur}</p>}

        <div className="sticky bottom-20 md:bottom-4 z-10">
          <button type="submit" className="w-full rounded-full bg-terre text-white font-semibold text-lg py-4 shadow-lg shadow-terre/30 hover:bg-terre-fonce transition">
            Poser mon pavé
            {f.type === 'argent' && montant > 0 && <span className="opacity-80"> · {euros(montant)}</span>}
            <span className="sr-only"> sur le projet {projet.titre}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
