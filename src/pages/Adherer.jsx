import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Choix, EnTete, Groupe, champ } from '../components/Elements.jsx'

const TARIFS = [
  { type: 'particulier', label: 'Particulier', prix: 10, inclus: 'ta voix en assemblée générale' },
  { type: 'association', label: 'Association', prix: 25, inclus: 'votre voix, et votre place dans l’annuaire' },
  { type: 'entreprise', label: 'Entreprise', prix: 60, inclus: 'votre voix, votre fiche dans l’annuaire, et votre présence dans le magazine' },
]

export default function Adherer() {
  const { ajouterAdhesion } = useData()
  const [params] = useSearchParams()
  const typeDepart = TARIFS.some((t) => t.type === params.get('type')) ? params.get('type') : 'particulier'
  const [f, setF] = useState({ type: typeDepart, nom: '', email: '', commune: '' })
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
      <EnTete titre="Faire vivre la maison">
        <p>Tes dons vont entièrement aux projets. Alors qui fait tourner l'association ? Les adhérents.</p>
        <p className="mt-4">
          L'adhésion paie le strict nécessaire : le site, l'assurance, le compte en banque. Et elle te donne une voix :
          chaque adhérent vote en assemblée générale, tous les six mois, pour décider des prochains projets. Une personne,
          une voix, quel que soit le montant que tu donnes.
        </p>
      </EnTete>

      {envoye ? (
        <div className="mt-12 pt-8 border-t border-ligne fondu" role="status">
          <p className="font-display text-3xl">Bienvenue dans la famille.</p>
          <p className="mt-3 text-lg">Tu fais désormais partie de ceux qui décident.</p>
          <p className="mt-3 text-sm text-gris">Pendant la phase de lancement, ton adhésion est enregistrée sans paiement. Nous te recontacterons à l'ouverture officielle.</p>
          <Link to="/trace" className="mt-6 inline-block underline hover:text-terre-fonce">Voir la Trace</Link>
        </div>
      ) : (
        <form onSubmit={envoyer} className="mt-10" noValidate>
          <Groupe titre="Formule">
            {TARIFS.map((t) => (
              <Choix key={t.type} name="type" value={t.type} checked={f.type === t.type} onChange={maj('type')}>
                {t.label} — {t.prix} €/an <span className="text-gris">: {t.inclus}</span>
              </Choix>
            ))}
            <p className="mt-2 text-sm text-gris">Tarifs indicatifs. Aucun paiement pendant la phase de lancement.</p>
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
            {erreur && <p className="mb-4 text-terre-fonce" role="alert">{erreur}</p>}
            <button type="submit" className="bg-encre text-papier px-8 py-3.5 rounded-[3px] hover:bg-terre-fonce transition-colors">
              Je rejoins Ansanm
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
