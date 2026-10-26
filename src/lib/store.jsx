import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import projetsBruts from '../data/projects.json'
import needs from '../data/needs.json'
import pavesExemple from '../data/contributions.json'
import membresExemple from '../data/members.json'
import rdvExemple from '../data/events.json'
import site from '../data/site.json'
import besoinsExemple from '../data/besoins-pros.json'
import reponsesPros from '../data/reponses-pros.json'
import partenaires from '../data/partenaires.json'
import ideesExemple from '../data/idees.json'
import lieux from '../data/lieux.json'
import koudmenExemple from '../data/koudmen.json'

import { chargerBesoinsPros, chargerIdees, chargerInscritsKoudmen, chargerPaves, enregistrer, enregistrerPave, lierIdee, supabase, voterIdee } from './supabase.js'

// Avec Supabase configuré, les promesses, adhésions et propositions y sont enregistrées
// et la Trace affiche les pavés de tout le monde. Sinon, tout reste dans le navigateur.
const CLE = 'ansanm-beta-v1'

// Tout ce qui vient des fichiers de démonstration est marqué « exemple » pour l'affichage.
// Seuls les besoins publiés au nom d'Ansanm (b-ansanm-…) sont réels.
const exemple = (liste) => liste.map((x) => ({ ...x, exemple: true }))
const projects = exemple(projetsBruts)
const demoContributions = exemple(pavesExemple)
const members = exemple(membresExemple)
const events = exemple(rdvExemple)
const demoBesoinsPros = besoinsExemple.map((b) => (b.id.startsWith('b-ansanm') ? b : { ...b, exemple: true }))
const demoIdees = exemple(ideesExemple)

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
  const [ideesDistantes, setIdeesDistantes] = useState([])
  const [inscritsDistants, setInscritsDistants] = useState({})
  const [inscritsAjouts, setInscritsAjouts] = useState({})
  // Ajouts de cette visite sur les idées (votes et rapprochements), pour un affichage immédiat
  const [ideesAjouts, setIdeesAjouts] = useState({ votes: {}, liens: [] })

  useEffect(() => {
    if (!supabase) return
    chargerPaves()
      .then(setDistants)
      .catch((e) => console.warn('Supabase : lecture de la Trace impossible', e))
    chargerBesoinsPros()
      .then(setBesoinsDistants)
      .catch((e) => console.warn('Supabase : lecture des besoins des pros impossible', e))
    chargerIdees()
      .then(setIdeesDistantes)
      .catch((e) => console.warn('Supabase : lecture des idées impossible', e))
    chargerInscritsKoudmen()
      .then(setInscritsDistants)
      .catch((e) => console.warn('Supabase : lecture des koudmen impossible', e))
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
    const ideesVues = new Set(ideesDistantes.map((i) => i.id))
    const idees = [
      ...demoIdees.map(({ votes_depart, ...i }) => ({ ...i, votes: votes_depart })),
      ...ideesDistantes,
      ...(local.propositions || []).filter((p) => p.publique && !ideesVues.has(p.id))
        .map((p) => ({ id: p.id, titre: p.titre, domaine: p.domaine, description: p.description, porteur: p.porteur, date: p.date, votes: 0, rapprochements: [] })),
    ].map((i) => ({
      ...i,
      votes: i.votes + (ideesAjouts.votes[i.id] || 0),
      rapprochements: [...i.rapprochements, ...ideesAjouts.liens.filter((l) => l.proposition_id === i.id)],
    }))
    const koudmen = koudmenExemple.map(({ inscrits_depart, ...k }) => ({
      ...k,
      exemple: true,
      lieu: lieux.find((l) => l.id === k.lieu_id),
      inscrits: inscrits_depart + (inscritsDistants[k.id] || 0) + (inscritsAjouts[k.id] || 0),
    }))
    return {
      projects,
      lieux: exemple(lieux),
      koudmen,
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
      inscrireKoudmen: ({ koudmen, prenom, contact, afficher }) => {
        setInscritsAjouts((a) => ({ ...a, [koudmen.id]: (a[koudmen.id] || 0) + 1 }))
        if (supabase) enregistrer('koudmen_inscriptions', { koudmen_id: koudmen.id, prenom, contact }).catch((e) => console.warn('Supabase : inscription non enregistrée', e))
      },
      ajouterAvis: (a) => {
        maj('avis', a)
        if (supabase) enregistrer('avis', a).catch((e) => console.warn('Supabase : avis non enregistré', e))
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
        const id = crypto.randomUUID()
        maj('propositions', { ...p, id, date: new Date().toISOString().slice(0, 10) })
        if (supabase) enregistrer('propositions', { ...p, id }).catch((e) => console.warn('Supabase : proposition non enregistrée', e))
        return id
      },
      idees,
      voterPourIdee: (id) => {
        setIdeesAjouts((a) => ({ ...a, votes: { ...a.votes, [id]: (a.votes[id] || 0) + 1 } }))
        if (supabase && !id.startsWith('i-')) voterIdee(id).catch((e) => console.warn('Supabase : vote non enregistré', e))
      },
      rapprocherIdee: (lien) => {
        setIdeesAjouts((a) => ({ ...a, liens: [...a.liens, lien] }))
        if (supabase && !lien.proposition_id.startsWith('i-')) lierIdee(lien).catch((e) => console.warn('Supabase : rapprochement non enregistré', e))
      },
      stats: {
        totalPromis: contributions.filter((c) => c.type === 'argent').reduce((s, c) => s + c.montant, 0),
        paves: contributions.length,
        projets: projects.length,
        membres: site.membres_particuliers + members.length + local.adhesions.length,
      },
    }
  }, [local, distants, besoinsDistants, ideesDistantes, ideesAjouts, inscritsDistants, inscritsAjouts])

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
