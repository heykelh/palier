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
          Prévois 3 minutes de lecture : à la fin, chaque bouton du site aura du sens.
        </p>
      </header>

      <div className="mt-6 rounded-xl border p-4" style={{ borderColor: C.blue + "33", background: C.blue + "11" }}>
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.blue }}>En une phrase</div>
        <p className="mt-1 text-sm leading-relaxed text-white/75">
          PALIER est un outil qui aide à fixer le bon prix des billets de train à grande vitesse (TGV),
          pour remplir les trains tout en gagnant le plus de revenu possible.
        </p>
      </div>

      <Section n="1" title="Le problème que ça résout" color={C.blue}>
        <p>
          Un billet de TGV n'a pas un prix fixe. Pour un même trajet, le prix change selon le moment
          où on réserve et le niveau de remplissage du train. C'est le même principe que les billets
          d'avion ou les chambres d'hôtel : réservé tôt, c'est moins cher ; à la dernière minute ou
          quand c'est plein, c'est plus cher.
        </p>
        <p>
          Derrière ça, des équipes (chez la SNCF, le métier s'appelle <strong className="text-white/80">Revenue
          Management et Pricing</strong>) décident chaque jour de ces prix. PALIER est une maquette qui
          montre comment on prend ces décisions, à partir des <strong className="text-white/80">vrais tarifs
          publics</strong> des TGV.
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
              et OUIGO. C'est juste le décor, pour situer les ordres de grandeur.</p>
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
              inélastique, on peut <em>monter</em> le prix. Joue avec le curseur, tu verras le point optimal
              se déplacer.</p>
          </div>
          <div>
            <div className="font-semibold text-white/80">d. Le positionnement INOUI vs OUIGO</div>
            <p>La comparaison de prix entre les deux offres de la SNCF sur le trajet choisi. Donnée réelle,
              utile pour voir qui est positionné où.</p>
          </div>
          <div>
            <div className="font-semibold text-white/80">e. Le module Yield management (allocation des places)</div>
            <p>C'est le cœur. Tu règles la capacité du train, la demande attendue et son incertitude.
              L'outil calcule alors <strong className="text-white/80">combien de places réserver à chaque
              palier de prix</strong>. Le graphique en barres montre cette répartition : les paliers chers
              reçoivent peu de places (on les « protège » pour les voyageurs de dernière minute prêts à
              payer), les paliers bas en reçoivent plus mais limités. La colonne « limite de résa » dit
              jusqu'où on ouvre la vente à chaque prix.</p>
          </div>
        </div>
      </Section>

      <Section n="4" title="Un exemple concret" color={C.coral}>
        <p>
          Train de 510 places, 420 voyageurs attendus. L'outil ne va pas brader 420 billets au prix le
          plus bas : il garde une part des places pour les ventes tardives, plus chères. Résultat : quelques
          places au tarif le plus bas, un gros bloc aux tarifs intermédiaires, et une réserve protégée pour
          le tarif fort. C'est contre-intuitif (on « refuse » parfois des clients bon marché), mais c'est
          exactement ce qui maximise le revenu total du train.
        </p>
      </Section>

      <Section n="5" title="Ce qui est réel, ce qui est simulé" color={C.amber}>
        <p>
          Pour rester honnête : <span style={{ color: C.green }}>la grille de prix et le positionnement
          INOUI/OUIGO sont des données réelles</span> (open data officiel SNCF).
          <span style={{ color: C.amber }}> L'élasticité, la demande, la capacité et sa variabilité sont
          des hypothèses</span> que tu règles toi-même avec les curseurs, car ces informations ne sont pas
          publiques. Les calculs, eux, sont exacts et reproductibles (notamment l'algorithme EMSR-b,
          méthode de référence du métier). C'est un <strong className="text-white/80">démonstrateur
          pédagogique</strong>, pas le système interne de la SNCF.
        </p>
      </Section>

      <Section n="6" title="D'où viennent les données" color={C.blue}>
        <p>
          Du jeu de données ouvert officiel de la SNCF « Tarifs TGV INOUI et OUIGO » (plus de 36 000 tarifs),
          sous licence ODbL. PALIER est un projet personnel de démonstration, non affilié à la SNCF.
        </p>
      </Section>

      <div className="mt-10 border-t border-white/10 pt-6">
        <Link href="/" className="inline-block rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: C.green + "22", color: C.green }}>
          Essayer le simulateur →
        </Link>
      </div>
    </main>
  );
}
