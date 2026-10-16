import { useData } from '../lib/store.jsx'
import { EnTete } from '../components/Elements.jsx'

const TYPES = { marche: 'Rendez-vous Ansanm', ag: 'Assemblée générale', magazine: 'Magazine' }

const FORMATS = [
  ['Rendez-vous Ansanm', 'tous les trois mois', 'Marché, ventes solidaires, adhésions sur place.'],
  ['Assemblée générale', 'tous les six mois', 'On décide ensemble des prochains projets.'],
  ['Le magazine', 'tous les trois mois', 'Les histoires de ceux qui construisent, à garder et à faire passer.'],
]

export default function RendezVous() {
  const { events } = useData()
  const magazine = events.find((e) => e.type === 'magazine')
  const liste = [...events].filter((e) => e.type !== 'magazine').sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="max-w-3xl mx-auto px-5 pt-14">
      <EnTete titre="On se retrouve sur le terrain">
        <p>
          Ansanm ne vit pas que sur un écran. Tous les trois mois, on se retrouve au marché : des tartes, des produits de
          nos partenaires, des rencontres, et la Trace en version géante, où chacun vient coller son pavé.
        </p>
        <p className="mt-4 text-encre">C'est là que l'élan devient visible.</p>
      </EnTete>

      <dl className="mt-12 grid sm:grid-cols-3 gap-8">
        {FORMATS.map(([t, rythme, d]) => (
          <div key={t} className="border-t border-ligne pt-4">
            <dt className="font-display text-xl">{t}</dt>
            <dd className="text-sm text-terre-fonce mt-1">{rythme}</dd>
            <dd className="mt-2 text-gris leading-relaxed">{d}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-16 text-2xl sm:text-3xl">Les prochaines dates</h2>

      <ol className="mt-6 border-t border-ligne">
        {liste.map((e) => {
          const d = new Date(e.date + 'T12:00:00')
          return (
            <li key={e.id} className="grid sm:grid-cols-[150px_1fr] gap-2 sm:gap-6 py-6 border-b border-ligne">
              <p className="text-gris">
                {d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {e.heure && <span className="block text-sm">{e.heure}</span>}
              </p>
              <div>
                <p className="text-sm text-gris">{TYPES[e.type]}</p>
                <h2 className="text-2xl mt-0.5">{e.titre}</h2>
                <p className="mt-1 text-sm">{e.lieu}</p>
                <p className="mt-3 text-gris leading-relaxed">{e.description}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {magazine && (
        <div className="mt-16">
          <p className="text-sm text-gris">À paraître en {new Date(magazine.date + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
          <h2 className="text-3xl mt-1">{magazine.titre}</h2>
          <p className="mt-3 text-gris leading-relaxed max-w-2xl">{magazine.description}</p>
        </div>
      )}
    </div>
  )
}
