// Règles visuelles des pavés : taille selon la contribution, couleur selon le type.

export const TYPES = {
  argent: { label: 'Argent', couleur: '#C57B57', teintes: ['#C57B57', '#B86E4B', '#CF8A68'] },
  materiel: { label: 'Matériel', couleur: '#C9A46E', teintes: ['#C9A46E', '#BC9760'] },
  temps: { label: 'Temps', couleur: '#8FAA88', teintes: ['#8FAA88', '#A8BFA1'] },
  competences: { label: 'Compétences', couleur: '#4E5C4B', teintes: ['#4E5C4B', '#5B6A57'] },
}

export const TAILLES = [
  { key: 'galet', label: 'Galet', regle: 'moins de 10 €', min: 0, s: 15 },
  { key: 'pave', label: 'Pavé', regle: '10 à 49 €', min: 10, s: 21 },
  { key: 'grand', label: 'Grand pavé', regle: '50 à 199 €', min: 50, s: 27 },
  { key: 'dalle', label: 'Dalle', regle: '200 € et plus', min: 200, s: 33 },
]

export const PROFILS = { particulier: 'Particulier', entreprise: 'Entreprise', association: 'Association' }

// Les contributions non financières sont dimensionnées sur leur valeur estimée.
export function valeurDe(c) {
  return c.type === 'argent' ? c.montant : c.valeur_estimee ?? 30
}

export function tailleDe(c) {
  const v = valeurDe(c)
  return [...TAILLES].reverse().find((t) => v >= t.min)
}

export function tailleDeMontant(v) {
  return [...TAILLES].reverse().find((t) => v >= t.min)
}

// Petit hash stable pour varier rotation et teinte de chaque pavé.
export function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

export function teinteDe(c) {
  const t = TYPES[c.type].teintes
  return t[Math.floor(hash(c.id + 't') * t.length)]
}

export const euros = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

export const nombre = (n) => new Intl.NumberFormat('fr-FR').format(n)

export const dateLongue = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export function resumeContribution(c) {
  if (c.type === 'argent') return euros(c.montant)
  return c.description || TYPES[c.type].label
}
