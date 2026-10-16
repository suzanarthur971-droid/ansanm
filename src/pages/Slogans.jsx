import { useEffect, useState } from 'react'
import { chargerSlogans, proposerSlogan, supabase, voterSlogan } from '../lib/supabase.js'
import { EnTete, champ } from '../components/Elements.jsx'

const CLE_VOTES = 'ansanm-votes-v1'
const MAX = 60

// Sans Supabase, la page affiche ces slogans de démonstration
const DEMO = [
  ['Sé on min ka lavé lòt', 'Une main lave l’autre'],
  ['Ansanm nou pli fò', 'Ensemble, nous sommes plus forts'],
  ['Men nan men', 'Main dans la main'],
  ['Yonn pou lòt', 'L’un pour l’autre'],
  ['Chak moun ni on bagay a pòté', 'Chaque personne a quelque chose à apporter'],
  ['Sé ansanm nou ka vansé', 'C’est ensemble que nous avançons'],
  ['On sèl dwèt pa ka manjé kalalou', 'Un seul doigt ne peut pas manger le calalou'],
].map(([texte, traduction], i) => ({ id: 'demo-' + i, texte, traduction, votes: 0 }))

function lireVotes() {
  try {
    return new Set(JSON.parse(localStorage.getItem(CLE_VOTES)) || [])
  } catch {
    return new Set()
  }
}

function garderVotes(set) {
  try {
    localStorage.setItem(CLE_VOTES, JSON.stringify([...set]))
  } catch {
    // stockage indisponible : le vote compte quand même
  }
}

const trier = (liste) => [...liste].sort((a, b) => b.votes - a.votes || a.texte.localeCompare(b.texte))

