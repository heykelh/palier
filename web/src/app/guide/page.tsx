import Link from "next/link";

export const metadata = {
  title: "Guide d'utilisation - PALIER",
  description: "Comprendre et utiliser PALIER, même sans aucune connaissance en pricing.",
};

const C = { green: "#4ade80", purple: "#a78bfa", coral: "#fb923c", amber: "#fbbf24", blue: "#60a5fa" };

function Section({ n, title, color, children }: { n: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{ background: color + "22", color }}>{n}</span>
        <h2 className="text-xl font-semibold text-white/90">{title}</h2>
      </div>
      <div className="mt-3 space-y-3 pl-10 text-sm leading-relaxed text-white/60">{children}</div>
    </section>
  );
}

function Term({ word, children }: { word: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="text-sm font-semibold text-white/85">{word}</div>
      <div className="mt-1 text-sm leading-relaxed text-white/55">{children}</div>
    </div>
  );
}

export default function Guide() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/" className="text-sm text-white/40 hover:text-white/80">← Retour au simulateur</Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Guide d'utilisation</h1>
        <p className="mt-2 text-base text-white/60">
          Cette page explique, sans aucun prérequis, ce qu'est PALIER et comment s'en servir.
          Prévois 4 minutes de lecture : à la fin, chaque bouton du site aura du sens.
        </p>
      </header>

      <div className="mt-6 rounded-xl border p-4" style={{ borderColor: C.blue + "33", background: C.blue + "11" }}>
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.blue }}>En une phrase</div>
        <p className="mt-1 text-sm leading-relaxed text-white/75">
          PALIER est un outil qui aide à fixer le bon prix des billets de train à grande vitesse (TGV),
          pour remplir les trains tout en gagnant le plus de revenu possible.
        </p>
      </div>

      <div className="mt-4 rounded-xl border p-4" style={{ borderColor: C.green + "33", background: C.green + "11" }}>
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.green }}>Prise en main en 3 étapes</div>
        <ol className="mt-2 space-y-1 text-sm leading-relaxed text-white/75">
          <li><strong className="text-white/90">1.</strong> Choisis un trajet et une classe en haut du site.</li>
          <li><strong className="text-white/90">2.</strong> Bouge les curseurs (élasticité, capacité, demande) et observe les graphiques réagir.</li>
          <li><strong className="text-white/90">3.</strong> Lis les recommandations : prix optimal et répartition des places par tarif.</li>
        </ol>
      </div>

      <Section n="1" title="Le problème que ça résout" color={C.blue}>
        <p>
          Un billet de TGV n'a pas un prix fixe. Pour un même trajet, le prix change selon le moment
          où on réserve et le remplissage du train. C'est le même principe que les billets d'avion ou
          les chambres d'hôtel : réservé tôt, c'est moins cher ; à la dernière minute ou quand c'est
          plein, c'est plus cher.
        </p>
        <p>
          Des équipes décident chaque jour de ces prix. Chez la SNCF, le métier s'appelle
          <strong className="text-white/80"> Revenue Management et Pricing</strong>. PALIER est une
          maquette qui montre comment on prend ces décisions, à partir des
          <strong className="text-white/80"> vrais tarifs publics</strong> des TGV.
        </p>
      </Section>

      <Section n="2" title="Trois idées simples à avoir en tête" color={C.purple}>
        <p>Avant de toucher au site, trois mots suffisent :</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Term word="Élasticité-prix">
            Est-ce que les gens achètent moins quand le prix monte ? Si oui beaucoup, la demande est
            « élastique ». Si le prix ne change presque rien (ex. un voyageur d'affaires pressé),
            elle est « inélastique ».
          </Term>
          <Term word="Palier tarifaire">
            Les différents prix proposés pour un même train : les premières places pas chères, puis
            de plus en plus cher à mesure que le train se remplit. Chaque marche de prix est un palier.
          </Term>
          <Term word="Yield management">
            L'art de décider combien de places vendre à chaque palier pour remplir le train ET
            maximiser le revenu. Trop de places bradées = on perd de l'argent ; trop peu = le train
            part à moitié vide.
          </Term>
        </div>
      </Section>

      <Section n="3" title="Comment lire chaque partie du site" color={C.green}>
        <p>Le site principal se parcourt de haut en bas. Voici à quoi sert chaque bloc.</p>
        <div className="space-y-4">
          <div>
            <div className="font-semibold text-white/80">a. Les chiffres clés (en haut)</div>
            <p>Une vue d'ensemble du réseau : prix le plus bas, le plus haut, écart moyen entre TGV INOUI
              et OUIGO. C'est le décor, pour situer les ordres de grandeur.</p>
          </div>
          <div>
            <div className="font-semibold text-white/80">b. La sélection (trajet + classe)</div>
            <p>Choisis un trajet (ex. Paris → Lyon) et une classe. Tout le reste du site se met à jour
              pour ce choix. C'est ton point de départ.</p>
          </div>
          <div>
            <div className="font-semibold text-white/80">c. Le simulateur de prix (courbe de revenu)</div>
            <p>Un curseur « élasticité » que tu bouges. La courbe montre le revenu selon le prix, et marque
              le <span style={{ color: C.green }}>prix optimal</span>. Règle à retenir : si la demande est
              élastique, <em>baisser</em> le prix peut rapporter plus (plus de voyageurs) ; si elle est
              inélastique, on peut <em>monter</em> le prix.</p>
          </div>
          <div>
            <div className="font-semibold text-white/80">d. Le positionnement INOUI vs OUIGO</div>
            <p>La comparaison de prix entre les deux offres de la SNCF sur le trajet choisi. Donnée réelle,
              utile pour voir qui est positionné où.</p>
          </div>
          <div>
            <div className="font-semibold text-white/80">e. Le module Yield management (allocation des places)</div>
            <p>Le cœur de l'outil. Tu règles la capacité du train, la demande attendue et son incertitude.
              L'outil calcule <strong className="text-white/80">combien de places réserver à chaque palier
              de prix</strong>. Le détail du « comment » est juste en dessous.</p>
          </div>
        </div>
      </Section>

      <Section n="4" title="Comment l'outil répartit les places : EMSR-b" color={C.coral}>
        <p>
          Le module d'allocation utilise un algorithme qui s'appelle <strong className="text-white/80">EMSR-b</strong>
          (de l'anglais <em>Expected Marginal Seat Revenue</em>, « revenu marginal espéré par siège »). C'est
          la méthode de référence du revenue management, utilisée dans l'aérien et le ferroviaire depuis les
          années 1990. Voici l'idée, sans mathématiques.
        </p>
        <p>
          <strong className="text-white/80">La question qu'il se pose :</strong> pour chaque place encore libre,
          vaut-il mieux la vendre tout de suite à bas prix, ou la garder au cas où un client prêt à payer
          cher se présente plus tard ?
        </p>
        <p>
          <strong className="text-white/80">Son raisonnement :</strong> il compare un revenu <em>sûr</em>
          (vendre maintenant, moins cher) à un revenu <em>probable</em> (garder la place pour la vendre plus
          cher, si la demande se confirme). Il garde la place pour le tarif élevé <strong className="text-white/80">tant
          que le gain espéré reste supérieur au prix bas garanti</strong>. Dès que ce n'est plus rentable, il
          ouvre la place au tarif inférieur. Comme la demande future est incertaine, il s'appuie sur une loi
          de probabilité (la fameuse « courbe en cloche ») : plus la demande attendue en haut tarif est forte
          et sûre, plus il protège de places.
        </p>
        <p>
          <strong className="text-white/80">Le « b » :</strong> il existe deux variantes. EMSR-b (celle utilisée
          ici) regroupe tous les paliers chers en un seul bloc avec un tarif moyen, ce qui donne de meilleurs
          résultats que la version « a » qui les traite un par un.
        </p>
        <p><strong className="text-white/80">Ce qu'il te renvoie</strong>, visible dans le module :</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><span style={{ color: C.purple }}>Niveau de protection</span> : combien de places sont gardées pour les tarifs élevés.</li>
          <li><span style={{ color: C.blue }}>Limite de réservation</span> : jusqu'où la vente est ouverte à chaque palier.</li>
          <li><span style={{ color: C.green }}>Allocation</span> : le nombre de places par palier (leur somme égale la capacité du train).</li>
        </ul>
      </Section>

      <Section n="5" title="Un exemple concret" color={C.amber}>
        <p>
          Train de 510 places, 420 voyageurs attendus. L'outil ne va pas brader 420 billets au prix le
          plus bas : il garde une part des places pour les ventes tardives, plus chères. Résultat : quelques
          places au tarif le plus bas, un gros bloc aux tarifs intermédiaires, et une réserve protégée pour
          le tarif fort. C'est contre-intuitif (on « refuse » parfois des clients bon marché), mais c'est
          exactement ce qui maximise le revenu total du train.
        </p>
      </Section>

      <Section n="6" title="Ce qui est réel, ce qui est simulé" color={C.green}>
        <p>
          Pour rester honnête : <span style={{ color: C.green }}>la grille de prix et le positionnement
          INOUI/OUIGO sont des données réelles</span> (open data officiel SNCF).
          <span style={{ color: C.amber }}> L'élasticité, la demande, la capacité et son incertitude sont
          des hypothèses</span> que tu règles toi-même avec les curseurs, car ces informations ne sont pas
          publiques. Les calculs, eux, sont exacts et reproductibles (dont l'algorithme EMSR-b). C'est un
          <strong className="text-white/80"> démonstrateur pédagogique</strong>, pas le système interne de la SNCF.
        </p>
      </Section>

      <Section n="7" title="D'où viennent les données" color={C.blue}>
        <p>
          Du jeu de données ouvert officiel de la SNCF « Tarifs TGV INOUI et OUIGO » (plus de 36 000 tarifs),
          sous licence ODbL. PALIER est un projet personnel de démonstration, non affilié à la SNCF.
        </p>
      </Section>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white/90">Glossaire express</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Term word="Capacité">Le nombre total de places à vendre dans le train.</Term>
          <Term word="Niveau de protection">Les places mises de côté pour les clients à tarif élevé, au lieu de les vendre tout de suite au tarif bas.</Term>
          <Term word="Limite de réservation">Le nombre maximum de places qu'on accepte de vendre à un palier donné.</Term>
          <Term word="EMSR-b">L'algorithme standard qui calcule ces protections et limites à partir de la demande attendue et de son incertitude.</Term>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <Link href="/" className="inline-block rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: C.green + "22", color: C.green }}>
          Essayer le simulateur →
        </Link>
      </div>
    </main>
  );
}
