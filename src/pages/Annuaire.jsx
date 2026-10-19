import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { EnTete } from '../components/Elements.jsx'

export default function Annuaire() {
  const { members, contributions, projects, besoinsPros, reponsesPros } = useData()
  const [domaine, setDomaine] = useState('tous')
  const [ouvert, setOuvert] = useState(null)

  const domaines = useMemo(() => [...new Set(members.map((m) => m.domaine))].sort(), [members])
  const soutiens = (id) => [...new Set(contributions.filter((c) => c.member_id === id).map((c) => c.project_id))].map((pid) => projects.find((p) => p.id === pid))
  const liste = members.filter((m) => domaine === 'tous' || m.domaine === domaine)
  // Coups de pouce donnés : réponses bénévoles acceptées, et structures aidées
  const coupsDePouce = (id) =>
    reponsesPros
      .filter((r) => r.responder_member_id === id && r.type === 'coup_de_pouce' && r.statut !== 'envoyé')
      .map((r) => members.find((m) => m.id === besoinsPros.find((b) => b.id === r.need_id)?.member_id))
      .filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto px-5 pt-14">
      <EnTete titre="Ceux qui construisent avec nous" kreyol={['Sé on min ka lavé lòt', 'Une main lave l’autre']}>
        <p>
          Ici, tu trouves les entreprises et associations qui font vivre Ansanm. Elles ne sont pas là pour vendre : elles
          sont là parce qu'elles croient, comme toi, que la Guadeloupe peut avancer autrement.
        </p>
        <p className="mt-4">Quand tu fais appel à elles, tu fais aussi vivre le territoire.</p>
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
          const partenaire = projetsSoutenus.length > 0
          const aides = coupsDePouce(m.id)
          const sesBesoins = besoinsPros.filter((b) => b.member_id === m.id && b.statut !== 'pourvu')
          const deplie = ouvert === m.id
          return (
            <li key={m.id} className="border-b border-ligne">
              <button className="w-full text-left py-5 flex items-baseline justify-between gap-4" onClick={() => setOuvert(deplie ? null : m.id)} aria-expanded={deplie}>
                <span>
                  <span className="font-display text-xl">{m.nom}</span>
                  <span className="block text-sm text-gris mt-0.5">{m.activite}, {m.commune}</span>
                </span>
                <span className="text-sm text-gris shrink-0 text-right">
                  {partenaire && <span className="text-terre-fonce block" title="Cette structure soutient au moins un projet.">Partenaire Ansanm</span>}
                  {aides.length > 0 && <span className="text-encre block" title="Cette structure a aidé au moins une autre structure.">Coup de pouce</span>}
                  <span className="block capitalize">{m.type}</span>
                </span>
              </button>
              {deplie && (
                <div className="pb-6 -mt-1 max-w-2xl fondu">
                  <p className="text-gris leading-relaxed">{m.description}</p>
                  {m.citation && <p className="mt-3 font-display text-lg leading-snug">« {m.citation} »</p>}
                  {partenaire && <p className="mt-3 text-sm text-gris">Partenaire Ansanm : cette structure soutient au moins un projet.</p>}
                  {projetsSoutenus.length > 0 && (
                    <p className="mt-1 text-sm">
                      Projets soutenus :{' '}
                      {projetsSoutenus.map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && ', '}
                          <Link to={`/projets/${p.id}`} className="underline hover:text-terre-fonce">{p.titre}</Link>
                        </span>
                      ))}
                    </p>
                  )}
                  {aides.length > 0 && (
                    <p className="mt-3 text-sm">
                      A donné {aides.length} coup{aides.length > 1 ? 's' : ''} de pouce, à {aides.map((a) => a.nom).join(', ')}.
                    </p>
                  )}
                  <div className="mt-5">
                    <p className="font-display text-lg">Ce dont nous avons besoin</p>
                    {sesBesoins.length > 0 ? (
                      <ul className="mt-2 space-y-1.5 text-sm">
                        {sesBesoins.map((b) => (
                          <li key={b.id}>
                            <Link to="/besoins-pros" className="underline hover:text-terre-fonce">{b.description}</Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-gris">Aucun besoin publié pour l'instant.</p>
                    )}
                    <Link to={`/besoins-pros/publier?structure=${m.id}`} className="mt-2 inline-block text-sm text-terre-fonce underline">Publier un besoin pour cette structure</Link>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl">Votre structure partage ces valeurs ?</h2>
        <p className="mt-4 text-gris leading-relaxed">
          Rejoignez l'annuaire en adhérant à Ansanm, et montrez à la Guadeloupe ce que vous construisez.
        </p>
        <Link to="/adherer?type=entreprise" className="mt-6 inline-block bg-encre text-papier px-5 py-3 rounded-[3px] hover:bg-terre-fonce transition-colors">
          Inscrire ma structure
        </Link>
      </section>
    </div>
  )
}
