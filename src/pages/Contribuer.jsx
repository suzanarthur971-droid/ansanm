import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { PROFILS, TYPES, euros, tailleDeMontant } from '../lib/paves.js'
import { Aplat, Pierre } from '../components/Nouveau.jsx'

const MONTANTS = [5, 10, 20, 50, 100, 200]
const EXEMPLES = {
  materiel: 'Un lot de bocaux, une brouette, des chutes de tissu…',
  temps: 'Deux heures par semaine pour les ateliers…',
  competences: 'Photos, comptabilité, menuiserie, formation…',
}

const COULEURS_PIERRES = ['#C57B57', '#A8BFA1', '#C9A46E', '#E8DCC4', '#C57B57']
const champ = 'w-full bg-white/70 border-2 border-beige rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-olive'

function Etape({ n, titre, children }) {
  return (
    <fieldset className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-x-4 sm:gap-x-6 py-8">
      <Pierre n={n} couleur={COULEURS_PIERRES[n - 1]} className="w-12 h-11 sm:w-16 sm:h-14 text-2xl sm:text-3xl text-olive-nuit" />
      <div className="min-w-0">
        <legend className="float-left w-full text-2xl sm:text-3xl font-[760] tracking-tight leading-tight mb-5 pt-1" style={{ fontVariationSettings: '"opsz" 48, "wdth" 92', letterSpacing: '-0.015em' }}>{titre}</legend>
        <div className="clear-left">{children}</div>
      </div>
    </fieldset>
  )
}

