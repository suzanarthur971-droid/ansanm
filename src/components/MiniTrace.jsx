import { useEffect, useMemo, useRef, useState } from 'react'
import { hash, tailleDe, teinteDe } from '../lib/paves.js'
import { PaveForme, dims } from './Trace.jsx'

const W = 360, H = 64, MARGE = 14, ECHELLE = 0.5, ECART = 3, VOIE = 8

// Une Trace horizontale et compacte : deux rangées de pavés, puis le chemin qui reste jusqu'à l'objectif
function construire(paves, progression) {
  const longueurs = [0, 0]
  const items = paves.map((c, i) => {
    const voie = i % 2
    const taille = tailleDe(c).key
    const w = dims(taille).w * ECHELLE
    const x = longueurs[voie] + w / 2
    longueurs[voie] += w + ECART
    return { c, taille, voie, x }
  })
  const rempli = Math.max(...longueurs, 10)
  const p = Math.min(1, Math.max(0.08, progression))
  const total = p >= 1 ? rempli + 10 : Math.max(rempli + 40, rempli / p)
  const k = Math.min(1, (W - 2 * MARGE - 10) / total)
  const yDe = (x) => H / 2 + 5 * Math.sin(x / 55)
  const chemin = (de, a) => {
    const pts = []
    for (let x = de; x <= a; x += 4) pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(1)} ${yDe(x).toFixed(1)}`)
    return pts.join('')
  }
  const fin = MARGE + total * k
  return {
    k,
    fin,
    yFin: yDe(fin),
    cheminTotal: chemin(MARGE, fin),
    cheminRempli: chemin(MARGE, MARGE + rempli * k),
    places: items.map((it) => {
      const x = MARGE + it.x * k
      return { ...it, x, y: yDe(x) + (it.voie ? VOIE : -VOIE) * k, rot: (hash(it.c.id + 'r') - 0.5) * 24 }
    }),
  }
}

export default function MiniTrace({ paves, progression }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const t = useMemo(() => construire(paves, progression), [paves, progression])

  useEffect(() => {
    const el = ref.current
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className={`w-full block ${visible ? 'mini-visible' : ''}`} aria-hidden="true">
      <path d={t.cheminTotal} stroke="#EADFCA" strokeWidth={34 * t.k} strokeLinecap="round" fill="none" />
      <path d={t.cheminRempli} stroke="#DCCBA8" strokeWidth={34 * t.k} strokeLinecap="round" fill="none" />
      {t.places.map(({ c, taille, x, y, rot }, i) => (
        <g key={c.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(ECHELLE * t.k).toFixed(3)})`}>
          <g className="mini-pave" style={{ animationDelay: `${i * 35}ms` }}>
            <PaveForme type={c.type} taille={taille} teinte={teinteDe(c)} />
          </g>
        </g>
      ))}
      <circle cx={t.fin} cy={t.yFin} r="4" fill="#F5F0E6" stroke="#4E5C4B" strokeWidth="1.2" />
    </svg>
  )
}
