import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Choix, EnTete, Groupe, champ } from '../components/Elements.jsx'

const TARIFS = [
  { type: 'particulier', label: 'Particulier', prix: 10, inclus: 'droit de vote en AG, magazine trimestriel' },
  { type: 'association', label: 'Association', prix: 25, inclus: 'droit de vote, fiche dans l’annuaire, stand aux marchés' },
  { type: 'entreprise', label: 'Entreprise', prix: 60, inclus: 'droit de vote, fiche dans l’annuaire' },
]

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
    <div className="max-w-2xl mx-auto px-5 pt-14">
      <EnTete titre="Adhérer">
        Nos adhésions font vivre l'association : c'est grâce à elles que 100 % des dons vont aux projets.
        En adhérant, tu nous rejoins et tu as une voix en assemblée générale, quel que soit le montant que tu donnes.
      </EnTete>

      {envoye ? (
        <div className="mt-12 pt-8 border-t border-ligne fondu" role="status">
          <p className="font-display text-3xl">Bienvenue dans le koudmen.</p>
          <p className="mt-3 text-gris">Ta pré-adhésion est enregistrée. Nous te recontacterons à l'ouverture des adhésions.</p>
          <Link to="/trace" className="mt-6 inline-block underline hover:text-terre">Voir la Trace</Link>
        </div>
      ) : (
        <form onSubmit={envoyer} className="mt-10" noValidate>
          <Groupe titre="Formule">
            {TARIFS.map((t) => (
              <Choix key={t.type} name="type" value={t.type} checked={f.type === t.type} onChange={maj('type')}>
                {t.label}, {t.prix} € par an <span className="text-gris">— {t.inclus}</span>
              </Choix>
            ))}
            <p className="mt-2 text-sm text-gris">Tarifs indicatifs. Aucun paiement pendant la bêta.</p>
          </Groupe>

          <Groupe titre="Coordonnées">
            <div className="space-y-5">
              <div>
                <label htmlFor="nom" className="text-sm text-gris">{f.type === 'particulier' ? 'Prénom et nom' : 'Nom de la structure'}</label>
                <input id="nom" value={f.nom} onChange={maj('nom')} className={champ + ' mt-2'} />
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-gris">E-mail</label>
                <input id="email" type="email" value={f.email} onChange={maj('email')} className={champ + ' mt-2'} autoComplete="email" />
              </div>
              <div>
                <label htmlFor="commune" className="text-sm text-gris">Commune (facultatif)</label>
                <input id="commune" value={f.commune} onChange={maj('commune')} className={champ + ' mt-2'} />
              </div>
            </div>
          </Groupe>

          <div className="pt-8 border-t border-ligne">
            {erreur && <p className="mb-4 text-terre" role="alert">{erreur}</p>}
            <button type="submit" className="bg-encre text-papier px-8 py-3.5 rounded-[3px] hover:bg-terre transition-colors">
              Je pré-adhère
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
