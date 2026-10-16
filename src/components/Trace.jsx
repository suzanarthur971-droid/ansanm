import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TAILLES, TYPES, euros, hash, tailleDe, teinteDe, PROFILS, resumeContribution, dateLongue } from '../lib/paves.js'
import Icone from './Icones.jsx'

const S = Object.fromEntries(TAILLES.map((t) => [t.key, t.s]))
const ICONE_TYPE = { argent: 'argent', materiel: 'materiel', temps: 'temps', competences: 'competences' }
const ICONE_DOMAINE = { Terre: 'feuille', Alimentation: 'marmite', Matière: 'boucle' }

// Dimensions d'un pavé : largeur le long du chemin, hauteur en travers
function dims(taille) {
  const s = S[taille]
  if (taille === 'galet') return { w: s * 1.24, h: s * 0.88 }
  if (taille === 'pave') return { w: s, h: s * 0.92 }
  if (taille === 'grand') return { w: s * 1.22, h: s * 0.96 }
  return { w: s * 1.38, h: s * 1.02 }
}

export function PaveForme({ type, taille, teinte, avecIcone = true }) {
  const couleur = teinte || TYPES[type].couleur
  const { w, h } = dims(taille)
  const forme = (props) =>
    taille === 'galet'
      ? <ellipse rx={w / 2} ry={h / 2} {...props} />
      : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={taille === 'pave' ? 4 : 5.5} {...props} />
  const icone = avecIcone && type !== 'argent' && taille !== 'galet'
  const ti = Math.min(w, h) * 0.56
  return (
    <>
      <g transform="translate(1.5 2.5)">{forme({ fill: '#2A1E17', fillOpacity: 0.22 })}</g>
      {forme({ fill: couleur, stroke: '#2A1E17', strokeOpacity: 0.18, strokeWidth: 1 })}
      <ellipse cx={-w * 0.16} cy={-h * 0.22} rx={w * 0.26} ry={h * 0.12} fill="white" fillOpacity="0.22" />
      {icone && (
        <Icone nom={ICONE_TYPE[type]} x={-ti / 2} y={-ti / 2} width={ti} height={ti} className="" style={{ color: 'white' }} strokeWidth={2.4} />
      )}
    </>
  )
}

// Construit le sentier sinueux et la position de chaque pavé le long de celui-ci
function construire(paves, progression) {
  const W = 360, A = 92, P = 400, Y0 = 70, DEBUT = 26, ECART = 7
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
    const decal = (hash(it.c.id) - 0.5) * 12
    return {
      ...it,
      x: pt.x - Math.sin(pt.angle) * decal,
      y: pt.y + Math.cos(pt.angle) * decal,
      rot: (pt.angle * 180) / Math.PI + (hash(it.c.id + 'r') - 0.5) * 22,
    }
  })
  k = 0
  const prochain = pointA(Math.min(lRemplie + 18, lTotale - 1))
  const fin = pts[pts.length - 1]
  const versChemin = (liste) => liste.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join('')

  // Végétation de part et d'autre du sentier
  const plantes = []
  for (let y = Y0 + 30; y < fin.y - 20; y += 46) {
    const xc = xDe(y)
    const cote = xc > W / 2 ? -1 : 1
    const r = hash('pl' + y)
    const x = Math.min(W - 16, Math.max(16, xc + cote * (62 + r * 70)))
    plantes.push({ x, y: y + (r - 0.5) * 20, r, sorte: r < 0.18 ? 'fleur' : 'feuilles' })
  }

  return {
    W,
    H: fin.y + 120,
    places,
    plantes,
    prochain,
    fin,
    cheminTotal: versChemin(pts),
    cheminRempli: versChemin(pts.filter((q) => q.l <= lRemplie)),
    cheminAVenir: versChemin(pts.filter((q) => q.l >= lRemplie - 2)),
    atteint: progression >= 1,
  }
}

