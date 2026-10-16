import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { PROFILS, TYPES, euros, tailleDeMontant } from '../lib/paves.js'
import { Choix, EnTete, Groupe, champ } from '../components/Elements.jsx'

const MONTANTS = [5, 10, 20, 50, 100, 200]
const EXEMPLES = {
  materiel: 'Un lot de bocaux, une brouette, des chutes de tissu…',
  temps: 'Deux heures par semaine pour les ateliers…',
  competences: 'Photos, comptabilité, menuiserie, formation…',
}

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
  const taille = tailleDeMontant(f.type === 'argent' ? montant : 30)
  const besoins = needs.filter((n) => n.project_id === f.project_id && n.type === f.type && n.statut === 'ouvert')

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
    <div className="max-w-2xl mx-auto px-5 pt-14">
      <EnTete titre="Poser mon pavé">
        De l'argent, du matériel, du temps ou des compétences : chez nous, chacun contribue comme il peut, et chaque contribution devient un pavé sur la Trace.
      </EnTete>
      <p className="mt-6 text-sm text-gris">Pendant la bêta, ta contribution est enregistrée comme une promesse. Aucun paiement n'est demandé.</p>

      <form onSubmit={envoyer} className="mt-10" noValidate>
        <Groupe titre="Projet">
          {projects.map((p) => (
            <Choix key={p.id} name="projet" value={p.id} checked={f.project_id === p.id} onChange={maj('project_id')}>
              {p.titre} <span className="text-gris">— {p.accroche}</span>
            </Choix>
          ))}
        </Groupe>

        <Groupe titre="Ce que tu apportes">
          <div className="flex flex-wrap gap-x-6">
            {Object.entries(TYPES).map(([k, t]) => (
              <Choix key={k} name="type" value={k} checked={f.type === k} onChange={(e) => setF({ ...f, type: e.target.value, need_id: '' })}>
                {t.label}
              </Choix>
            ))}
          </div>

          {f.type === 'argent' ? (
            <div className="mt-6">
              <label htmlFor="montant" className="text-sm text-gris">Montant</label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="relative w-32">
                  <input id="montant" type="number" inputMode="numeric" min="1" value={f.montant} onChange={maj('montant')} className={champ + ' pr-8'} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gris">€</span>
                </div>
                {MONTANTS.map((m) => (
                  <button type="button" key={m} onClick={() => setF({ ...f, montant: m })} className={`px-3 py-2.5 text-sm border rounded-[3px] ${montant === m ? 'border-encre' : 'border-ligne text-gris hover:text-encre'}`}>
                    {m} €
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-gris" aria-live="polite">Ta contribution sera un <span className="text-encre">{taille.label.toLowerCase()}</span> sur la Trace.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="description" className="text-sm text-gris">Description</label>
                <textarea id="description" rows="2" value={f.description} onChange={maj('description')} placeholder={EXEMPLES[f.type]} className={champ + ' mt-2'} />
              </div>
              {besoins.length > 0 && (
                <div>
                  <label htmlFor="besoin" className="text-sm text-gris">Besoin concerné (facultatif)</label>
                  <select id="besoin" value={f.need_id} onChange={maj('need_id')} className={champ + ' mt-2'}>
                    <option value="">Autre, ou je ne sais pas</option>
                    {besoins.map((b) => <option key={b.id} value={b.id}>{b.libelle}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
        </Groupe>

        <Groupe titre="Toi">
          <div className="flex flex-wrap gap-x-6">
            {Object.entries(PROFILS).map(([k, label]) => (
              <Choix key={k} name="profil" value={k} checked={f.profil === k} onChange={maj('profil')}>{label}</Choix>
            ))}
          </div>

          <label className="mt-4 flex gap-3 items-baseline cursor-pointer">
            <input type="checkbox" checked={f.afficher} onChange={maj('afficher')} className="accent-terre translate-y-[1px]" />
            <span>Afficher mon nom et ma motivation sur la Trace <span className="text-gris">(sinon, le pavé est anonyme)</span></span>
          </label>

          {f.afficher && (
            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="nom" className="text-sm text-gris">Nom affiché</label>
                <input id="nom" value={f.nom} onChange={maj('nom')} placeholder={f.profil === 'particulier' ? 'Arthur S., coach' : 'Nom de la structure'} className={champ + ' mt-2'} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="motivation" className="text-sm text-gris">Ta motivation, en une phrase (facultatif)</label>
                <textarea id="motivation" rows="2" maxLength={140} value={f.motivation} onChange={maj('motivation')} className={champ + ' mt-2'} />
                <p className="text-xs text-gris text-right mt-1">{f.motivation.length}/140</p>
              </div>
            </div>
          )}

          <label className="mt-4 flex gap-3 items-baseline cursor-pointer">
            <input type="checkbox" checked={f.tenirInforme} onChange={maj('tenirInforme')} className="accent-terre translate-y-[1px]" />
            <span>Me tenir informé·e des projets similaires</span>
          </label>
          {f.tenirInforme && (
            <div className="mt-3">
              <label htmlFor="email" className="sr-only">Adresse e-mail</label>
              <input id="email" type="email" value={f.email} onChange={maj('email')} placeholder="Adresse e-mail" className={champ} autoComplete="email" />
            </div>
          )}
        </Groupe>

        <div className="pt-8 border-t border-ligne">
          {erreur && <p className="mb-4 text-terre-fonce" role="alert">{erreur}</p>}
          <button type="submit" className="w-full sm:w-auto bg-terre-fonce text-papier px-8 py-3.5 rounded-[3px] hover:bg-terre-profond transition-colors">
            Poser mon pavé{f.type === 'argent' && montant > 0 ? ` · ${euros(montant)}` : ''}
          </button>
        </div>
      </form>
    </div>
  )
}
