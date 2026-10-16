import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TAILLES, TYPES, euros, hash, tailleDe, teinteDe, PROFILS, resumeContribution, dateLongue } from '../lib/paves.js'

const S = Object.fromEntries(TAILLES.map((t) => [t.key, t.s]))

// Dimensions d'un pavé : largeur le long du chemin, hauteur en travers
function dims(taille) {
  const s = S[taille]
  if (taille === 'galet') return { w: s * 1.24, h: s * 0.88 }
  if (taille === 'pave') return { w: s, h: s * 0.92 }
  if (taille === 'grand') return { w: s * 1.22, h: s * 0.96 }
  return { w: s * 1.38, h: s * 1.02 }
}

export function PaveForme({ type, taille, teinte }) {
  const couleur = teinte || TYPES[type].couleur
  const { w, h } = dims(taille)
  return taille === 'galet'
    ? <ellipse rx={w / 2} ry={h / 2} fill={couleur} />
    : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={taille === 'pave' ? 2.5 : 3.5} fill={couleur} />
}

// Construit le sentier sinueux et la position de chaque pavé le long de celui-ci
function construire(paves, progression) {
  const W = 360, A = 92, P = 400, Y0 = 60, DEBUT = 24, ECART = 7
  const items = paves.map((c) => {
    const t = tailleDe(c).key
    return { c, taille: t, long: dims(t).w + ECART }
  })
  const lRemplie = DEBUT + items.reduce((s, it) => s + it.long, 0)
  const p = Math.min(1, Math.max(0.08, progression))
  const lTotale = p >= 1 ? lRemplie + 30 : lRemplie + Math.min(1100, Math.max(140, (lRemplie * (1 - p)) / p))

  const xDe = (y) => W / 2 + A * Math.sin(((y - Y0) / P) * Math.PI * 2)
  const pts = [{ x: xDe(Y0), y: Y0, l: 0 }]
  for (let y = Y0 + 2; pts[pts.length - 1].l < lTotale; y += 2) {
    const prev = pts[pts.length - 1]
    const x = xDe(y)
    pts.push({ x, y, l: prev.l + Math.hypot(x - prev.x, y - prev.y) })
  }

  let k = 0
  const pointA = (l) => {
    while (k < pts.length - 2 && pts[k + 1].l < l) k++
    const a = pts[k], b = pts[k + 1]
    const f = (l - a.l) / (b.l - a.l || 1)
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, angle: Math.atan2(b.y - a.y, b.x - a.x) }
  }

  let l = DEBUT
  const places = items.map((it) => {
    const centre = l + it.long / 2
    l += it.long
    const pt = pointA(centre)
    const decal = (hash(it.c.id) - 0.5) * 10
    return {
      ...it,
      x: pt.x - Math.sin(pt.angle) * decal,
      y: pt.y + Math.cos(pt.angle) * decal,
      rot: (pt.angle * 180) / Math.PI + (hash(it.c.id + 'r') - 0.5) * 18,
    }
  })
  k = 0
  const prochain = pointA(Math.min(lRemplie + 16, lTotale - 1))
  const fin = pts[pts.length - 1]
  const versChemin = (liste) => liste.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join('')

  return {
    W,
    H: fin.y + 90,
    places,
    prochain,
    fin,
    cheminTotal: versChemin(pts),
    cheminRempli: versChemin(pts.filter((q) => q.l <= lRemplie)),
    atteint: progression >= 1,
  }
}

