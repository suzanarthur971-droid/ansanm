import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import projects from '../data/projects.json'
import needs from '../data/needs.json'
import demoContributions from '../data/contributions.json'
import members from '../data/members.json'
import events from '../data/events.json'
import site from '../data/site.json'
import demoBesoinsPros from '../data/besoins-pros.json'
import reponsesPros from '../data/reponses-pros.json'
import partenaires from '../data/partenaires.json'

import { chargerBesoinsPros, chargerPaves, enregistrer, enregistrerPave, supabase } from './supabase.js'

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
    supabase ? { contributions: [], adhesions: [], propositions: [], interets: [] } : { contributions: [], adhesions: [], propositions: [], interets: [], ...lire() },
  )
  const [distants, setDistants] = useState([])
  const [besoinsDistants, setBesoinsDistants] = useState([])

  useEffect(() => {
    if (!supabase) return
    chargerPaves()
      .then(setDistants)
      .catch((e) => console.warn('Supabase : lecture de la Trace impossible', e))
    chargerBesoinsPros()
      .then(setBesoinsDistants)
      .catch((e) => console.warn('Supabase : lecture des besoins des pros impossible', e))
  }, [])

  const maj = (champ, item) =>
    setLocal((prev) => {
      const next = { ...prev, [champ]: [...(prev[champ] || []), item] }
      if (!supabase) ecrire(next)
      return next
    })

  const value = useMemo(() => {
    const vus = new Set(distants.map((c) => c.id))
    const contributions = [...demoContributions, ...distants, ...local.contributions.filter((c) => !vus.has(c.id))]
    const besoinsVus = new Set(besoinsDistants.map((b) => b.id))
    const besoinsPros = [...demoBesoinsPros, ...besoinsDistants, ...(local.besoinsPros || []).filter((b) => !besoinsVus.has(b.id))]
    return {
      projects,
      needs,
      members,
      events,
      contributions,
      adhesions: local.adhesions,
      besoinsPros,
      reponsesPros,
      partenaires: partenaires.filter((p) => p.visible),
      ajouterBesoinPro: (b) => {
        const id = crypto.randomUUID()
        const { contact, ...publique } = b
        maj('besoinsPros', { ...publique, id, statut: 'ouvert', date: new Date().toISOString().slice(0, 10) })
        if (supabase) enregistrer('besoins_pros', { ...b, id }).catch((e) => console.warn('Supabase : besoin non enregistré', e))
        return id
      },
      ajouterReponsePro: (r) => {
        maj('reponsesEnvoyees', r)
        if (supabase) enregistrer('reponses_besoins', r).catch((e) => console.warn('Supabase : réponse non enregistrée', e))
      },
      demanderDiagnostic: (d) => {
        maj('diagnostics', d)
        if (supabase) enregistrer('demandes_diagnostic', d).catch((e) => console.warn('Supabase : demande non enregistrée', e))
      },
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
      ajouterInteret: (i) => {
        maj('interets', i)
        if (supabase) enregistrer('interets', i).catch((e) => console.warn('Supabase : intérêt non enregistré', e))
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
  }, [local, distants, besoinsDistants])

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
