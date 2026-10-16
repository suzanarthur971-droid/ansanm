import { useData } from '../lib/store.jsx'
import { EnTete } from '../components/Elements.jsx'

const TYPES = { marche: 'Marché', ag: 'Assemblée générale', magazine: 'Magazine' }

export default function RendezVous() {
  const { events } = useData()
  const magazine = events.find((e) => e.type === 'magazine')
  const liste = [...events].filter((e) => e.type !== 'magazine').sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="max-w-3xl mx-auto px-5 pt-14">
      <EnTete titre="Rendez-vous">Nous nous retrouvons au marché chaque trimestre, et en assemblée générale tous les six mois.</EnTete>

      <ol className="mt-12 border-t border-ligne">
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
