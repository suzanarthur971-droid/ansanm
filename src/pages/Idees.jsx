import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Action, Aplat, champ } from '../components/Nouveau.jsx'

const CLE_VOTES = 'ansanm-idees-votes-v1'

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

function Rapprocher({ idee, onFermer }) {
  const { projects, rapprocherIdee } = useData()
  const [projet, setProjet] = useState(projects[0].id)
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')

  const envoyer = (e) => {
    e.preventDefault()
    if (message.trim().length < 5) return setErreur('Dis en quelques mots pourquoi ça irait ensemble.')
    rapprocherIdee({ proposition_id: idee.id, project_id: projet, message: message.trim() })
    onFermer(true)
  }

  return (
    <form onSubmit={envoyer} className="mt-4 bg-papier rounded-xl p-5 space-y-4 fondu" noValidate>
      <div>
        <label htmlFor={`proj-${idee.id}`} className="font-semibold">Ça irait avec quel projet ?</label>
        <select id={`proj-${idee.id}`} value={projet} onChange={(e) => setProjet(e.target.value)} className={champ + ' mt-1'}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.titre}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`msg-${idee.id}`} className="font-semibold">Pourquoi ?</label>
        <textarea id={`msg-${idee.id}`} rows="2" maxLength={200} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Un coin lecture pour les enfants pendant les ateliers" className={champ + ' mt-1'} />
      </div>
      {erreur && <p className="text-terre-fonce font-semibold" role="alert">{erreur}</p>}
      <div className="flex items-center gap-5">
        <button type="submit" className="bg-olive text-beige font-semibold px-5 py-2.5 rounded-lg hover:bg-olive-nuit transition-colors">Proposer ce rapprochement</button>
        <button type="button" onClick={() => onFermer(false)} className="underline underline-offset-4">Annuler</button>
      </div>
    </form>
  )
}

function CarteIdee({ idee, aVote, onVoter }) {
  const { projects } = useData()
  const [rapprocher, setRapprocher] = useState(false)
  const [merci, setMerci] = useState(false)

  // Rapprochements regroupés par projet
  const parProjet = projects
    .map((p) => ({ projet: p, messages: idee.rapprochements.filter((r) => r.project_id === p.id).map((r) => r.message) }))
    .filter((g) => g.messages.length > 0)

  return (
    <li className="bg-beige rounded-[22px] p-6 sm:p-7">
      <p className="flex items-center gap-2 font-semibold text-[15px]">
        <span className="w-3.5 h-3 rounded-[3px] bg-sauge" aria-hidden="true" />
        {idee.domaine}
      </p>
      <h2 className="mt-3 text-3xl sm:text-4xl">{idee.titre}</h2>
      <p className="mt-3 text-lg leading-relaxed">{idee.description}</p>
      {idee.porteur && <p className="mt-2 text-olive/70">Proposée par {idee.porteur}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          onClick={onVoter}
          disabled={aVote}
          className={`font-semibold px-5 py-3 rounded-lg transition-colors ${aVote ? 'bg-sauge text-olive-nuit' : 'bg-terre-fonce text-papier hover:bg-terre-profond'}`}
        >
          {aVote ? 'Tu le recherches aussi' : 'Je le rechercherais'}
        </button>
        <p className="text-lg">
          <strong className="titre text-3xl align-[-3px]">{idee.votes}</strong> personne{idee.votes > 1 ? 's' : ''} le recherche{idee.votes > 1 ? 'nt' : ''}
        </p>
      </div>

      {parProjet.length > 0 && (
        <div className="mt-6 space-y-3">
          {parProjet.map(({ projet, messages }) => (
            <div key={projet.id} className="bg-papier rounded-xl p-4">
              <p>
                <span className="font-[700]">Ça irait avec </span>
                <Link to={`/projets/${projet.id}`} className="font-[700] underline underline-offset-4 hover:text-terre-fonce">{projet.titre}</Link>
                {messages.length > 1 && <span className="text-olive/70">, selon {messages.length} personnes</span>}
              </p>
              <ul className="mt-1.5 space-y-1 text-olive/85">
                {messages.map((m, i) => <li key={i}>« {m} »</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {merci && <p className="mt-4 font-semibold" role="status">Merci, ton rapprochement est ajouté.</p>}
      {rapprocher ? (
        <Rapprocher idee={idee} onFermer={(envoye) => { setRapprocher(false); setMerci(envoye) }} />
      ) : (
        <button onClick={() => { setRapprocher(true); setMerci(false) }} className="mt-5 font-semibold underline decoration-2 underline-offset-4 hover:decoration-terre">
          Ça irait avec un projet existant ?
        </button>
      )}
    </li>
  )
}

export default function Idees() {
  const { idees, voterPourIdee } = useData()
  const [tri, setTri] = useState('recherchees')
  const [votes, setVotes] = useState(lireVotes)

  const voter = (id) => {
    if (votes.has(id)) return
    const next = new Set(votes).add(id)
    setVotes(next)
    garderVotes(next)
    voterPourIdee(id)
  }

  const liste = [...idees].sort((a, b) => (tri === 'recherchees' ? b.votes - a.votes : a.date < b.date ? 1 : -1))

  return (
    <div>
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12 grid md:grid-cols-2 gap-8 md:gap-16 items-end">
        <h1 className="text-5xl sm:text-7xl">Les idées en germe</h1>
        <div>
          <p className="text-lg leading-relaxed text-beige/90">
            Une idée n'a pas besoin d'être prête pour être partagée. Ici, chacun peut dire « je le rechercherais », ou
            proposer de la rattacher à un projet qui existe déjà. C'est comme ça qu'une envie devient une demande, et
            une demande, un projet.
          </p>
          <Action to="/proposer" sombre className="mt-7">Proposer une idée</Action>
        </div>
      </Aplat>

      <Aplat interieur="py-12 grid lg:grid-cols-[1fr_340px] gap-10 items-start">
        <div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Trier les idées">
            {[['recherchees', 'Les plus recherchées'], ['recentes', 'Les plus récentes']].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTri(k)}
                aria-pressed={tri === k}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${tri === k ? 'bg-olive text-beige' : 'bg-beige hover:bg-[#E2D4B8]'}`}
              >
                {l}
              </button>
            ))}
          </div>
          {liste.length === 0 ? (
            <p className="mt-10 text-lg">Rien ici pour le moment. La route commence toujours par un premier pas.</p>
          ) : (
            <ul className="mt-8 space-y-4">
              {liste.map((i) => <CarteIdee key={i.id} idee={i} aVote={votes.has(i.id)} onVoter={() => voter(i.id)} />)}
            </ul>
          )}
        </div>

        <aside className="bg-sauge text-olive-nuit rounded-[22px] p-6 sm:p-7 lg:sticky lg:top-8">
          <h2 className="text-3xl">Comment une idée devient un projet</h2>
          <div className="mt-4 space-y-3 leading-relaxed">
            <p>
              Chaque « je le rechercherais » est une preuve de demande. Plus une idée est recherchée, plus le comité la
              regarde de près.
            </p>
            <p>
              Un rapprochement peut aussi lui ouvrir un chemin : une idée sans demande propre peut trouver sa place dans
              un projet qui, lui, est déjà attendu.
            </p>
            <p>
              Quand la demande est là et qu'un référent se présente, l'idée passe en assemblée générale.
            </p>
          </div>
          <Link to="/regles" className="mt-5 inline-block font-semibold underline decoration-2 underline-offset-4">Voir nos règles</Link>
        </aside>
      </Aplat>
    </div>
  )
}
