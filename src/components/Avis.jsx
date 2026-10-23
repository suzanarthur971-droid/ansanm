import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { champ } from './Nouveau.jsx'

const REPONSES = [['oui', 'Oui'], ['peut-etre', 'Peut-être'], ['non', 'Non']]

// Formulaire d'avis de la phase de lancement, ouvert depuis le bouton flottant ou le bandeau
export function FormulaireAvis({ onFermer }) {
  const { ajouterAvis } = useData()
  const { pathname } = useLocation()
  const [f, setF] = useState({ poserait: '', plu: '', manque: '', contact: '' })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const maj = (k) => (e) => setF({ ...f, [k]: e.target.value })

  useEffect(() => {
    const echap = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', echap)
    return () => window.removeEventListener('keydown', echap)
  }, [onFermer])

  const envoyer = (e) => {
    e.preventDefault()
    if (!f.poserait && !f.plu.trim() && !f.manque.trim()) return setErreur('Réponds au moins à une question.')
    ajouterAvis({
      page: pathname,
      poserait: f.poserait || null,
      plu: f.plu.trim() || null,
      manque: f.manque.trim() || null,
      contact: f.contact.trim() || null,
    })
    setEnvoye(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Donner mon avis">
      <div className="absolute inset-0 bg-olive-nuit/50 fondu" onClick={onFermer} />
      <div className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto bg-papier rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 fondu">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl">Ton avis compte</h2>
          <button onClick={onFermer} className="font-semibold underline underline-offset-4 shrink-0">Fermer</button>
        </div>
        {envoye ? (
          <div className="mt-5" role="status">
            <p className="text-xl font-semibold">Merci ! Ton avis nous aide à poser les prochains pavés.</p>
            <button onClick={onFermer} className="mt-6 bg-olive text-beige font-semibold px-6 py-3 rounded-lg hover:bg-olive-nuit transition-colors">
              Revenir au site
            </button>
          </div>
        ) : (
          <form onSubmit={envoyer} className="mt-5 space-y-5" noValidate>
            <p className="text-olive/80">Ansanm est en phase de lancement. Deux minutes de ton temps nous aident à l'améliorer.</p>
            <fieldset>
              <legend className="font-[700] text-lg mb-2">Tu poserais un pavé ?</legend>
              <div className="flex flex-wrap gap-2">
                {REPONSES.map(([v, l]) => (
                  <label key={v} className={`flex items-baseline gap-2 rounded-lg px-4 py-2.5 cursor-pointer transition-colors ${f.poserait === v ? 'bg-olive text-beige' : 'bg-beige hover:bg-[#E2D4B8]'}`}>
                    <input type="radio" name="poserait" value={v} checked={f.poserait === v} onChange={maj('poserait')} className="accent-terre" />
                    {l}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="avis-plu" className="font-[700] text-lg">Qu'est-ce qui t'a plu ?</label>
              <textarea id="avis-plu" rows="2" maxLength={1000} value={f.plu} onChange={maj('plu')} className={champ + ' mt-2'} />
            </div>
            <div>
              <label htmlFor="avis-manque" className="font-[700] text-lg">Qu'est-ce qui n'est pas clair, ou te manque ?</label>
              <textarea id="avis-manque" rows="3" maxLength={1000} value={f.manque} onChange={maj('manque')} className={champ + ' mt-2'} />
            </div>
            <div>
              <label htmlFor="avis-contact" className="font-[700] text-lg">Ton prénom et un contact <span className="font-normal text-olive/70">(facultatif)</span></label>
              <p className="text-olive/70">Si tu veux qu'on te réponde.</p>
              <input id="avis-contact" value={f.contact} onChange={maj('contact')} className={champ + ' mt-2'} autoComplete="email" />
            </div>
            {erreur && <p className="text-terre-fonce font-semibold" role="alert">{erreur}</p>}
            <button type="submit" className="w-full bg-terre-fonce text-papier text-lg font-semibold px-6 py-3.5 rounded-lg hover:bg-terre-profond transition-colors">
              Envoyer mon avis
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// Bouton flottant, au-dessus de la barre d'onglets sur mobile
export default function BoutonAvis({ onOuvrir }) {
  return (
    <button
      onClick={onOuvrir}
      className="fixed z-30 right-4 bottom-[5.5rem] lg:bottom-6 lg:right-6 bg-olive-nuit text-beige font-semibold text-[15px] px-4 py-2.5 rounded-full shadow-lg hover:bg-olive transition-colors"
    >
      Donner mon avis
    </button>
  )
}
