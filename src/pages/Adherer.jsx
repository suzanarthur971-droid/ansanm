import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Aplat, Kreyol, champ } from '../components/Nouveau.jsx'

const TARIFS = [
  { type: 'particulier', label: 'Particulier', prix: 10, inclus: 'Ta voix en assemblée générale.', couleur: '#A8BFA1' },
  { type: 'association', label: 'Association', prix: 25, inclus: 'Votre voix, et votre place dans l’annuaire.', couleur: '#C9A46E' },
  { type: 'entreprise', label: 'Entreprise', prix: 60, inclus: 'Votre voix, votre fiche dans l’annuaire, et votre présence dans le magazine.', couleur: '#C57B57' },
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
    <div>
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12 grid md:grid-cols-2 gap-8 md:gap-16 items-end">
        <div>
          <Kreyol texte="Yonn pou lòt" traduction="L'un pour l'autre" clair />
          <h1 className="mt-6 text-5xl sm:text-7xl">Faire vivre la maison</h1>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-beige/90">
          <p>Tes dons vont entièrement aux projets. Alors qui fait tourner l'association ? Les adhérents.</p>
          <p>
            L'adhésion paie le strict nécessaire : le site, l'assurance, le compte en banque. Et elle te donne une voix :
            chaque adhérent vote en assemblée générale, tous les six mois, pour décider des prochains projets. Une
            personne, une voix, quel que soit le montant que tu donnes.
          </p>
        </div>
      </Aplat>

      <Aplat interieur="py-14">
        {envoye ? (
          <div className="bg-beige rounded-[22px] p-8 sm:p-12 max-w-3xl fondu" role="status">
            <p className="titre text-5xl">Bienvenue dans la famille.</p>
            <p className="mt-4 text-2xl">Tu fais désormais partie de ceux qui décident.</p>
            <p className="mt-4 text-olive/75">Pendant la phase de lancement, ton adhésion est enregistrée sans paiement. Nous te recontacterons à l'ouverture officielle.</p>
            <Link to="/trace" className="mt-6 inline-block font-semibold underline decoration-2 underline-offset-4">Voir la Trace</Link>
          </div>
        ) : (
          <form onSubmit={envoyer} noValidate>
            <fieldset>
              <legend className="titre text-3xl sm:text-4xl mb-6">Ta formule</legend>
              <div className="grid md:grid-cols-3 gap-4">
                {TARIFS.map((t) => {
                  const choisi = f.type === t.type
                  return (
                    <label key={t.type} className={`relative block rounded-[22px] p-6 cursor-pointer transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-terre ${choisi ? 'bg-olive text-beige' : 'bg-beige hover:bg-[#E2D4B8]'}`}>
                      <input type="radio" name="type" value={t.type} checked={choisi} onChange={maj('type')} className="sr-only" />
                      <span className="flex items-center gap-2 text-lg font-semibold">
                        <span className="w-4 h-3.5 rounded-[3px]" style={{ background: t.couleur }} aria-hidden="true" />
                        {t.label}
                      </span>
                      <span className="titre block mt-4 text-6xl">{t.prix} €</span>
                      <span className={`block text-lg ${choisi ? 'text-beige/80' : 'text-olive/70'}`}>par an</span>
                      <span className="block mt-4 leading-relaxed">{t.inclus}</span>
                      {choisi && <span className="absolute top-5 right-5 text-sm font-semibold text-sauge">Choisi</span>}
                    </label>
                  )
                })}
              </div>
              <p className="mt-3 text-olive/70">Tarifs indicatifs. Aucun paiement pendant la phase de lancement.</p>
            </fieldset>

            <div className="mt-12 bg-beige rounded-[22px] p-6 sm:p-8 max-w-3xl">
              <p className="titre text-3xl">Tes coordonnées</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="nom" className="font-semibold">{f.type === 'particulier' ? 'Prénom et nom' : 'Nom de la structure'}</label>
                  <input id="nom" value={f.nom} onChange={maj('nom')} className={champ + ' mt-2'} />
                </div>
                <div>
                  <label htmlFor="email" className="font-semibold">E-mail</label>
                  <input id="email" type="email" value={f.email} onChange={maj('email')} className={champ + ' mt-2'} autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="commune" className="font-semibold">Commune <span className="font-normal text-olive/70">(facultatif)</span></label>
                  <input id="commune" value={f.commune} onChange={maj('commune')} className={champ + ' mt-2'} />
                </div>
              </div>
              {erreur && <p className="mt-5 text-terre-fonce font-semibold" role="alert">{erreur}</p>}
              <button type="submit" className="mt-6 bg-terre-fonce text-papier text-xl font-semibold px-9 py-4 rounded-lg hover:bg-terre-profond transition-colors">
                Je rejoins Ansanm
              </button>
            </div>
          </form>
        )}
      </Aplat>
    </div>
  )
}
