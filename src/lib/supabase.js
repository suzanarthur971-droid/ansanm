import { createClient } from '@supabase/supabase-js'

// URL et clé publique du projet (publiques par conception : la sécurité repose sur les règles RLS des tables).
// Sans elles, le site garde les promesses dans le navigateur du visiteur.
const url = import.meta.env.VITE_SUPABASE_URL
const cle = import.meta.env.VITE_SUPABASE_KEY

export const supabase = url && cle ? createClient(url, cle, { auth: { persistSession: false } }) : null

const COLONNES_PAVE = 'id, created_at, project_id, need_id, type, montant, description, valeur_estimee, motivation, nom_affiche, profil, anonyme'

export async function chargerPaves() {
  const { data, error } = await supabase.from('paves').select(COLONNES_PAVE).order('created_at')
  if (error) throw error
  return data.map(({ created_at, ...c }) => ({ ...c, date: created_at.slice(0, 10) }))
}

export async function enregistrerPave({ email, date, nouveau, ...pave }) {
  const { error } = await supabase.from('paves').insert(pave)
  if (error) throw error
  if (pave.consentement_contact && email) {
    const { error: e2 } = await supabase.from('contacts').insert({ pave_id: pave.id, email })
    if (e2) throw e2
  }
}

export async function enregistrer(table, ligne) {
  const { error } = await supabase.from(table).insert(ligne)
  if (error) throw error
}

export async function chargerSlogans() {
  const { data, error } = await supabase.from('slogans_classement').select('id, texte, traduction, votes, created_at')
  if (error) throw error
  return data
}

export async function proposerSlogan(id, texte) {
  const { error } = await supabase.from('slogans').insert({ id, texte })
  if (error) throw error
}

export async function voterSlogan(slogan_id) {
  const { error } = await supabase.from('votes').insert({ slogan_id })
  if (error) throw error
}
