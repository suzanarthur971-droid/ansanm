import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { hash, tailleDe, teinteDe } from '../lib/paves.js'
import { PaveForme, dims } from './Trace.jsx'

// Grands aplats de la palette, pleine largeur
const APLATS = {
  olive: 'bg-olive text-beige',
  beige: 'bg-beige text-olive',
  papier: 'bg-papier text-olive',
  sauge: 'bg-sauge text-olive-nuit',
  brique: 'bg-terre-profond text-papier',
}

export function Aplat({ couleur = 'papier', className = '', interieur = '', children, ...rest }) {
  return (
    <section className={`${APLATS[couleur]} ${className}`} {...rest}>
      <div className={`max-w-6xl mx-auto px-5 sm:px-8 ${interieur}`}>{children}</div>
    </section>
  )
}

export function Action({ to, children, sombre = false, discret = false, className = '', ...rest }) {
  const style = discret
    ? 'underline decoration-2 underline-offset-4 hover:decoration-terre'
    : sombre
      ? 'bg-beige text-olive-nuit hover:bg-papier px-6 py-3.5 rounded-lg'
      : 'bg-terre-fonce text-papier hover:bg-terre-profond px-6 py-3.5 rounded-lg'
  const cls = `inline-flex items-center justify-center font-semibold text-[17px] transition-colors ${style} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}

// Une pierre de gué : forme irrégulière pour les étapes d'une vraie séquence
const FORMES = ['58% 42% 47% 53% / 46% 55% 45% 54%', '45% 55% 60% 40% / 55% 42% 58% 45%', '52% 48% 40% 60% / 40% 58% 42% 60%']
export function Pierre({ n, couleur, className = '' }) {
  return (
    <span
      className={`grid place-items-center shrink-0 font-[750] ${className}`}
      style={{ background: couleur, borderRadius: FORMES[(n - 1) % FORMES.length], fontVariationSettings: '"opsz" 96, "wdth" 82' }}
      aria-hidden="true"
    >
      {n}
    </span>
  )
}

// La grande Trace du bandeau d'accueil, faite des vrais derniers pavés :
// elle part du bas à gauche et monte vers le haut à droite, encore à construire.
export function TraceHero({ paves }) {
  const t = useMemo(() => {
    const W = 1200, H = 720
    const yDe = (x) => H - 40 - x * 0.5 + 34 * Math.sin(x / 130)
    const pts = []
    for (let x = -60; x <= W + 60; x += 6) pts.push([x, yDe(x)])
    const chemin = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y.toFixed(1)}`).join('')
    const choisis = [...paves].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-34)
    const longueurs = [40, 62]
    const places = choisis.map((c, i) => {
      const voie = i % 2
      const taille = tailleDe(c).key
      const w = dims(taille).w * 1.15
      const x = longueurs[voie] + w / 2
      longueurs[voie] += (w + 9) / 1.12
      const pente = Math.atan2(yDe(x + 1) - yDe(x - 1), 2)
      const decal = voie ? 17 : -17
      return {
        c, taille,
        x: x - Math.sin(pente) * decal,
        y: yDe(x) + Math.cos(pente) * decal,
        rot: (pente * 180) / Math.PI + (hash(c.id + 'h') - 0.5) * 20,
      }
    })
    return { chemin, places, W, H }
  }, [paves])

  return (
    <svg viewBox={`0 0 ${t.W} ${t.H}`} preserveAspectRatio="xMinYMax slice" className="w-full h-full block" aria-hidden="true">
      <path d={t.chemin} stroke="#56654F" strokeWidth="86" strokeLinecap="round" fill="none" />
      {t.places.map(({ c, taille, x, y, rot }, i) => (
        <g key={c.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(1.15)`}>
          <g className="hero-pave" style={{ animationDelay: `${250 + i * 55}ms` }}>
            <PaveForme type={c.type} taille={taille} teinte={c.type === 'competences' ? '#E8DCC4' : teinteDe(c)} />
          </g>
        </g>
      ))}
    </svg>
  )
}
