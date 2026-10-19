import { useData } from '../lib/store.jsx'
import { Aplat } from '../components/Nouveau.jsx'

const TYPES = { marche: 'Rendez-vous Ansanm', ag: 'Assemblée générale', magazine: 'Magazine' }

const FORMATS = [
  ['Rendez-vous Ansanm', 'Tous les trois mois', 'Marché, ventes solidaires, adhésions sur place.', '#C57B57'],
  ['Assemblée générale', 'Tous les six mois', 'On décide ensemble des prochains projets.', '#A8BFA1'],
  ['Le magazine', 'Tous les trois mois', 'Les histoires de ceux qui construisent, à garder et à faire passer.', '#C9A46E'],
]

export default function RendezVous() {
  const { events } = useData()
  const magazine = events.find((e) => e.type === 'magazine')
  const liste = [...events].filter((e) => e.type !== 'magazine').sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div>
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12 grid md:grid-cols-2 gap-8 md:gap-16 items-end">
        <h1 className="text-5xl sm:text-7xl">On se retrouve sur le terrain</h1>
        <div className="space-y-4 text-lg leading-relaxed text-beige/90">
          <p>
            Ansanm ne vit pas que sur un écran. Tous les trois mois, on se retrouve au marché : des tartes, des produits de
            nos partenaires, des rencontres, et la Trace en version géante, où chacun vient coller son pavé.
          </p>
          <p className="text-beige font-semibold">C'est là que l'élan devient visible.</p>
        </div>
      </Aplat>

      <Aplat couleur="beige" interieur="py-12 grid md:grid-cols-3 gap-8">
        {FORMATS.map(([t, rythme, d, couleur]) => (
          <div key={t}>
            <p className="flex items-center gap-2 font-semibold">
              <span className="w-4 h-3.5 rounded-[3px]" style={{ background: couleur }} aria-hidden="true" />
              {rythme}
            </p>
            <h2 className="mt-3 text-3xl">{t}</h2>
            <p className="mt-2 text-lg leading-relaxed">{d}</p>
          </div>
        ))}
      </Aplat>

      <Aplat interieur="py-16">
        <h2 className="text-4xl sm:text-5xl">Les prochaines dates</h2>
        <ol className="mt-10 space-y-4">
          {liste.map((e) => {
            const d = new Date(e.date + 'T12:00:00')
            return (
              <li key={e.id} className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-5 sm:gap-8 bg-beige rounded-[22px] p-5 sm:p-7">
                <div className="text-center">
                  <p className="titre text-5xl sm:text-6xl">{d.getDate()}</p>
                  <p className="font-semibold">{d.toLocaleDateString('fr-FR', { month: 'long' })}</p>
                  <p className="text-olive/70">{d.getFullYear()}</p>
                </div>
                <div>
                  <p className="font-semibold text-terre-fonce">{TYPES[e.type]}</p>
                  <h3 className="mt-1 text-2xl sm:text-3xl">{e.titre}</h3>
                  <p className="mt-2 font-semibold">{e.lieu}{e.heure ? `, ${e.heure}` : ''}</p>
                  <p className="mt-2 text-lg leading-relaxed">{e.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </Aplat>

      {magazine && (
        <Aplat couleur="brique" interieur="py-16 grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="w-36 h-48 rounded-xl bg-papier text-olive p-4 shadow-2xl -rotate-3 mx-auto md:mx-0">
            <p className="titre text-2xl">Ansanm</p>
            <p className="text-xs mt-1 text-olive/70">n° 1, trimestriel</p>
            <div className="mt-4 h-16 rounded-lg bg-sauge" />
            <div className="mt-3 h-2 w-3/4 rounded bg-beige" />
            <div className="mt-1.5 h-2 w-1/2 rounded bg-beige" />
          </div>
          <div>
            <p className="font-semibold text-papier/80">
              À paraître en {new Date(magazine.date + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
            <h2 className="mt-2 text-4xl sm:text-5xl">{magazine.titre}</h2>
            <p className="mt-4 text-xl leading-relaxed text-papier/90 max-w-2xl">{magazine.description}</p>
          </div>
        </Aplat>
      )}
    </div>
  )
}