function Plante({ x, y, r, sorte }) {
  if (sorte === 'fleur') {
    const c = r < 0.09 ? '#E4405F' : '#F5B315'
    return (
      <g transform={`translate(${x} ${y})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} rx="3.6" ry="6.5" cy="-5" fill={c} transform={`rotate(${a})`} />
        ))}
        <circle r="2.6" fill="#7A2E17" />
      </g>
    )
  }
  const verts = ['#3D7A3A', '#5E9A4A', '#2E6430', '#7FAE5C']
  return (
    <g transform={`translate(${x} ${y}) rotate(${(r - 0.5) * 50}) scale(${0.8 + r * 0.6})`}>
      {[-38, 0, 38].map((a, i) => (
        <path key={a} d="M0 0 C -6 -8, -5 -20, 0 -26 C 5 -20, 6 -8, 0 0Z" fill={verts[(i + Math.floor(r * 4)) % 4]} transform={`rotate(${a})`} />
      ))}
    </g>
  )
}

export default function Trace({ projet, paves, progression, nouveauId, onChoisir }) {
  const navigate = useNavigate()
  const t = useMemo(() => construire(paves, progression), [paves, progression])

  useEffect(() => {
    if (!nouveauId) return
    const el = document.getElementById('pave-' + nouveauId)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [nouveauId])

  return (
    <svg viewBox={`0 0 ${t.W} ${t.H}`} className="w-full max-w-[420px] mx-auto block select-none" role="group" aria-label={`Trace du projet ${projet.titre} : ${paves.length} pavés posés`}>
      {/* sol */}
      <path d={t.cheminTotal} stroke="#EADBC0" strokeWidth="62" strokeLinecap="round" fill="none" />
      <path d={t.cheminRempli} stroke="#DCC49A" strokeWidth="50" strokeLinecap="round" fill="none" />
      <path d={t.cheminAVenir} stroke="#B89B6E" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" fill="none" />

      {t.plantes.map((p, i) => <Plante key={i} {...p} />)}

      {/* départ */}
      <g transform={`translate(${t.W / 2} 34)`}>
        <text textAnchor="middle" fontSize="12" fontWeight="700" fill="#7A2E17" letterSpacing="2">DÉPART</text>
      </g>

      {t.places.map(({ c, taille, x, y, rot }) => {
        const estNouveau = c.id === nouveauId
        return (
          <g key={c.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}>
            {estNouveau && (
              <>
                <circle className="pave-onde" r="6" fill="none" stroke="#F5B315" strokeWidth="3" />
                <circle className="pave-lueur" r={S[taille] * 0.95} fill="#F5B315" />
              </>
            )}
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

      {/* le prochain pavé, à poser */}
      {!t.atteint && (
        <g
          transform={`translate(${t.prochain.x} ${t.prochain.y})`}
          className="pave"
          role="link"
          tabIndex={0}
          aria-label="Poser le prochain pavé"
          onClick={() => navigate(`/contribuer?projet=${projet.id}`)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/contribuer?projet=${projet.id}`)}
        >
          <rect x="-13" y="-12" width="26" height="24" rx="5" fill="#FBF6EC" stroke="#B84A26" strokeWidth="2" strokeDasharray="4 3" />
          <path d="M0 -6v12M-6 0h12" stroke="#B84A26" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* objectif */}
      <g transform={`translate(${t.fin.x} ${t.fin.y + 34})`}>
        <circle r="32" fill={t.atteint ? projet.couleur : '#FBF6EC'} stroke={projet.couleur} strokeWidth="2.5" strokeDasharray={t.atteint ? undefined : '5 5'} />
        <Icone nom={ICONE_DOMAINE[projet.domaine] || 'feuille'} x="-15" y="-15" width="30" height="30" className="" style={{ color: t.atteint ? 'white' : projet.couleur }} />
        <text y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7A2E17" letterSpacing="1.5">OBJECTIF {euros(projet.objectif_montant).toUpperCase()}</text>
        <text y="68" textAnchor="middle" fontSize="11.5" fill="#6B5A4C">{projet.emplois_crees}</text>
      </g>
    </svg>
  )
}

export function Legende() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-semibold mb-2">Taille selon le don</p>
        <ul className="space-y-1.5">
          {TAILLES.map((t) => (
            <li key={t.key} className="flex items-center gap-3">
              <svg viewBox="-24 -20 48 40" className="w-10 h-8 shrink-0" aria-hidden="true"><PaveForme type="argent" taille={t.key} /></svg>
              <span><strong>{t.label}</strong> <span className="text-encre-doux">— {t.regle}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-semibold mb-2">Couleur selon le type</p>
        <ul className="space-y-1.5">
          {Object.entries(TYPES).map(([k, v]) => (
            <li key={k} className="flex items-center gap-3">
              <svg viewBox="-24 -20 48 40" className="w-10 h-8 shrink-0" aria-hidden="true"><PaveForme type={k} taille="grand" /></svg>
              <span><strong>{v.label}</strong></span>
            </li>
          ))}
        </ul>
      </div>
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
      <div className="absolute inset-0 bg-encre/50 fondu" onClick={onFermer} />
      <div className="relative w-full sm:max-w-md bg-sable-clair rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 feuille-monte sm:fondu shadow-xl">
        <button onClick={onFermer} className="absolute right-4 top-4 p-2" aria-label="Fermer">
          <Icone nom="fermer" className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <svg viewBox="-28 -24 56 48" className="w-16 h-14 shrink-0" aria-hidden="true">
            <PaveForme type={pave.type} taille={taille.key} teinte={teinteDe(pave)} />
          </svg>
          <div>
            <p className="font-display text-xl font-bold leading-tight">{nom}</p>
            <p className="text-sm text-encre-doux">{PROFILS[pave.profil]} · {taille.label}</p>
          </div>
        </div>
        <p className="mt-5 text-lg">
          <span className="font-semibold" style={{ color: TYPES[pave.type].couleur }}>{TYPES[pave.type].label}</span>
          {' — '}
          <span className="font-semibold">{resumeContribution(pave)}</span>
          <span className="text-encre-doux"> au projet </span>
          <span className="font-semibold">{projet.titre}</span>
        </p>
        {pave.motivation && (
          <blockquote className="mt-4 border-l-4 pl-4 font-display text-lg italic text-terre-fonce" style={{ borderColor: TYPES[pave.type].couleur }}>
            « {pave.motivation} »
          </blockquote>
        )}
        <p className="mt-5 text-xs text-encre-doux">Posé le {dateLongue(pave.date)}</p>
      </div>
    </div>
  )
}
