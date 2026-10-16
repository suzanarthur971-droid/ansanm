import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjet } from '../lib/store.jsx'
import { euros, nombre } from '../lib/paves.js'
import Icone from './Icones.jsx'

export function Barre({ valeur, couleur = '#B84A26', className = 'h-3' }) {
  return (
    <div className={`w-full rounded-full bg-sable-fonce/70 overflow-hidden ${className}`} role="progressbar" aria-valuenow={Math.round(valeur * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(3, valeur * 100)}%`, background: couleur }} />
    </div>
  )
}

export function Domaine({ children, couleur }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: couleur + '1A', color: couleur }}>
      {children}
    </span>
  )
}

export function CarteProjet({ id }) {
  const { projet, promis, progression, paves } = useProjet(id)
  return (
    <Link to={`/projets/${id}`} className="group block bg-white rounded-3xl p-5 shadow-sm ring-1 ring-sable-fonce/60 hover:shadow-md hover:-translate-y-0.5 transition">
      <Domaine couleur={projet.couleur}>{projet.domaine}</Domaine>
      <h3 className="mt-3 text-xl font-bold text-encre">{projet.titre}</h3>
      <p className="mt-1 text-sm text-encre-doux">{projet.accroche}</p>
      <div className="mt-5">
        <Barre valeur={progression} couleur={projet.couleur} />
        <div className="mt-2 flex justify-between text-sm">
          <span className="font-semibold">{euros(promis)} <span className="font-normal text-encre-doux">sur {euros(projet.objectif_montant)}</span></span>
          <span className="text-encre-doux">{paves.length} pavés</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-terre inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        Voir sa trace <Icone nom="fleche" className="w-4 h-4" />
      </p>
    </Link>
  )
}

// Compteur qui défile jusqu'à sa valeur quand il apparaît à l'écran
export function Compteur({ valeur, format = nombre, label }) {
  const [v, setV] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let raf
    const lancer = () => {
      const debut = performance.now()
      const pas = (t) => {
        const k = Math.min(1, (t - debut) / 1400)
        setV(Math.round(valeur * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(pas)
      }
      raf = requestAnimationFrame(pas)
    }
    if (!('IntersectionObserver' in window)) { setV(valeur); return }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { lancer(); obs.disconnect() } })
    obs.observe(el)
    return () => { obs.disconnect(); cancelAnimationFrame(raf) }
  }, [valeur])
  return (
    <div ref={ref} className="bg-white/70 rounded-2xl px-4 py-4 ring-1 ring-sable-fonce/60">
      <p className="font-display text-2xl sm:text-3xl font-extrabold text-terre-fonce tabular-nums">{format(v)}</p>
      <p className="text-xs sm:text-sm text-encre-doux mt-0.5">{label}</p>
    </div>
  )
}

// La boucle du vivant entre les projets
export function Boucle() {
  const noeud = (x, y, couleur, titre, sous) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r="44" fill={couleur} />
      <text textAnchor="middle" y="-2" fill="white" fontFamily="Fraunces, serif" fontWeight="800" fontSize="15">{titre}</text>
      <text textAnchor="middle" y="15" fill="white" fillOpacity="0.85" fontSize="10.5">{sous}</text>
    </g>
  )
  const etiquette = (x, y, texte) => (
    <text x={x} y={y} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#7A2E17">{texte}</text>
  )
  return (
    <svg viewBox="0 0 360 330" className="w-full max-w-md mx-auto" role="img" aria-label="La boucle : le jardin nourrit la cuisine, la cuisine récupère les invendus, les restes retournent en compost au jardin.">
      <defs>
        <marker id="pointe" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#7A2E17" />
        </marker>
      </defs>
      <g fill="none" stroke="#7A2E17" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#pointe)">
        <path d="M222 82 Q 300 110 290 190" />
        <path d="M228 262 Q 180 292 132 262" />
        <path d="M70 190 Q 60 110 138 82" />
        <path d="M352 290 Q 340 250 318 236" />
      </g>
      {etiquette(305, 128, 'fruits')}
      {etiquette(180, 300, 'restes')}
      {etiquette(52, 128, 'compost')}
      {etiquette(322, 312, 'invendus')}
      {noeud(180, 66, '#3D7A3A', 'Jardin', 'nourricier')}
      {noeud(272, 232, '#B84A26', 'Cuisine', 'collective')}
      {noeud(88, 232, '#8A6A3B', 'Compost', 'retour à la terre')}
    </svg>
  )
}

export function Bouton({ to, children, variante = 'plein', className = '', ...rest }) {
  const styles = {
    plein: 'bg-terre text-white hover:bg-terre-fonce shadow-sm shadow-terre/30',
    vert: 'bg-feuille text-white hover:bg-feuille-fonce',
    contour: 'bg-white/70 text-encre ring-1 ring-sable-fonce hover:ring-terre/50',
  }
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold transition ${styles[variante]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}

export function EnTete({ surtitre, titre, children }) {
  return (
    <div className="max-w-3xl">
      {surtitre && <p className="text-sm font-semibold uppercase tracking-widest text-feuille">{surtitre}</p>}
      <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold text-terre-fonce leading-tight">{titre}</h1>
      {children && <div className="mt-4 text-lg text-encre-doux">{children}</div>}
    </div>
  )
}
