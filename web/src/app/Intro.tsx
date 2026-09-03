export default function Intro() {
  const C = { green: "#4ade80", purple: "#a78bfa", coral: "#fb923c", blue: "#60a5fa" };
  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-semibold text-white/90">À quoi sert PALIER ?</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        PALIER est un outil d'aide à la décision tarifaire pour les trains à grande vitesse
        (TGV INOUI et OUIGO). Il transforme la grille de prix officielle de la SNCF en analyses
        concrètes : où se situent les prix, comment INOUI se positionne face à OUIGO, et à quel
        prix le revenu serait maximisé selon la sensibilité des voyageurs au prix.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.blue }}>
            La donnée
          </div>
          <p className="mt-1 text-sm leading-relaxed text-white/60">
            Toutes les analyses reposent sur la donnée ouverte officielle de la SNCF (jeu de données
            « Tarifs TGV INOUI et OUIGO », licence ODbL) : plus de 36 000 tarifs, pour chaque
            origine-destination, classe et profil tarifaire (Avantage, Réglementé…), avec un prix
            minimum et maximum.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.green }}>
            Ce que vous pouvez faire
          </div>
          <ul className="mt-1 space-y-1 text-sm leading-relaxed text-white/60">
            <li><span className="text-white/80">Explorer la grille</span> : trajet, classe et profil → la fourchette de prix réelle.</li>
            <li><span className="text-white/80">Comparer la concurrence</span> : l'écart de prix TGV INOUI vs OUIGO par trajet.</li>
            <li><span className="text-white/80">Simuler une politique de prix</span> : le curseur d'élasticité calcule le prix qui maximise le revenu.</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.coral }}>
          Comment lire le simulateur
        </div>
        <p className="mt-1 text-sm leading-relaxed text-white/60">
          L'élasticité-prix mesure à quel point la demande baisse quand le prix monte. Réglez le
          curseur : demande élastique (&gt; 1) → baisser le prix peut augmenter le revenu ;
          inélastique (&lt; 1) → le monter le peut. Le graphique trace la courbe de revenu et
          marque le prix optimal.
        </p>
      </div>

      <details className="mt-4 group">
        <summary className="cursor-pointer text-xs font-medium text-white/50 hover:text-white/80">
          Méthodologie &amp; limites
        </summary>
        <div className="mt-2 space-y-1 text-xs leading-relaxed text-white/40">
          <p><span style={{ color: C.green }}>Donnée réelle</span> : grille de prix et positionnement INOUI/OUIGO.</p>
          <p><span style={{ color: C.coral }}>Hypothèse</span> : l'élasticité (paramètre réglable). Estimer la vraie élasticité exigerait des données de demande appariées, non publiques.</p>
          <p>Tous les chiffres sont issus de calculs déterministes (aucune IA générative dans les résultats). Modèle démonstrateur à demande linéaire, distinct du moteur de yield management de production de la SNCF.</p>
          <p>Source : SNCF Open Data — jeu « tarifs-tgv-inoui-ouigo », licence ODbL.</p>
        </div>
      </details>
    </section>
  );
}