export default function Slogans() {
  const [slogans, setSlogans] = useState(supabase ? [] : DEMO)
  const [charge, setCharge] = useState(!supabase)
  const [votes, setVotes] = useState(lireVotes)
  const [texte, setTexte] = useState('')
  const [message, setMessage] = useState('')
  const [accord, setAccord] = useState(false)
  const [erreurChargement, setErreurChargement] = useState(false)

  useEffect(() => {
    if (!supabase) return
    chargerSlogans()
      .then((d) => setSlogans(d))
      .catch((e) => {
        console.warn('Supabase : slogans indisponibles', e)
        setErreurChargement(true)
        setSlogans(DEMO)
      })
      .finally(() => setCharge(true))
  }, [])

  const voter = (id) => {
    if (votes.has(id)) return
    const next = new Set(votes).add(id)
    setVotes(next)
    garderVotes(next)
    setSlogans((l) => l.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s)))
    if (supabase && !id.startsWith('demo-')) voterSlogan(id).catch((e) => console.warn('Supabase : vote non enregistré', e))
  }

  const proposer = (e) => {
    e.preventDefault()
    const t = texte.trim()
    if (t.length < 3) return setMessage('Ta phrase doit faire au moins 3 caractères.')
    if (!accord) return setMessage('Coche la case pour accepter que ta phrase soit utilisée par Ansanm.')
    if (slogans.some((s) => s.texte.toLowerCase() === t.toLowerCase())) return setMessage('Ce slogan est déjà proposé : vote pour lui !')
    const id = crypto.randomUUID()
    setSlogans((l) => [...l, { id, texte: t, votes: 0 }])
    setTexte('')
    setAccord(false)
    setMessage('Merci ! Ta phrase est en lice.')
    if (supabase) proposerSlogan(id, t).catch((err) => console.warn('Supabase : slogan non enregistré', err))
  }

  const classement = trier(slogans)
  const max = Math.max(1, ...classement.map((s) => s.votes))

  return (
    <div className="max-w-2xl mx-auto px-5 pt-14">
      <EnTete titre="Écris la phrase que la Guadeloupe portera">
        <p>Au dos : ANSANM. Devant : ta phrase.</p>
        <p className="mt-4">
          Propose un slogan, vote pour tes préférés. Le gagnant sera mis en forme par un graphiste local et imprimé en
          précommande. La marge de chaque t-shirt va dans la cagnotte des projets.
        </p>
      </EnTete>

      <figure className="mt-10 -mx-5 sm:mx-0">
        <img src="/tshirt-ansanm.jpg" alt="T-shirt blanc Ansanm, vu de face et de dos avec le logo imprimé dans le dos" className="w-full" width="1400" height="933" />
        <figcaption className="mt-2 px-5 sm:px-0 text-sm text-gris">Maquette : le logo au dos, la phrase gagnante devant.</figcaption>
      </figure>

      <form onSubmit={proposer} className="mt-10 pt-8 border-t border-ligne">
        <label htmlFor="slogan" className="font-display text-xl">Ta phrase</label>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            id="slogan"
            value={texte}
            maxLength={MAX}
            onChange={(e) => { setTexte(e.target.value); setMessage('') }}
            placeholder="Ta phrase pour le devant du t-shirt"
            className={champ + ' flex-1'}
            autoComplete="off"
          />
        </div>
        <p className="mt-1 text-xs text-gris text-right">{texte.length}/{MAX}</p>
        <label className="mt-3 flex gap-3 items-baseline cursor-pointer">
          <input type="checkbox" checked={accord} onChange={(e) => { setAccord(e.target.checked); setMessage('') }} className="accent-terre translate-y-[1px]" />
          <span>J'accepte que ma proposition soit utilisée par l'association Ansanm.</span>
        </label>
        <button type="submit" className="mt-4 bg-encre text-papier px-6 py-3 rounded-[3px] hover:bg-terre-fonce transition-colors">
          Proposer mon slogan
        </button>
        <p className="mt-3 text-sm text-gris min-h-5" aria-live="polite">{message}</p>
      </form>

      <h2 className="mt-14 text-2xl sm:text-3xl">Le classement</h2>
      {erreurChargement && <p className="mt-3 text-sm text-terre-fonce">Oups, une pierre a glissé. Réessaie dans un instant.</p>}
      {!charge ? (
        <p className="mt-6 text-gris">On pose les pavés…</p>
      ) : classement.length === 0 ? (
        <p className="mt-6 text-gris">Rien ici pour le moment. La route commence toujours par un premier pas.</p>
      ) : (
        <ol className="mt-6 border-t border-ligne">
          {classement.map((s, i) => {
            const vote = votes.has(s.id)
            return (
              <li key={s.id} className="py-4 border-b border-ligne">
                <div className="flex items-baseline gap-4">
                  <span className="w-6 shrink-0 text-gris tabular-nums">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="font-display text-xl leading-snug">{s.texte}</p>
                    {s.traduction && <p className="text-sm text-gris italic mt-0.5">{s.traduction}</p>}
                  </div>
                  <button
                    onClick={() => voter(s.id)}
                    disabled={vote}
                    aria-label={vote ? `Tu as voté pour « ${s.texte} »` : `Voter pour « ${s.texte} »`}
                    className={`shrink-0 text-sm px-3 py-1.5 rounded-[3px] border transition-colors ${vote ? 'border-terre text-terre-fonce' : 'border-ligne hover:border-encre'}`}
                  >
                    {vote ? 'Voté' : 'Voter'}
                  </button>
                </div>
                <div className="mt-2 ml-10 flex items-center gap-3">
                  <div className="h-[3px] flex-1 bg-ligne">
                    <div className="h-full bg-terre transition-all" style={{ width: `${(s.votes / max) * 100}%` }} />
                  </div>
                  <span className="text-sm text-gris tabular-nums w-16 text-right">{s.votes} vote{s.votes > 1 ? 's' : ''}</span>
                </div>
              </li>
            )
          })}
        </ol>
      )}
      <p className="mt-6 text-sm text-gris">Un vote par slogan. Tu peux voter pour autant de slogans que tu veux.</p>
    </div>
  )
}
