import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import projects from '../data/projects.json'
import needs from '../data/needs.json'
import demoContributions from '../data/contributions.json'
import members from '../data/members.json'
import events from '../data/events.json'
import site from '../data/site.json'

import { chargerPaves, enregistrer, enregistrerPave, supabase } from './supabase.js'

// Avec Supabase configuré, les promesses, adhésions et propositions y sont enregistrées
// et la Trace affiche les pavés de tout le monde. Sinon, tout reste dans le navigateur.
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
  const [local, setLocal] = useState(() =>
    supabase ? { contributions: [], adhesions: [], propositions: [] } : { contributions: [], adhesions: [], propositions: [], ...lire() },
  )
  const [distants, setDistants] = useState([])

  useEffect(() => {
    if (!supabase) return
    chargerPaves()
      .then(setDistants)
      .catch((e) => console.warn('Supabase : lecture de la Trace impossible', e))
  }, [])

  const maj = (champ, item) =>
    setLocal((prev) => {
      const next = { ...prev, [champ]: [...prev[champ], item] }
      if (!supabase) ecrire(next)
      return next
    })

  const value = useMemo(() => {
    const vus = new Set(distants.map((c) => c.id))
    const contributions = [...demoContributions, ...distants, ...local.contributions.filter((c) => !vus.has(c.id))]
    return {
      projects,
      needs,
      members,
      events,
      contributions,
      adhesions: local.adhesions,
      ajouterContribution: (c) => {
        const id = crypto.randomUUID()
        const pave = { ...c, id, date: new Date().toISOString().slice(0, 10) }
        maj('contributions', pave)
        if (supabase) enregistrerPave(pave).catch((e) => console.warn('Supabase : pavé non enregistré', e))
        return id
      },
      ajouterAdhesion: (a) => {
        maj('adhesions', a)
        if (supabase) enregistrer('adhesions', a).catch((e) => console.warn('Supabase : adhésion non enregistrée', e))
      },
      ajouterProposition: (p) => {
        maj('propositions', p)
        if (supabase) enregistrer('propositions', p).catch((e) => console.warn('Supabase : proposition non enregistrée', e))
      },
      stats: {
        totalPromis: contributions.filter((c) => c.type === 'argent').reduce((s, c) => s + c.montant, 0),
        paves: contributions.length,
        projets: projects.length,
        membres: site.membres_particuliers + members.length + local.adhesions.length,
      },
    }
  }, [local, distants])

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
