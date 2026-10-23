import { useEffect, useState } from 'react'
import { creerStory } from '../lib/story.js'

// Aperçu de la story du pavé, avec partage direct (Instagram, WhatsApp…) ou enregistrement de l'image
export default function StoryPave({ projet, pave, paves, onFermer }) {
  const [image, setImage] = useState(null) // { blob, url }
  const [etat, setEtat] = useState('')
  const nomFichier = `ansanm-${projet.id}.png`

  useEffect(() => {
    let url
    creerStory({ projet, pave, paves, adresse: window.location.host })
      .then((blob) => {
        url = URL.createObjectURL(blob)
        setImage({ blob, url })
      })
      .catch(() => setEtat('L’image n’a pas pu être créée. Réessaie dans un instant.'))
    return () => url && URL.revokeObjectURL(url)
  }, [projet, pave, paves])

  useEffect(() => {
    const echap = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', echap)
    return () => window.removeEventListener('keydown', echap)
  }, [onFermer])

  const fichier = image && new File([image.blob], nomFichier, { type: 'image/png' })
  const peutPartager = fichier && navigator.canShare?.({ files: [fichier] })

  const partager = async () => {
    try {
      await navigator.share({ files: [fichier], title: 'Ansanm', text: `J'ai posé mon pavé sur la trace ${projet.titre}. Et toi, tu poses quoi ?` })
    } catch (e) {
      if (e.name !== 'AbortError') setEtat('Le partage n’a pas marché : enregistre l’image, puis publie-la depuis ta galerie.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Ta story">
      <div className="absolute inset-0 bg-olive-nuit/60 fondu" onClick={onFermer} />
      <div className="relative w-full sm:max-w-md max-h-[94dvh] overflow-y-auto bg-papier rounded-t-3xl sm:rounded-3xl p-6 fondu">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl">Ta story est prête</h2>
          <button onClick={onFermer} className="font-semibold underline underline-offset-4 shrink-0">Fermer</button>
        </div>
        <p className="mt-2 text-olive/80">Partage-la sur Instagram, WhatsApp ou ailleurs : une route se construit plus vite à plusieurs.</p>

        <div className="mt-5 mx-auto w-48 sm:w-56 aspect-[9/16] rounded-2xl overflow-hidden bg-olive shadow-xl">
          {image ? (
            <img src={image.url} alt={`Story : j'ai posé mon pavé sur la trace ${projet.titre}`} className="w-full h-full object-cover" />
          ) : (
            <p className="h-full grid place-items-center text-beige/80 text-center px-4">On pose les pavés…</p>
          )}
        </div>

        <div className="mt-6 grid gap-3">
          {peutPartager && (
            <button onClick={partager} className="bg-terre-fonce text-papier text-lg font-semibold px-6 py-3.5 rounded-lg hover:bg-terre-profond transition-colors">
              Partager ma story
            </button>
          )}
          {image && (
            <a
              href={image.url}
              download={nomFichier}
              className={`text-center text-lg font-semibold px-6 py-3.5 rounded-lg transition-colors ${peutPartager ? 'bg-beige hover:bg-[#E2D4B8]' : 'bg-terre-fonce text-papier hover:bg-terre-profond'}`}
            >
              Enregistrer l'image
            </a>
          )}
        </div>
        {etat && <p className="mt-4 text-terre-fonce font-semibold" role="alert">{etat}</p>}
      </div>
    </div>
  )
}