function Option({ name, value, checked, onChange, children }) {
  return (
    <label className={`flex items-baseline gap-2.5 rounded-lg px-3 sm:px-4 py-3 cursor-pointer transition-colors min-w-0 ${checked ? 'bg-olive text-beige' : 'bg-beige/70 hover:bg-beige'}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="accent-terre translate-y-[1px] shrink-0" />
      <span className="text-base sm:text-lg">{children}</span>
    </label>
  )
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
    <div className="nouveau">
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12">
        <p className="text-xl font-semibold text-sauge" lang="gcf">Chak moun ni on bagay a pòté</p>
        <p className="text-beige/70">Chaque personne a quelque chose à apporter</p>
        <h1 className="mt-6 text-6xl sm:text-8xl">Poser mon pavé</h1>
        <p className="mt-6 text-2xl leading-snug max-w-2xl text-beige/90">
          Peu importe la taille de ta pierre. Ce qui compte, c'est qu'elle soit posée.
        </p>
      </Aplat>
      <Aplat interieur="!max-w-3xl py-6">
      <form onSubmit={envoyer} noValidate>
        <Etape n={1} titre="Quel projet veux-tu soutenir ?">
          <div className="space-y-2">
          {projects.map((p) => (
            <Option key={p.id} name="projet" value={p.id} checked={f.project_id === p.id} onChange={maj('project_id')}>
              <strong className="font-[700]">{p.titre}</strong>
              <span className="block text-base opacity-80">{p.accroche}</span>
            </Option>
          ))}
          </div>
        </Etape>

        <Etape n={2} titre="Comment veux-tu contribuer ?">
          <div className="flex flex-wrap gap-2">
            {Object.entries(TYPES).map(([k, t]) => (
              <Option key={k} name="type" value={k} checked={f.type === k} onChange={(e) => setF({ ...f, type: e.target.value, need_id: '' })}>
                {t.label}
              </Option>
            ))}
          </div>
        </Etape>

        <Etape n={3} titre="Combien, ou quoi ?">
          {f.type === 'argent' ? (
            <div>
              <label htmlFor="montant" className="sr-only">Montant en euros</label>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-32">
                  <input id="montant" type="number" inputMode="numeric" min="1" value={f.montant} onChange={maj('montant')} className={champ + ' pr-8'} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-olive/75">€</span>
                </div>
                {MONTANTS.map((m) => (
                  <button type="button" key={m} onClick={() => setF({ ...f, montant: m })} className={`px-4 py-3 text-lg font-semibold rounded-lg transition-colors ${montant === m ? 'bg-olive text-beige' : 'bg-beige/70 hover:bg-beige'}`}>
                    {m} €
                  </button>
                ))}
              </div>
              <p className="mt-3 text-olive/75" aria-live="polite">Ta pierre sera {taille.key === 'dalle' ? 'une' : 'un'} <span className="text-encre">{taille.label.toLowerCase()}</span> sur la Trace.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label htmlFor="description" className="text-olive/75">Ce que tu offres</label>
                <textarea id="description" rows="2" value={f.description} onChange={maj('description')} placeholder={EXEMPLES[f.type]} className={champ + ' mt-2'} />
              </div>
              {besoins.length > 0 && (
                <div>
                  <label htmlFor="besoin" className="text-olive/75">Besoin concerné (facultatif)</label>
                  <select id="besoin" value={f.need_id} onChange={maj('need_id')} className={champ + ' mt-2'}>
                    <option value="">Autre, ou je ne sais pas</option>
                    {besoins.map((b) => <option key={b.id} value={b.id}>{b.libelle}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
        </Etape>

        <Etape n={4} titre="Pourquoi ce projet ? (facultatif)">
          <label htmlFor="motivation" className="text-olive/75">
            En une phrase, dis ce qui te touche. C'est ce qui donne envie aux autres de te suivre.
          </label>
          <textarea
            id="motivation"
            rows="2"
            maxLength={140}
            value={f.motivation}
            onChange={maj('motivation')}
            placeholder="Parce que l'alimentation est la base d'un corps sain pour un esprit sain."
            className={champ + ' mt-2'}
          />
          <p className="text-xs text-olive/75 text-right mt-1">{f.motivation.length}/140</p>
        </Etape>

        <Etape n={5} titre="Qui es-tu ?">
          <div className="flex flex-wrap gap-2">
            {Object.entries(PROFILS).map(([k, label]) => (
              <Option key={k} name="profil" value={k} checked={f.profil === k} onChange={maj('profil')}>{label}</Option>
            ))}
          </div>

          <label className="mt-4 flex gap-3 items-baseline cursor-pointer">
            <input type="checkbox" checked={f.afficher} onChange={maj('afficher')} className="accent-terre translate-y-[1px] w-5 h-5 shrink-0" />
            <span className="text-lg">Afficher mon nom et ma motivation sur la Trace <span className="text-olive/75">(sinon, ton pavé apparaîtra comme anonyme)</span></span>
          </label>

          {f.afficher && (
            <div className="mt-4">
              <label htmlFor="nom" className="text-olive/75">Nom affiché</label>
              <input id="nom" value={f.nom} onChange={maj('nom')} placeholder={f.profil === 'particulier' ? 'Arthur S., coach' : 'Nom de la structure'} className={champ + ' mt-2'} autoComplete="off" />
            </div>
          )}

          <label className="mt-4 flex gap-3 items-baseline cursor-pointer">
            <input type="checkbox" checked={f.tenirInforme} onChange={maj('tenirInforme')} className="accent-terre translate-y-[1px] w-5 h-5 shrink-0" />
            <span className="text-lg">Me prévenir quand un projet proche de mes valeurs a besoin d'aide</span>
          </label>
          {f.tenirInforme && (
            <div className="mt-3">
              <label htmlFor="email" className="sr-only">Adresse e-mail</label>
              <input id="email" type="email" value={f.email} onChange={maj('email')} placeholder="Adresse e-mail" className={champ} autoComplete="email" />
            </div>
          )}
        </Etape>

        <div className="py-8 sm:pl-[6.5rem]">
          <p className="mb-6 text-olive/75 leading-relaxed">
            Pour l'instant, Ansanm est en phase de lancement : ton pavé est une promesse. Nous te recontacterons dès que
            l'association sera officiellement créée et que les dons seront ouverts.
          </p>
          {erreur && <p className="mb-4 text-terre-fonce" role="alert">{erreur}</p>}
          <button type="submit" className="w-full sm:w-auto bg-terre-fonce text-papier text-xl font-semibold px-9 py-4 rounded-lg hover:bg-terre-profond transition-colors">
            Poser mon pavé{f.type === 'argent' && montant > 0 ? ` · ${euros(montant)}` : ''}
          </button>
        </div>
      </form>
      </Aplat>
    </div>
  )
}
