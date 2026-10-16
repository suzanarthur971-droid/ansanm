import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { EnTete } from '../components/Elements.jsx'

export default function Annuaire() {
  const { members, contributions, projects } = useData()
  const [domaine, setDomaine] = useState('tous')
  const [ouvert, setOuvert] = useState(null)

  const domaines = useMemo(() => [...new Set(members.map((m) => m.domaine))].sort(), [members])
  const soutiens = (id) => [...new Set(contributions.filter((c) => c.member_id === id).map((c) => c.project_id))].map((pid) => projects.find((p) => p.id === pid))
  const liste = members.filter((m) => domaine === 'tous' || m.domaine === domaine)

  return (
    <div className="max-w-5xl mx-auto px-5 pt-14">
      <EnTete titre="Annuaire">
        Les entreprises et associations membres. Elles font vivre Ansanm par leur adhésion, et certaines soutiennent directement les projets.
      </EnTete>

      <div className="mt-10 flex gap-5 overflow-x-auto border-b border-ligne -mx-5 px-5 text-sm" aria-label="Filtrer par domaine">
        {['tous', ...domaines].map((d) => (
          <button
            key={d}
            onClick={() => setDomaine(d)}
            aria-pressed={domaine === d}
            className={`shrink-0 pb-3 -mb-px border-b-2 capitalize transition-colors ${domaine === d ? 'border-encre' : 'border-transparent text-gris hover:text-encre'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <ul>
        {liste.map((m) => {
          const projetsSoutenus = soutiens(m.id)
          const partenaire = m.partenaire || projetsSoutenus.length > 0
          const deplie = ouvert === m.id
          return (
            <li key={m.id} className="border-b border-ligne">
              <button className="w-full text-left py-5 flex items-baseline justify-between gap-4" onClick={() => setOuvert(deplie ? null : m.id)} aria-expanded={deplie}>
                <span>
                  <span className="font-display text-xl">{m.nom}</span>
                  <span className="block text-sm text-gris mt-0.5">{m.activite}, {m.commune}</span>
                </span>
                <span className="text-sm text-gris shrink-0 text-right">
                  {partenaire && <span className="text-terre">Partenaire Ansanm</span>}
                  <span className="block capitalize">{m.type}</span>
                </span>
              </button>
              {deplie && (
                <div className="pb-6 -mt-1 max-w-2xl fondu">
                  <p className="text-gris leading-relaxed">{m.description}</p>
                  {projetsSoutenus.length > 0 && (
                    <p className="mt-3 text-sm">
                      Soutient :{' '}
                      {projetsSoutenus.map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && ', '}
                          <Link to={`/projets/${p.id}`} className="underline hover:text-terre">{p.titre}</Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-10 text-sm text-gris max-w-xl">
        Mécénat : les membres sont mentionnés sobrement, avec les projets qu'ils soutiennent. Pas de publicité commerciale.
        Votre structure veut apparaître ici ? <Link to="/adherer" className="underline hover:text-terre">Adhérer</Link>.
      </p>
    </div>
  )
}
