import { useState } from 'react'
import { useData } from '../lib/store.jsx'
import { champ } from './Elements.jsx'

// Bloc « On recrute » d'une fiche projet : la personne se signale, ou signale quelqu'un
export default function Recrutement({ projet }) {
  const { ajouterInteret } = useData()
  const [mode, setMode] = useState(null) // 'moi' | 'proche'
  const [f, setF] = useState({ nom: '', contact: '', message: '' })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const envoyer = (e) => {
    e.preventDefault()
    if (!f.nom.trim() || f.contact.trim().length < 5) return setErreur('Indique un nom et un e-mail ou un numéro pour te recontacter.')
    ajouterInteret({ project_id: projet.id, type: mode, nom: f.nom.trim(), contact: f.contact.trim(), message: f.message.trim() || null })
    setEnvoye(true)
  }

  return (
    <section className="mt-16 pt-8 border-t border-ligne">
      <p className="text-sm text-gris">On recrute · {projet.recrute.poste}</p>
      <h2 className="mt-1 text-2xl sm:text-3xl">Ce projet cherche sa personne.</h2>
      <p className="mt-4 text-gris leading-relaxed">
        Un projet sans personne pour le faire vivre, c'est du matériel qui dort dans un garage. Si tu as le profil, ou
        si tu connais quelqu'un, fais-nous signe.
      </p>
      <p className="mt-3 text-sm text-gris">{projet.recrute.detail}</p>

      {envoye ? (
        <p className="mt-6 font-display text-xl fondu" role="status">Merci ! On revient vers toi très vite.</p>
      ) : !mode ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setMode('moi')} className="bg-encre text-papier px-5 py-3 rounded-[3px] hover:bg-terre-fonce transition-colors">Je suis intéressé·e</button>
          <button onClick={() => setMode('proche')} className="border border-encre px-5 py-3 rounded-[3px] hover:bg-beige transition-colors">Je connais quelqu'un</button>
        </div>
      ) : (
        <form onSubmit={envoyer} className="mt-6 space-y-4 fondu" noValidate>
          <div>
            <label htmlFor="r-nom" className="text-sm text-gris">{mode === 'moi' ? 'Ton nom' : 'Ton nom (on te contactera pour en savoir plus)'}</label>
            <input id="r-nom" value={f.nom} onChange={maj('nom')} className={champ + ' mt-2'} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="r-contact" className="text-sm text-gris">E-mail ou téléphone</label>
            <input id="r-contact" value={f.contact} onChange={maj('contact')} className={champ + ' mt-2'} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="r-msg" className="text-sm text-gris">{mode === 'moi' ? 'Ton parcours en quelques mots (facultatif)' : 'Qui est cette personne ? (facultatif)'}</label>
            <textarea id="r-msg" rows="3" maxLength={600} value={f.message} onChange={maj('message')} className={champ + ' mt-2'} />
          </div>
          {erreur && <p className="text-terre-fonce" role="alert">{erreur}</p>}
          <div className="flex items-center gap-5">
            <button type="submit" className="bg-encre text-papier px-6 py-3 rounded-[3px] hover:bg-terre-fonce transition-colors">Envoyer</button>
            <button type="button" onClick={() => setMode(null)} className="text-sm text-gris underline">Annuler</button>
          </div>
        </form>
      )}
    </section>
  )
}
