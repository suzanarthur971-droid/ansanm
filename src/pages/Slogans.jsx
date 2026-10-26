import { useEffect, useState } from 'react'
import { chargerSlogans, proposerSlogan, supabase, voterSlogan } from '../lib/supabase.js'
import { Aplat } from '../components/Nouveau.jsx'

const champ = 'w-full bg-white/70 border-2 border-beige rounded-lg px-4 py-3 text-xl focus:outline-none focus:border-olive'

const CLE_VOTES = 'ansanm-votes-v1'
const MAX = 60

// Sans Supabase, la page affiche ces slogans de démonstration
const DEMO = [
  ['Sé on min ka lavé lòt', 'Une main lave l’autre'],
  ['Ansanm nou pli fò', 'Ensemble, nous sommes plus forts'],
  ['Yonn pou lòt', 'L’un pour l’autre'],
  ['Chak moun ni on biten a pòté', 'Chaque personne a quelque chose à apporter'],
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
    <div className="nouveau">
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-14 grid md:grid-cols-[1fr_1.1fr] gap-10 items-center">
        <div>
          <h1 className="text-5xl sm:text-7xl">Écris la phrase que la Guadeloupe portera.</h1>
          <p className="mt-6 text-2xl font-semibold text-sauge">Au dos : ANSANM. Devant : ta phrase.</p>
          <p className="mt-4 text-lg leading-relaxed text-beige/85 max-w-xl">
            Propose un slogan, vote pour tes préférés. Le gagnant sera mis en forme par un graphiste local et imprimé en
            précommande. La marge de chaque t-shirt va dans la cagnotte des projets.
          </p>
        </div>
        <img src="/tshirt-ansanm.jpg" alt="T-shirt blanc Ansanm, vu de face et de dos avec le logo imprimé dans le dos" className="w-full rounded-[22px]" width="1400" height="933" />
      </Aplat>

      <Aplat interieur="py-16 grid md:grid-cols-[1fr_1.4fr] gap-14 items-start">
        <form onSubmit={proposer} className="bg-beige rounded-[22px] p-6 sm:p-8 md:sticky md:top-8">
          <label htmlFor="slogan" className="block text-3xl font-[760] tracking-tight" style={{ fontVariationSettings: '"opsz" 96, "wdth" 82' }}>Ta phrase</label>
          <input
            id="slogan"
            value={texte}
            maxLength={MAX}
            onChange={(e) => { setTexte(e.target.value); setMessage('') }}
            placeholder="Pour le devant du t-shirt"
            className={champ + ' mt-4'}
            autoComplete="off"
          />
          <p className="mt-1 text-sm text-olive/70 text-right">{texte.length}/{MAX}</p>
          <label className="mt-2 flex gap-3 items-baseline cursor-pointer">
            <input type="checkbox" checked={accord} onChange={(e) => { setAccord(e.target.checked); setMessage('') }} className="accent-terre translate-y-[1px] w-5 h-5 shrink-0" />
            <span>J'accepte que ma proposition soit utilisée par l'association Ansanm.</span>
          </label>
          <button type="submit" className="mt-5 w-full bg-terre-fonce text-papier text-lg font-semibold px-6 py-3.5 rounded-lg hover:bg-terre-profond transition-colors">
            Proposer mon slogan
          </button>
          <p className="mt-3 min-h-6" aria-live="polite">{message}</p>
        </form>

        <div>
          <h2 className="text-4xl sm:text-5xl">Le classement</h2>
          {erreurChargement && <p className="mt-3 text-terre-fonce">Oups, une pierre a glissé. Réessaie dans un instant.</p>}
          {!charge ? (
            <p className="mt-6 text-lg">On pose les pavés…</p>
          ) : classement.length === 0 ? (
            <p className="mt-6 text-lg">Rien ici pour le moment. La route commence toujours par un premier pas.</p>
          ) : (
            <ol className="mt-8 space-y-6">
              {classement.map((s) => {
                const vote = votes.has(s.id)
                return (
                  <li key={s.id} className="flex items-start gap-5">
                    <div className="flex-1 min-w-0">
                      <p className="text-3xl sm:text-4xl font-[760] tracking-tight leading-none" lang="gcf" style={{ fontVariationSettings: '"opsz" 96, "wdth" 82' }}>{s.texte}</p>
                      {s.traduction && <p className="mt-2 text-lg text-olive/75">{s.traduction}</p>}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-2.5 flex-1 rounded-full bg-beige overflow-hidden">
                          <div className="h-full rounded-full bg-terre transition-all" style={{ width: `${(s.votes / max) * 100}%` }} />
                        </div>
                        <span className="text-olive/75 tabular-nums w-20 text-right">{s.votes} vote{s.votes > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => voter(s.id)}
                      disabled={vote}
                      aria-label={vote ? `Tu as voté pour « ${s.texte} »` : `Voter pour « ${s.texte} »`}
                      className={`shrink-0 font-semibold px-5 py-2.5 rounded-lg transition-colors ${vote ? 'bg-sauge text-olive-nuit' : 'bg-olive text-beige hover:bg-olive-nuit'}`}
                    >
                      {vote ? 'Voté' : 'Voter'}
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
          <p className="mt-10 text-olive/75">Un vote par slogan. Tu peux voter pour autant de slogans que tu veux.</p>
        </div>
      </Aplat>
    </div>
  )
}
