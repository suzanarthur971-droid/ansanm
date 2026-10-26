import { Link } from 'react-router-dom'
import { useData, useProjet } from '../lib/store.jsx'
import { euros, nombre } from '../lib/paves.js'
import MiniTrace from '../components/MiniTrace.jsx'
import { Action, Aplat, Exemple, Pierre, Statut, TraceHero } from '../components/Nouveau.jsx'

const GESTES = [
  ['Choisis un projet qui te parle.', 'Alimentation, terre, artisanat : tu décides où va ton soutien.', '#C57B57'],
  ['Pose ton pavé.', 'De l’argent, du matériel, du temps ou une compétence. Tout compte.', '#A8BFA1'],
  ['Vois la route avancer.', 'Chaque contribution apparaît sur la Trace, avec ton nom et la raison de ton geste.', '#E8DCC4'],
]

const dateCourte = (d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

function DalleProjet({ id }) {
  const { projet, promis, progression, paves } = useProjet(id)
  const { koudmen } = useData()
  const prochain = koudmen.filter((k) => k.project_id === id).sort((a, b) => a.date.localeCompare(b.date))[0]
  return (
    <Link to={`/projets/${id}`} className="group block bg-beige rounded-[22px] px-5 sm:px-8 pt-6 pb-4 hover:bg-[#E2D4B8] transition-colors">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Statut statut={projet.statut} />
        {projet.exemple && <Exemple />}
      </div>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-3xl sm:text-4xl">{projet.titre}</h3>
        <p className="text-[17px]">
          {projet.statut === 'actif'
            ? <>{paves.length} pavés posés</>
            : <><strong className="font-[750]">{euros(promis)}</strong> sur {euros(projet.objectif_montant)}, {paves.length} pavés</>}
        </p>
      </div>
      {prochain && (
        <p className="mt-2 font-semibold text-terre-fonce first-letter:uppercase">
          Prochain koudmen : {dateCourte(prochain.date)}, {prochain.titre.toLowerCase()}
        </p>
      )}
      <p className="mt-2 text-lg text-olive/80 max-w-xl">{projet.accroche}</p>
      <div className="mt-2 -mx-2"><MiniTrace paves={paves} progression={progression} chemin={['#F5F0E6', '#D3BE96']} /></div>
    </Link>
  )
}

export default function Accueil() {
  const { projects, contributions, stats } = useData()

  return (
    <div className="nouveau">
      {/* Bandeau : le titre, puis la Trace qui traverse l'écran */}
      <section className="bg-olive text-beige overflow-hidden">
        <div className="max-w-6xl mx-auto md:px-8 grid md:grid-cols-[1.15fr_1fr] md:items-end md:min-h-[560px]">
          <div className="px-5 md:px-0 pt-14 md:pt-24 md:pb-24">
            <h1 className="text-[3.1rem] sm:text-[5.2rem]">Une autre façon de faire avancer la Guadeloupe.</h1>
            <p className="mt-6 text-2xl sm:text-3xl text-sauge font-semibold">Pavé par pavé, ansanm.</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Action to="/contribuer" sombre>Poser mon pavé</Action>
              <Action to="/trace" discret>Découvrir la Trace</Action>
            </div>
          </div>
          <div className="h-72 md:h-full md:min-h-[560px] mt-4 md:mt-0 md:-mr-[30vw]">
            <TraceHero paves={contributions} />
          </div>
        </div>
      </section>

      <Aplat couleur="beige" interieur="py-20 sm:py-28 grid md:grid-cols-[1fr_1.15fr] gap-10 md:gap-16">
        <h2 className="text-4xl sm:text-6xl">On a tous envie que ça bouge.</h2>
        <div className="space-y-5 text-xl leading-relaxed">
          <p>
            On en parle au marché, en famille, sur les réseaux. On voit les terrains en friche, les fruits qui tombent
            sans être ramassés, les petits producteurs qui s'épuisent, les jeunes qui partent faute de travail.
          </p>
          <p className="font-[650]">
            L'envie d'agir est là. Ce qui manque, c'est un chemin concret pour la transformer en quelque chose de réel.
          </p>
        </div>
      </Aplat>

      <Aplat interieur="py-20 sm:py-28 grid md:grid-cols-[1fr_1.15fr] gap-10 md:gap-16">
        <div>
          <h2 className="text-4xl sm:text-6xl">Un koudmen pour tout un pays.</h2>
          <p className="mt-8 text-2xl font-semibold text-terre-fonce" lang="gcf">Ansanm nou pli fò</p>
          <p className="text-olive/75">Ensemble, nous sommes plus forts</p>
        </div>
        <div className="space-y-5 text-xl leading-relaxed">
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
      </Aplat>

      <Aplat couleur="olive" interieur="py-20 sm:py-28">
        <h2 className="text-4xl sm:text-6xl">Trois gestes simples.</h2>
        <ol className="mt-12 grid md:grid-cols-3 gap-10">
          {GESTES.map(([titre, texte, couleur], i) => (
            <li key={titre} className="flex md:flex-col gap-5">
              <Pierre n={i + 1} couleur={couleur} className="w-16 h-14 md:w-24 md:h-20 text-3xl md:text-5xl text-olive-nuit" />
              <div>
                <p className="text-2xl font-[700] leading-tight">{titre}</p>
                <p className="mt-2 text-lg text-beige/80 leading-relaxed">{texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </Aplat>

      <Aplat interieur="py-20 sm:py-28">
        <h2 className="text-4xl sm:text-6xl">Déjà actifs : viens aider</h2>
        <p className="mt-4 text-xl leading-relaxed max-w-2xl">Ces projets existent et tournent. Ils ont besoin de bras, d'outils et de temps, dès maintenant.</p>
        <div className="mt-8 space-y-4">
          {projects.filter((p) => p.statut === 'actif').map((p) => <DalleProjet key={p.id} id={p.id} />)}
        </div>

        <h2 className="mt-20 text-4xl sm:text-6xl">En construction : les cagnottes</h2>
        <p className="mt-4 text-xl leading-relaxed max-w-2xl">Ces projets n'existent pas encore. Chaque pavé les rapproche de leur lancement.</p>
        <div className="mt-8 space-y-4">
          {projects.filter((p) => p.statut !== 'actif').map((p) => <DalleProjet key={p.id} id={p.id} />)}
        </div>
        <p className="mt-10 text-2xl sm:text-3xl leading-snug max-w-4xl font-[600]">
          Déjà {euros(stats.totalPromis)} promis, {nombre(stats.paves)} pavés posés, {nombre(stats.projets)} projets en
          cours et {nombre(stats.membres)} membres.
          <span className="block mt-2 text-lg font-normal text-olive/70">Chiffres d'exemple : en phase de lancement, les projets, pavés et membres affichés sont fictifs.</span>
        </p>
      </Aplat>

      <Aplat couleur="sauge" interieur="py-20 sm:py-28 grid md:grid-cols-[1fr_1.15fr] gap-10 md:gap-16 items-start">
        <h2 className="text-4xl sm:text-6xl">Comme la nature, rien ne se perd.</h2>
        <div className="text-xl leading-relaxed space-y-5">
          <p className="text-2xl sm:text-3xl font-[650] leading-snug">
            Le jardin nourrit la cuisine. La cuisine transforme les fruits et sauve les invendus de nos partenaires.
            Les restes repartent en compost au jardin.
          </p>
          <p>
            Nos projets ne sont pas des initiatives isolées : ils se nourrissent les uns les autres, comme les arbres
            d'une même forêt.
          </p>
        </div>
      </Aplat>

      <Aplat couleur="brique" interieur="py-20 sm:py-28">
        <h2 className="text-5xl sm:text-8xl max-w-[12ch]">100 % de ton don va au projet.</h2>
        <p className="mt-8 text-xl leading-relaxed max-w-2xl text-papier/85">
          Pas un centime ne sert à faire tourner l'association : ce sont les adhésions qui la font vivre. Ton pavé va
          entièrement là où tu l'as posé.
        </p>
        <Action to="/regles" discret className="mt-8">Lire nos règles</Action>
      </Aplat>

      <Aplat couleur="beige" interieur="py-16 sm:py-20 grid md:grid-cols-[1fr_1.3fr] gap-10 items-center">
        <div>
          <h2 className="text-4xl sm:text-5xl">Écris la phrase que la Guadeloupe portera.</h2>
          <p className="mt-5 text-xl leading-relaxed">
            Propose un slogan pour nos t-shirts et vote pour tes préférés. La marge de chaque t-shirt va dans la
            cagnotte des projets.
          </p>
          <Action to="/t-shirts" className="mt-8">Voir les slogans</Action>
        </div>
        <img src="/tshirt-ansanm.jpg" alt="T-shirt blanc Ansanm, face et dos" className="w-full rounded-[22px]" width="1400" height="933" loading="lazy" />
      </Aplat>
    </div>
  )
}
