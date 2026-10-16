import { useData } from '../lib/store.jsx'
import { EnTete } from '../components/Elements.jsx'
import Icone from '../components/Icones.jsx'

const STYLE = {
  marche: { label: 'Marché', couleur: '#B84A26', icone: 'calendrier' },
  ag: { label: 'Assemblée générale', couleur: '#3D7A3A', icone: 'vote' },
  magazine: { label: 'Magazine', couleur: '#1A8C9A', icone: 'magazine' },
}

export default function RendezVous() {
  const { events } = useData()
  const magazine = events.find((e) => e.type === 'magazine')
  const liste = [...events].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8">
      <EnTete surtitre="Rendez-vous" titre="On se retrouve, ansanm.">
        Un marché chaque trimestre, une assemblée générale tous les six mois.
      </EnTete>

      <ol className="mt-8 space-y-3">
        {liste.map((e) => {
          const s = STYLE[e.type]
          const d = new Date(e.date + 'T12:00:00')
          return (
            <li key={e.id} className="bg-white rounded-3xl p-5 ring-1 ring-sable-fonce/60 flex gap-4">
              <div className="w-16 shrink-0 text-center rounded-2xl py-2 text-white" style={{ background: s.couleur }}>
                <p className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</p>
                <p className="text-xs uppercase mt-1">{d.toLocaleDateString('fr-FR', { month: 'short' })}</p>
                <p className="text-[11px] opacity-80">{d.getFullYear()}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: s.couleur }}>{s.label}</p>
                <p className="font-display text-xl font-bold leading-tight mt-0.5">{e.titre}</p>
                <p className="text-sm text-encre-doux mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1"><Icone nom="lieu" className="w-4 h-4" />{e.lieu}</span>
                  {e.heure && <span className="inline-flex items-center gap-1"><Icone nom="temps" className="w-4 h-4" />{e.heure}</span>}
                </p>
                <p className="mt-2 text-sm">{e.description}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {magazine && (
        <div className="mt-10 rounded-3xl bg-lagon text-white p-6 sm:p-8 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="w-28 h-36 rounded-xl bg-sable-clair text-encre p-3 shadow-lg rotate-[-4deg] mx-auto sm:mx-0">
            <p className="font-display font-extrabold text-terre-fonce leading-none">Ansanm</p>
            <p className="text-[10px] mt-1 text-encre-doux">n° 1 · trimestriel</p>
            <div className="mt-3 h-12 rounded bg-feuille/70" />
            <div className="mt-2 h-1.5 w-3/4 rounded bg-sable-fonce" />
            <div className="mt-1 h-1.5 w-1/2 rounded bg-sable-fonce" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-mangue">Bientôt</p>
            <p className="font-display text-2xl font-bold mt-1">{magazine.titre}</p>
            <p className="mt-2 text-white/85">{magazine.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
