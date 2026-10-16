import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { euros, nombre } from '../lib/paves.js'
import { Bouton, LigneProjet, Section } from '../components/Elements.jsx'

export default function Accueil() {
  const { projects, stats } = useData()
  const chiffres = [
    [euros(stats.totalPromis), 'promis aux projets'],
    [nombre(stats.paves), 'pavés posés'],
    [nombre(stats.projets), 'projets en cours'],
    [nombre(stats.membres), 'membres'],
  ]

  return (
    <div className="max-w-5xl mx-auto px-5">
      <section className="pt-16 sm:pt-28 max-w-3xl">
        <h1 className="text-[2.6rem] sm:text-7xl leading-[1.05]">
          Une autre façon de faire avancer la Guadeloupe : <em className="text-terre">pavé par pavé.</em>
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-gris leading-relaxed max-w-2xl">
          Ansanm est une association qui transforme l'envie d'agir en actions concrètes. Entreprises, associations
          et citoyens financent et soutiennent des projets qui créent de l'emploi et renforcent l'autonomie du territoire.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Bouton to="/contribuer" variante="terre">Poser mon pavé</Bouton>
          <Bouton to="/trace" variante="lien">Voir la Trace</Bouton>
          <Bouton to="/adherer" variante="lien">Adhérer</Bouton>
        </div>
      </section>

      <dl className="mt-20 grid grid-cols-2 sm:grid-cols-4 border-t border-ligne">
        {chiffres.map(([v, l], i) => (
          <div key={l} className={`py-6 ${i % 2 ? 'pl-5' : ''} sm:pl-5 sm:first:pl-0 ${i > 1 ? 'border-t sm:border-t-0' : ''} border-ligne sm:border-l sm:first:border-l-0`}>
            <dt className="sr-only">{l}</dt>
            <dd className="font-display text-3xl sm:text-4xl tabular-nums">{v}</dd>
            <dd className="text-sm text-gris mt-1">{l}</dd>
          </div>
        ))}
      </dl>

      <Section titre="Les projets en cours">
        <div className="border-b border-ligne">
          {projects.map((p) => <LigneProjet key={p.id} id={p.id} />)}
        </div>
      </Section>

      <Section className="grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl sm:text-3xl">Imiter le vivant</h2>
          <p className="mt-4 text-gris leading-relaxed">
            Comme dans une forêt, la diversité vaut mieux que la dépendance. Les projets se nourrissent les uns
            les autres, en cycles fermés : les ressources se succèdent comme les saisons.
          </p>
          <p className="mt-4 text-gris leading-relaxed">
            C'est un koudmen moderne : chacun vient poser sa pierre, avec ce qu'il a.
          </p>
        </div>
        <ol className="self-end text-lg border-t border-ligne">
          <li className="py-3 border-b border-ligne">Le <span className="font-display">jardin</span> nourrit la cuisine.</li>
          <li className="py-3 border-b border-ligne">La <span className="font-display">cuisine</span> récupère aussi les invendus des partenaires.</li>
          <li className="py-3 border-b border-ligne">Les restes retournent en <span className="font-display">compost</span> au jardin.</li>
        </ol>
      </Section>

      <Section>
        <p className="font-display text-3xl sm:text-4xl leading-tight max-w-3xl">
          100 % des dons vont aux projets. L'association vit de ses adhésions, et chaque membre a une voix.
        </p>
        <Link to="/regles" className="mt-6 inline-block underline hover:text-terre">Lire nos sept règles</Link>
      </Section>
    </div>
  )
}
