import { Link } from 'react-router-dom'
import { useData } from '../lib/store.jsx'
import { euros, nombre } from '../lib/paves.js'
import { Bouton, LigneProjet, Section } from '../components/Elements.jsx'

const GESTES = [
  ['Choisis un projet qui te parle.', 'Alimentation, terre, artisanat : tu décides où va ton soutien.'],
  ['Pose ton pavé.', 'De l’argent, du matériel, du temps ou une compétence. Tout compte.'],
  ['Vois la route avancer.', 'Chaque contribution apparaît sur la Trace, avec ton nom et la raison de ton geste.'],
]

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
        <h1 className="text-[2.6rem] sm:text-7xl leading-[1.05]">Une autre façon de faire avancer la Guadeloupe.</h1>
        <p className="mt-5 font-display italic text-3xl sm:text-4xl text-terre-fonce">Pavé par pavé, ansanm.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Bouton to="/contribuer" variante="terre">Poser mon pavé</Bouton>
          <Bouton to="/trace" variante="lien">Découvrir la Trace</Bouton>
        </div>
      </section>

      <Section titre="On a tous envie que ça bouge." className="max-w-2xl">
        <div className="space-y-4 text-lg text-gris leading-relaxed">
          <p>
            On en parle au marché, en famille, sur les réseaux. On voit les terrains en friche, les fruits qui tombent
            sans être ramassés, les petits producteurs qui s'épuisent, les jeunes qui partent faute de travail.
          </p>
          <p className="text-encre">
            L'envie d'agir est là. Ce qui manque, c'est un chemin concret pour la transformer en quelque chose de réel.
          </p>
        </div>
      </Section>

      <Section titre="Ansanm, c'est un koudmen pour tout un pays." className="max-w-2xl">
        <div className="space-y-4 text-lg text-gris leading-relaxed">
          <p>
            Autrefois, quand quelqu'un construisait sa case, les voisins venaient donner un coup de main. Chacun
            apportait ce qu'il pouvait : ses bras, ses outils, un repas. Et le soir, la case était debout.
          </p>
          <p>
            Ansanm reprend cet esprit. Citoyens, entreprises et associations financent et soutiennent ensemble des
            projets qui créent de l'emploi et rendent la Guadeloupe plus autonome. Chaque contribution devient un pavé.
            Et pavé après pavé, on trace la route.
          </p>
        </div>
      </Section>

      <Section titre="Trois gestes simples.">
        <ol className="grid sm:grid-cols-3 gap-8 sm:gap-10">
          {GESTES.map(([titre, texte], i) => (
            <li key={titre} className="border-t border-ligne pt-5">
              <span className="font-display text-4xl text-terre-fonce">{i + 1}</span>
              <p className="mt-3 font-display text-xl">{titre}</p>
              <p className="mt-2 text-gris leading-relaxed">{texte}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section titre="Les traces en cours">
        <div className="border-b border-ligne">
          {projects.map((p) => <LigneProjet key={p.id} id={p.id} />)}
        </div>
      </Section>

      <Section className="grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl sm:text-3xl">Comme la nature, rien ne se perd.</h2>
          <p className="mt-4 text-gris leading-relaxed">
            Nos projets ne sont pas des initiatives isolées : ils se nourrissent les uns les autres, comme les arbres
            d'une même forêt.
          </p>
        </div>
        <ol className="self-end text-lg border-t border-ligne">
          <li className="py-3 border-b border-ligne">Le <span className="font-display">jardin</span> nourrit la cuisine.</li>
          <li className="py-3 border-b border-ligne">La <span className="font-display">cuisine</span> transforme les fruits et sauve les invendus de nos partenaires.</li>
          <li className="py-3 border-b border-ligne">Les restes repartent en <span className="font-display">compost</span> au jardin.</li>
        </ol>
      </Section>

      <dl className="mt-20 grid grid-cols-2 sm:grid-cols-4 border-t border-ligne">
        {chiffres.map(([v, l], i) => (
          <div key={l} className={`py-6 ${i % 2 ? 'pl-5' : ''} sm:pl-5 sm:first:pl-0 ${i > 1 ? 'border-t sm:border-t-0' : ''} border-ligne sm:border-l sm:first:border-l-0`}>
            <dt className="sr-only">{l}</dt>
            <dd className="font-display text-3xl sm:text-4xl tabular-nums">{v}</dd>
            <dd className="text-sm text-gris mt-1">{l}</dd>
          </div>
        ))}
      </dl>

      <Section>
        <h2 className="text-3xl sm:text-5xl leading-tight">100 % de ton don va au projet.</h2>
        <p className="mt-5 text-lg text-gris leading-relaxed max-w-2xl">
          Pas un centime ne sert à faire tourner l'association : ce sont les adhésions qui la font vivre. Ton pavé va
          entièrement là où tu l'as posé.
        </p>
        <Link to="/regles" className="mt-6 inline-block underline hover:text-terre-fonce">Lire nos règles</Link>
      </Section>
    </div>
  )
}
