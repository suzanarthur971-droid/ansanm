import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { Action, Aplat, Exemple, Kreyol } from '../components/Nouveau.jsx'

function Marque({ couleur, children, titre }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold" title={titre}>
      <span className="w-3 h-2.5 rounded-[3px]" style={{ background: couleur }} aria-hidden="true" />
      {children}
    </span>
  )
}

export default function Annuaire() {
  const { members, contributions, projects, besoinsPros, reponsesPros } = useData()
  const [domaine, setDomaine] = useState('tous')
  const [ouvert, setOuvert] = useState(null)

  const domaines = useMemo(() => [...new Set(members.map((m) => m.domaine))].sort(), [members])
  const soutiens = (id) => [...new Set(contributions.filter((c) => c.member_id === id).map((c) => c.project_id))].map((pid) => projects.find((p) => p.id === pid))
  // Coups de pouce donnés : réponses bénévoles acceptées, et structures aidées
  const coupsDePouce = (id) =>
    reponsesPros
      .filter((r) => r.responder_member_id === id && r.type === 'coup_de_pouce' && r.statut !== 'envoyé')
      .map((r) => members.find((m) => m.id === besoinsPros.find((b) => b.id === r.need_id)?.member_id))
      .filter(Boolean)
  const liste = members.filter((m) => domaine === 'tous' || m.domaine === domaine)

  return (
    <div>
      <Aplat couleur="olive" interieur="pt-14 sm:pt-20 pb-12 grid md:grid-cols-2 gap-8 md:gap-16 items-end">
        <div>
          <Kreyol texte="Sé on min ka lavé lòt" traduction="Une main lave l'autre" clair />
          <h1 className="mt-6 text-5xl sm:text-7xl">Ceux qui construisent avec nous</h1>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-beige/90">
          <p>
            Ici, tu trouves les entreprises et associations qui font vivre Ansanm. Elles ne sont pas là pour vendre :
            elles sont là parce qu'elles croient, comme toi, que la Guadeloupe peut avancer autrement.
          </p>
          <p>Quand tu fais appel à elles, tu fais aussi vivre le territoire.</p>
        </div>
      </Aplat>

      <Aplat interieur="py-12">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par domaine">
          {['tous', ...domaines].map((d) => (
            <button
              key={d}
              onClick={() => setDomaine(d)}
              aria-pressed={domaine === d}
              className={`px-4 py-2.5 rounded-lg font-semibold first-letter:uppercase transition-colors ${domaine === d ? 'bg-olive text-beige' : 'bg-beige hover:bg-[#E2D4B8]'}`}
            >
              {d}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid md:grid-cols-2 gap-4 items-start">
          {liste.map((m) => {
            const projetsSoutenus = soutiens(m.id)
            const aides = coupsDePouce(m.id)
            const sesBesoins = besoinsPros.filter((b) => b.member_id === m.id && b.statut !== 'pourvu')
            const deplie = ouvert === m.id
            return (
              <li key={m.id} className="bg-beige rounded-[22px]">
                <button className="w-full text-left p-6" onClick={() => setOuvert(deplie ? null : m.id)} aria-expanded={deplie}>
                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="titre block text-2xl sm:text-3xl">{m.nom}</span>
                      {m.exemple && <Exemple className="mt-2" />}
                      <span className="block mt-2 text-olive/80">{m.activite}, {m.commune}</span>
                    </span>
                    <span className="shrink-0 text-2xl leading-none text-olive/60" aria-hidden="true">{deplie ? '−' : '+'}</span>
                  </span>
                  {(projetsSoutenus.length > 0 || aides.length > 0) && (
                    <span className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                      {projetsSoutenus.length > 0 && <Marque couleur="#C57B57" titre="Cette structure soutient au moins un projet.">Partenaire Ansanm</Marque>}
                      {aides.length > 0 && <Marque couleur="#A8BFA1" titre="Cette structure a aidé au moins une autre structure.">Coup de pouce</Marque>}
                    </span>
                  )}
                </button>
                {deplie && (
                  <div className="px-6 pb-6 -mt-1 fondu space-y-5">
                    <p className="text-lg leading-relaxed">{m.description}</p>
                    {m.citation && <p className="text-xl font-semibold leading-snug">« {m.citation} »</p>}
                    {projetsSoutenus.length > 0 && (
                      <div>
                        <p className="font-[700]">Projets soutenus</p>
                        <p className="mt-1">
                          {projetsSoutenus.map((p, i) => (
                            <span key={p.id}>
                              {i > 0 && ', '}
                              <Link to={`/projets/${p.id}`} className="underline underline-offset-4 hover:text-terre-fonce">{p.titre}</Link>
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                    {aides.length > 0 && (
                      <p>
                        <span className="font-[700]">A donné {aides.length} coup{aides.length > 1 ? 's' : ''} de pouce</span>, à {aides.map((a) => a.nom).join(', ')}.
                      </p>
                    )}
                    <div className="bg-papier rounded-xl p-4">
                      <p className="font-[700]">Ce dont nous avons besoin</p>
                      {sesBesoins.length > 0 ? (
                        <ul className="mt-2 space-y-1.5">
                          {sesBesoins.map((b) => (
                            <li key={b.id}>
                              <Link to="/besoins-pros" className="underline underline-offset-4 hover:text-terre-fonce">{b.description}</Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-olive/70">Aucun besoin publié pour l'instant.</p>
                      )}
                      <Link to={`/besoins-pros/publier?structure=${m.id}`} className="mt-3 inline-block font-semibold text-terre-fonce underline underline-offset-4">Publier un besoin</Link>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
        <p className="mt-8 text-olive/75 max-w-2xl">
          Mécénat : les membres sont mentionnés sobrement, avec les projets qu'ils soutiennent. Pas de publicité commerciale.
        </p>
      </Aplat>

      <Aplat couleur="sauge" interieur="py-16 grid md:grid-cols-[1.3fr_1fr] gap-8 items-end">
        <div>
          <h2 className="text-4xl sm:text-5xl">Votre structure partage ces valeurs ?</h2>
          <p className="mt-5 text-xl leading-relaxed">
            Rejoignez l'annuaire en adhérant à Ansanm, et montrez à la Guadeloupe ce que vous construisez.
          </p>
        </div>
        <div className="md:text-right">
          <Action to="/adherer?type=entreprise">Inscrire ma structure</Action>
        </div>
      </Aplat>
    </div>
  )
}