export default function Trace({ projet, paves, progression, nouveauId, onChoisir }) {
  const navigate = useNavigate()
  const t = useMemo(() => construire(paves, progression), [paves, progression])

  useEffect(() => {
    if (!nouveauId) return
    document.getElementById('pave-' + nouveauId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [nouveauId])

  const poser = () => navigate(`/contribuer?projet=${projet.id}`)

  return (
    <svg viewBox={`0 0 ${t.W} ${t.H}`} className="w-full max-w-[400px] mx-auto block select-none" role="group" aria-label={`Trace du projet ${projet.titre} : ${paves.length} pavés posés`}>
      <path d={t.cheminTotal} stroke="#EADFCA" strokeWidth="54" strokeLinecap="round" fill="none" />
      <path d={t.cheminRempli} stroke="#DCCBA8" strokeWidth="54" strokeLinecap="round" fill="none" />

      <text x={t.W / 2} y="24" textAnchor="middle" fontSize="12" fill="#5F6A5B">départ</text>

      {t.places.map(({ c, taille, x, y, rot }) => {
        const estNouveau = c.id === nouveauId
        return (
          <g key={c.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}>
            {estNouveau && <circle className="pave-onde" r="8" fill="none" stroke="#4E5C4B" strokeWidth="1.5" />}
            <g className={estNouveau ? 'pave-pose' : undefined}>
              <g
                id={'pave-' + c.id}
                className="pave"
                role="button"
                tabIndex={0}
                aria-label={`${c.anonyme ? 'Anonyme' : c.nom_affiche}, ${TYPES[c.type].label} : ${resumeContribution(c)}`}
                onClick={() => onChoisir(c)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onChoisir(c))}
              >
                <PaveForme type={c.type} taille={taille} teinte={teinteDe(c)} />
              </g>
            </g>
          </g>
        )
      })}

      {!t.atteint && (
        <g
          transform={`translate(${t.prochain.x} ${t.prochain.y})`}
          className="pave"
          role="link"
          tabIndex={0}
          aria-label="Poser le prochain pavé"
          onClick={poser}
          onKeyDown={(e) => e.key === 'Enter' && poser()}
        >
          <rect x="-11" y="-10" width="22" height="20" rx="2.5" fill="none" stroke="#4E5C4B" strokeWidth="1.2" strokeDasharray="3 3" />
        </g>
      )}

      <g transform={`translate(${t.fin.x} ${t.fin.y + 26})`}>
        <circle r="5" fill={t.atteint ? '#C57B57' : 'none'} stroke="#4E5C4B" strokeWidth="1.2" />
        <text y="28" textAnchor="middle" fontSize="13" fill="#4E5C4B" fontFamily="Source Serif 4, Georgia, serif">Objectif {euros(projet.objectif_montant)}</text>
        <text y="46" textAnchor="middle" fontSize="12" fill="#5F6A5B">{projet.emplois_crees}</text>
      </g>
    </svg>
  )
}

export function Legende() {
  return (
    <div className="text-sm text-gris space-y-4">
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {TAILLES.map((t) => (
          <li key={t.key} className="flex items-center gap-2">
            <svg viewBox="-24 -20 48 40" className="w-7 h-6 shrink-0" aria-hidden="true"><PaveForme type="argent" taille={t.key} /></svg>
            <span><span className="text-encre">{t.label}</span> {t.regle}</span>
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {Object.entries(TYPES).map(([k, v]) => (
          <li key={k} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[2px]" style={{ background: v.couleur }} aria-hidden="true" />
            <span className="text-encre">{v.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FichePave({ pave, projet, onFermer }) {
  useEffect(() => {
    const echap = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', echap)
    return () => window.removeEventListener('keydown', echap)
  }, [onFermer])
  if (!pave) return null
  const taille = tailleDe(pave)
  const nom = pave.anonyme ? 'Anonyme' : pave.nom_affiche
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={`Pavé de ${nom}`}>
      <div className="absolute inset-0 bg-encre/30 fondu" onClick={onFermer} />
      <div className="relative w-full sm:max-w-md bg-papier p-6 pb-10 sm:pb-6 fondu border-t sm:border border-ligne">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-2xl leading-tight">{nom}</p>
            <p className="text-sm text-gris mt-1">{PROFILS[pave.profil]} · {taille.label.toLowerCase()}</p>
          </div>
          <button onClick={onFermer} className="text-sm text-gris hover:text-encre py-1">Fermer</button>
        </div>
        <p className="mt-5">
          {TYPES[pave.type].label} — {resumeContribution(pave)}, au projet {projet.titre}.
        </p>
        {pave.motivation && (
          <p className="mt-4 font-display text-xl leading-snug">« {pave.motivation} »</p>
        )}
        <p className="mt-5 text-xs text-gris">Posé le {dateLongue(pave.date)}</p>
      </div>
    </div>
  )
}
