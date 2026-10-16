import { Link } from 'react-router-dom'
import { useProjet } from '../lib/store.jsx'
import { euros } from '../lib/paves.js'

export function Barre({ valeur, className = '' }) {
  return (
    <div className={`h-[3px] w-full bg-ligne ${className}`} role="progressbar" aria-valuenow={Math.round(valeur * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-terre" style={{ width: `${Math.max(1, valeur * 100)}%` }} />
    </div>
  )
}

// Un projet présenté comme une ligne de liste
export function LigneProjet({ id }) {
  const { projet, promis, progression, paves } = useProjet(id)
  return (
    <Link to={`/projets/${id}`} className="group block py-7 border-t border-ligne">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl sm:text-3xl group-hover:text-terre transition-colors">{projet.titre}</h3>
        <span className="text-sm text-gris shrink-0">{projet.domaine}</span>
      </div>
      <p className="mt-1 text-gris">{projet.accroche}</p>
      <Barre valeur={progression} className="mt-5" />
      <p className="mt-2 text-sm text-gris">
        <span className="text-encre">{euros(promis)}</span> sur {euros(projet.objectif_montant)} · {paves.length} pavés
      </p>
    </Link>
  )
}

export function Bouton({ to, children, variante = 'plein', className = '', ...rest }) {
  const styles = {
    plein: 'bg-encre text-papier hover:bg-terre',
    terre: 'bg-terre text-papier hover:bg-terre-fonce',
    lien: 'underline hover:text-terre !px-0',
  }
  const cls = `inline-flex items-center justify-center px-5 py-3 rounded-[3px] transition-colors ${styles[variante]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}

export function EnTete({ titre, children }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl sm:text-5xl leading-[1.1]">{titre}</h1>
      {children && <div className="mt-5 text-lg text-gris leading-relaxed">{children}</div>}
    </div>
  )
}

export const champ = 'w-full bg-white/60 border border-ligne rounded-[3px] px-3 py-2.5 text-base focus:outline-none focus:border-encre'

export function Choix({ name, value, checked, onChange, children, className = '' }) {
  return (
    <label className={`flex items-baseline gap-3 py-2.5 cursor-pointer ${className}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="accent-terre translate-y-[1px]" />
      <span>{children}</span>
    </label>
  )
}

export function Groupe({ titre, children }) {
  return (
    <fieldset className="py-8 border-t border-ligne">
      <legend className="float-left w-full font-display text-xl mb-4">{titre}</legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  )
}

export function Section({ titre, children, className = '' }) {
  return (
    <section className={`mt-20 ${className}`}>
      {titre && <h2 className="text-2xl sm:text-3xl mb-6">{titre}</h2>}
      {children}
    </section>
  )
}
