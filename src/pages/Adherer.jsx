import { useState } from 'react'
import { useData } from '../lib/store.jsx'
import { Bouton, EnTete } from '../components/Elements.jsx'
import Icone from '../components/Icones.jsx'

const TARIFS = [
  { type: 'particulier', label: 'Particulier', prix: 10, inclus: ['Droit de vote en AG', 'Le magazine trimestriel'] },
  { type: 'association', label: 'Association', prix: 25, inclus: ['Droit de vote en AG', 'Fiche dans l’annuaire', 'Stand aux marchés Ansanm'] },
  { type: 'entreprise', label: 'Entreprise', prix: 60, inclus: ['Droit de vote en AG', 'Fiche dans l’annuaire', 'Badge partenaire si vous contribuez'] },
]

const champ = 'w-full rounded-2xl bg-sable-clair ring-1 ring-sable-fonce px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-terre'

export default function Adherer() {
  const { ajouterAdhesion } = useData()
  const [f, setF] = useState({ type: 'particulier', nom: '', email: '', commune: '' })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const envoyer = (e) => {
    e.preventDefault()
    if (!f.nom.trim() || !f.email.includes('@')) return setErreur('Indique ton nom et une adresse e-mail valide.')
    ajouterAdhesion(f)
    setEnvoye(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <EnTete surtitre="Adhérer" titre="L'adhésion fait vivre l'association.">
        Grâce aux adhésions, 100 % des dons vont aux projets. Chaque membre a une voix en assemblée générale, quel que soit le montant qu'il donne.
      </EnTete>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {TARIFS.map((t) => (
          <button
            key={t.type}
            onClick={() => setF({ ...f, type: t.type })}
            aria-pressed={f.type === t.type}
            className={`text-left rounded-3xl p-6 ring-2 transition ${f.type === t.type ? 'bg-white ring-feuille' : 'bg-white/60 ring-sable-fonce/60'}`}
          >
            <p className="font-semibold">{t.label}</p>
            <p className="mt-1"><span className="font-display text-4xl font-extrabold text-feuille-fonce">{t.prix} €</span> <span className="text-encre-doux">/ an</span></p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {t.inclus.map((i) => (
                <li key={i} className="flex gap-2"><Icone nom="check" className="w-4 h-4 text-feuille shrink-0 mt-0.5" />{i}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-encre-doux">Tarifs indicatifs pour la bêta.</p>

      <div className="mt-8 bg-white rounded-3xl p-6 ring-1 ring-sable-fonce/60 max-w-2xl">
        {envoye ? (
          <div className="text-center py-6 fondu" role="status">
            <span className="mx-auto w-14 h-14 rounded-full bg-feuille text-white grid place-items-center"><Icone nom="check" className="w-7 h-7" /></span>
            <p className="mt-4 font-display text-2xl font-bold">Bienvenue dans le koudmen !</p>
            <p className="mt-2 text-encre-doux">Ta pré-adhésion est enregistrée. Nous te recontacterons à l'ouverture des adhésions.</p>
            <Bouton to="/trace" className="mt-6">Voir la Trace</Bouton>
          </div>
        ) : (
          <form onSubmit={envoyer} className="space-y-4" noValidate>
            <h2 className="text-2xl font-extrabold text-terre-fonce">Pré-adhésion</h2>
            <p className="text-sm bg-mangue/15 text-terre-fonce rounded-2xl px-4 py-3">Aucun paiement pendant la bêta.</p>
            <div>
              <label htmlFor="nom" className="font-medium">{f.type === 'particulier' ? 'Prénom et nom' : 'Nom de la structure'}</label>
              <input id="nom" value={f.nom} onChange={maj('nom')} className={champ + ' mt-2'} />
            </div>
            <div>
              <label htmlFor="email" className="font-medium">E-mail</label>
              <input id="email" type="email" value={f.email} onChange={maj('email')} className={champ + ' mt-2'} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="commune" className="font-medium">Commune <span className="text-encre-doux font-normal">(facultatif)</span></label>
              <input id="commune" value={f.commune} onChange={maj('commune')} className={champ + ' mt-2'} />
            </div>
            {erreur && <p className="text-terre-fonce font-medium" role="alert">{erreur}</p>}
            <Bouton type="submit" variante="vert" className="w-full">Je pré-adhère ({TARIFS.find((t) => t.type === f.type).prix} €/an)</Bouton>
          </form>
        )}
      </div>
    </div>
  )
}
