import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { EnTete } from '../components/Elements.jsx'
import Icone from '../components/Icones.jsx'

export default function Annuaire() {
  const { members, contributions, projects } = useData()
  const [domaine, setDomaine] = useState('tous')
  const [ouvert, setOuvert] = useState(null)

  const domaines = useMemo(() => [...new Set(members.map((m) => m.domaine))].sort(), [members])
  const soutiens = (id) => [...new Set(contributions.filter((c) => c.member_id === id).map((c) => c.project_id))].map((pid) => projects.find((p) => p.id === pid))
  const liste = members.filter((m) => domaine === 'tous' || m.domaine === domaine)

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8">
      <EnTete surtitre="Annuaire" titre="Les entreprises et associations membres.">
        Elles font vivre Ansanm par leur adhésion, et certaines soutiennent directement les projets.
      </EnTete>

      <div className="mt-6 -mx-4 px-4 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrer par domaine">
        {['tous', ...domaines].map((d) => (
          <button
            key={d}
            onClick={() => setDomaine(d)}
            aria-pressed={domaine === d}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold capitalize ring-1 transition ${domaine === d ? 'bg-encre text-sable ring-encre' : 'bg-white ring-sable-fonce'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {liste.map((m) => {
          const projetsSoutenus = soutiens(m.id)
          const partenaire = m.partenaire || projetsSoutenus.length > 0
          const deplie = ouvert === m.id
          return (
            <li key={m.id} className="bg-white rounded-3xl p-5 ring-1 ring-sable-fonce/60">
              <button className="w-full text-left" onClick={() => setOuvert(deplie ? null : m.id)} aria-expanded={deplie}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold leading-tight">{m.nom}</p>
                    <p className="text-sm text-encre-doux mt-0.5">{m.activite} · {m.commune}</p>
                  </div>
                  <span className="text-xs capitalize px-2.5 py-1 rounded-full bg-sable text-encre-doux shrink-0">{m.type}</span>
                </div>
                {partenaire && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-feuille-fonce bg-feuille/12 px-2.5 py-1 rounded-full">
                    <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true"><rect x="1" y="2" width="10" height="8" rx="2" fill="currentColor" /></svg>
                    Partenaire Ansanm
                  </span>
                )}
              </button>
              {deplie && (
                <div className="mt-4 pt-4 border-t border-sable fondu">
                  <p className="text-sm">{m.description}</p>
                  {projetsSoutenus.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-encre-doux">Projets soutenus</p>
                      <ul className="mt-1.5 flex flex-wrap gap-2">
                        {projetsSoutenus.map((p) => (
                          <li key={p.id}>
                            <Link to={`/projets/${p.id}`} className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ background: p.couleur }}>
                              {p.titre} <Icone nom="fleche" className="w-3.5 h-3.5" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-8 text-sm text-encre-doux max-w-2xl">
        Mécénat : les membres sont mentionnés sobrement, avec les projets qu'ils soutiennent. Pas de publicité commerciale sur Ansanm.
      </p>
      <Link to="/adherer" className="mt-4 inline-flex items-center gap-1 font-semibold text-terre">
        Votre structure veut rejoindre l'annuaire ? Adhérer <Icone nom="fleche" className="w-4 h-4" />
      </Link>
    </div>
  )
}
