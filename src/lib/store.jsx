import { createContext, useContext, useMemo, useState } from 'react'
import projects from '../data/projects.json'
import needs from '../data/needs.json'
import demoContributions from '../data/contributions.json'
import members from '../data/members.json'
import events from '../data/events.json'
import site from '../data/site.json'

// Bêta : les promesses, adhésions et propositions sont gardées dans le navigateur.
// Plus tard, ces fonctions écriront dans Supabase.
const CLE = 'ansanm-beta-v1'

function lire() {
  try {
    return JSON.parse(localStorage.getItem(CLE)) || {}
  } catch {
    return {}
  }
}

function ecrire(data) {
  try {
    localStorage.setItem(CLE, JSON.stringify(data))
  } catch {
    // stockage indisponible (navigation privée) : la démo continue en mémoire
  }
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [local, setLocal] = useState(() => ({ contributions: [], adhesions: [], propositions: [], ...lire() }))

  const maj = (champ, item) =>
    setLocal((prev) => {
      const next = { ...prev, [champ]: [...prev[champ], item] }
      ecrire(next)
      return next
    })

  const value = useMemo(() => {
    const contributions = [...demoContributions, ...local.contributions]
    return {
      projects,
      needs,
      members,
      events,
      contributions,
      adhesions: local.adhesions,
      ajouterContribution: (c) => {
        const id = 'n' + Date.now()
        maj('contributions', { ...c, id, date: new Date().toISOString().slice(0, 10), nouveau: true })
        return id
      },
      ajouterAdhesion: (a) => maj('adhesions', { ...a, date: new Date().toISOString() }),
      ajouterProposition: (p) => maj('propositions', { ...p, date: new Date().toISOString() }),
      stats: {
        totalPromis: contributions.filter((c) => c.type === 'argent').reduce((s, c) => s + c.montant, 0),
        paves: contributions.length,
        projets: projects.length,
        membres: site.membres_particuliers + members.length + local.adhesions.length,
      },
    }
  }, [local])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  return useContext(DataContext)
}

export function useProjet(id) {
  const { projects, needs, contributions } = useData()
  return useMemo(() => {
    const projet = projects.find((p) => p.id === id)
    if (!projet) return null
    const paves = contributions.filter((c) => c.project_id === id)
    const promis = paves.filter((c) => c.type === 'argent').reduce((s, c) => s + c.montant, 0)
    return {
      projet,
      paves,
      besoins: needs.filter((n) => n.project_id === id),
      promis,
      progression: Math.min(1, promis / projet.objectif_montant),
      reste: Math.max(0, projet.objectif_montant - promis),
    }
  }, [id, projects, needs, contributions])
}
