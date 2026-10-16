import { useEffect, useState } from 'react'
import { chargerSlogans, proposerSlogan, supabase, voterSlogan } from '../lib/supabase.js'
import { EnTete, champ } from '../components/Elements.jsx'

const CLE_VOTES = 'ansanm-votes-v1'
const MAX = 60

// Sans Supabase, la page affiche ces slogans de démonstration
const DEMO = [
  ['Pavé par pavé.', 34],
  ['Un pavé, c’est déjà un chemin.', 27],
  ['Je pose mon pavé.', 21],
  ['Ici, on plante l’avenir.', 18],
  ['Fait ici, pour ici.', 12],
  ['Ensemble, on va plus loin.', 9],
].map(([texte, votes], i) => ({ id: 'demo-' + i, texte, votes }))

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

  useEffect(() => {
    if (!supabase) return
    chargerSlogans()
      .then((d) => setSlogans(d))
      .catch((e) => {
        console.warn('Supabase : slogans indisponibles', e)
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
    if (t.length < 3) return setMessage('Ton slogan doit faire au moins 3 caractères.')
    if (slogans.some((s) => s.texte.toLowerCase() === t.toLowerCase())) return setMessage('Ce slogan est déjà proposé : vote pour lui !')
    const id = crypto.randomUUID()
    setSlogans((l) => [...l, { id, texte: t, votes: 0 }])
    setTexte('')
    setMessage('Merci ! Ton slogan est en lice.')
    if (supabase) proposerSlogan(id, t).catch((err) => console.warn('Supabase : slogan non enregistré', err))
  }

  const classement = trier(slogans)
  const max = Math.max(1, ...classement.map((s) => s.votes))

  return (
    <div className="max-w-2xl mx-auto px-5 pt-14">
      <EnTete titre="Nos t-shirts">
        Nous choisissons ensemble le slogan de nos futurs t-shirts. Propose le tien et vote pour tes préférés :
        toute la marge des t-shirts rejoint la cagnotte des projets.
      </EnTete>

      <figure className="mt-10 -mx-5 sm:mx-0">
        <img src="/tshirt-ansanm.jpg" alt="T-shirt blanc Ansanm, vu de face et de dos avec le logo imprimé dans le dos" className="w-full" width="1400" height="933" />
        <figcaption className="mt-2 px-5 sm:px-0 text-sm text-gris">Maquette : le slogan gagnant viendra compléter ce t-shirt.</figcaption>
      </figure>

      <form onSubmit={proposer} className="mt-10 pt-8 border-t border-ligne">
        <label htmlFor="slogan" className="font-display text-xl">Proposer un slogan</label>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            id="slogan"
            value={texte}
            maxLength={MAX}
            onChange={(e) => { setTexte(e.target.value); setMessage('') }}
            placeholder="Ton idée de slogan"
            className={champ + ' flex-1'}
            autoComplete="off"
          />
          <button type="submit" className="bg-encre text-papier px-6 py-2.5 rounded-[3px] hover:bg-terre transition-colors">
            Proposer
          </button>
        </div>
        <p className="mt-2 text-sm text-gris flex justify-between gap-4" aria-live="polite">
          <span>{message}</span>
          <span>{texte.length}/{MAX}</span>
        </p>
      </form>

      <h2 className="mt-14 text-2xl sm:text-3xl">Le classement</h2>
      {!charge ? (
        <p className="mt-6 text-gris">Chargement…</p>
      ) : (
        <ol className="mt-6 border-t border-ligne">
          {classement.map((s, i) => {
            const vote = votes.has(s.id)
            return (
              <li key={s.id} className="py-4 border-b border-ligne">
                <div className="flex items-baseline gap-4">
                  <span className="w-6 shrink-0 text-gris tabular-nums">{i + 1}.</span>
                  <p className="flex-1 font-display text-xl leading-snug">{s.texte}</p>
                  <button
                    onClick={() => voter(s.id)}
                    disabled={vote}
                    aria-label={vote ? `Tu as voté pour « ${s.texte} »` : `Voter pour « ${s.texte} »`}
                    className={`shrink-0 text-sm px-3 py-1.5 rounded-[3px] border transition-colors ${vote ? 'border-terre text-terre' : 'border-ligne hover:border-encre'}`}
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
