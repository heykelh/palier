"use client";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import Link from "next/link";
import data from "@/data/tarifs.json";
import { recommend, revenueCurve } from "@/lib/pricing";
import Intro from "./Intro";
import YieldLab from "./YieldLab";

type Row = {
  od: string; origine: string; destination: string;
  classe: string; operateur: string; prixMin: number; prixMax: number;
};
const ROWS = (data.rows as Row[]) ?? [];
const C = { green: "#4ade80", purple: "#a78bfa", coral: "#fb923c", amber: "#fbbf24", blue: "#60a5fa" };
const uniq = (a: string[]) => [...new Set(a)].filter(Boolean).sort();
const eur = (n: number) => `${n.toFixed(0)} \u20ac`;

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-4 ${className}`}>{children}</div>;
}
function Kpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wide text-white/40">{label}</div>
      <div className="mt-1 text-2xl font-semibold" style={{ color }}>{value}</div>
    </Card>
  );
}

export default function Page() {
  const ods = useMemo(() => uniq(ROWS.map((r) => r.od)), []);
  const [od, setOd] = useState(ods[0] ?? "");
  const forOd = useMemo(() => ROWS.filter((r) => r.od === od), [od]);
  const classes = useMemo(() => uniq(forOd.map((r) => r.classe)), [forOd]);
  const [classe, setClasse] = useState("");
  const cls = classes.includes(classe) ? classe : classes[0] ?? "";

  const sel = useMemo(() => forOd.filter((r) => r.classe === cls), [forOd, cls]);
  const inoui = sel.find((r) => /inoui/i.test(r.operateur));
  const ouigo = sel.find((r) => /ouigo/i.test(r.operateur));
  const ref = inoui ?? sel[0];
  const band: [number, number] = ref ? [ref.prixMin, ref.prixMax] : [10, 100];
  const mid = (band[0] + band[1]) / 2;

  const [elast, setElast] = useState(1.2);
  const [prixRef, setPrixRef] = useState(mid);
  useEffect(() => { setPrixRef((band[0] + band[1]) / 2); /* reset a chaque changement de selection */ // eslint-disable-next-line
  }, [od, cls]);

  const reco = recommend(prixRef, elast, band[0], band[1]);
  const curve = revenueCurve(prixRef, elast, band);

  const kpis = useMemo(() => {
    const spreads = ROWS.map((r) => r.prixMax - r.prixMin);
    const gaps: number[] = [];
    const byKey = new Map<string, Row[]>();
    for (const r of ROWS) {
      const k = r.od + "|" + r.classe;
      byKey.set(k, [...(byKey.get(k) ?? []), r]);
    }
    byKey.forEach((rs) => {
      const i = rs.find((r) => /inoui/i.test(r.operateur));
      const o = rs.find((r) => /ouigo/i.test(r.operateur));
      if (i && o) gaps.push(i.prixMin - o.prixMin);
    });
    const avg = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
    return {
      nbOd: ods.length,
      nbRows: ROWS.length,
      reseauMin: Math.min(...ROWS.map((r) => r.prixMin)),
      reseauMax: Math.max(...ROWS.map((r) => r.prixMax)),
      spread: avg(spreads),
      gap: avg(gaps),
    };
  }, [ods.length]);

  const sensColor = reco.sens === "hausse" ? C.green : reco.sens === "baisse" ? C.coral : C.amber;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            PALIER <span className="text-white/30 font-light">/ simulateur tarifaire TGV</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Analyse pricing et optimisation de grilles sur la base des prix TGV INOUI / OUIGO.
          </p>
        </div>
        <Link href="/guide" className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5">
          Guide d'utilisation
        </Link>
      </header>

      <Intro />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label="OD couvertes" value={String(kpis.nbOd)} color={C.blue} />
        <Kpi label="Lignes tarif." value={String(kpis.nbRows)} color={C.blue} />
        <Kpi label="Prix mini réseau" value={eur(kpis.reseauMin)} color={C.green} />
        <Kpi label="Prix maxi réseau" value={eur(kpis.reseauMax)} color={C.coral} />
        <Kpi label="Amplitude moy." value={eur(kpis.spread)} color={C.amber} />
        <Kpi label="Écart INOUI-OUIGO" value={eur(kpis.gap)} color={C.purple} />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="text-sm font-medium text-white/80">Sélection</div>
          <label className="mt-3 block text-xs text-white/40">Origine → Destination</label>
          <select value={od} onChange={(e) => setOd(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
            {ods.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <label className="mt-3 block text-xs text-white/40">Classe</label>
          <select value={cls} onChange={(e) => setClasse(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="mt-5 flex items-center justify-between text-xs text-white/40">
            <span>Élasticité-prix (hypothèse)</span><span className="text-white/70">{elast.toFixed(1)}</span>
          </div>
          <input type="range" min={0.5} max={2.5} step={0.1} value={elast}
            onChange={(e) => setElast(+e.target.value)} className="mt-1 w-full" />

          <div className="mt-4 flex items-center justify-between text-xs text-white/40">
            <span>Prix de référence</span><span className="text-white/70">{eur(prixRef)}</span>
          </div>
          <input type="range" min={Math.floor(band[0])} max={Math.ceil(band[1])} step={1} value={prixRef}
            onChange={(e) => setPrixRef(+e.target.value)} className="mt-1 w-full" />
          <div className="mt-1 text-[11px] text-white/30">Fourchette grille : {eur(band[0])} – {eur(band[1])}</div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <div className="text-sm font-medium text-white/80">Courbe de revenu &amp; prix optimal</div>
            <div className="text-[11px] text-white/30">revenu en indice (volume normalisé)</div>
          </div>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff12" />
                <XAxis dataKey="p" type="number" domain={["dataMin", "dataMax"]}
                  tick={{ fill: "#ffffff66", fontSize: 11 }} tickFormatter={(v) => `${v}€`} />
                <YAxis tick={{ fill: "#ffffff66", fontSize: 11 }} width={44} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #ffffff22", borderRadius: 8, fontSize: 12 }}
                  labelFormatter={(v) => `Prix ${v} €`} formatter={(v: number) => [v.toFixed(0), "Revenu"]} />
                <Line type="monotone" dataKey="revenue" stroke={C.blue} strokeWidth={2} dot={false} />
                <ReferenceLine x={+reco.prixRecommande.toFixed(1)} stroke={C.green} strokeDasharray="4 4"
                  label={{ value: "optimal", fill: C.green, fontSize: 11, position: "top" }} />
                <ReferenceLine x={+prixRef.toFixed(1)} stroke={C.coral} strokeDasharray="2 2"
                  label={{ value: "réf.", fill: C.coral, fontSize: 11, position: "insideTopRight" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="text-sm font-medium text-white/80">Recommandation</div>
          <div className="mt-3 text-3xl font-bold" style={{ color: sensColor }}>{eur(reco.prixRecommande)}</div>
          <div className="mt-1 text-sm capitalize" style={{ color: sensColor }}>{reco.sens}</div>
          <div className="mt-3 text-xs text-white/50">
            Prix optimal théorique {eur(reco.prixOptimal)} · impact revenu {reco.gainPct >= 0 ? "+" : ""}
            {reco.gainPct.toFixed(1)} %
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-white/80">Positionnement (donnée réelle)</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/50">TGV INOUI</span>
              <span>{inoui ? `${eur(inoui.prixMin)} – ${eur(inoui.prixMax)}` : "—"}</span></div>
            <div className="flex justify-between"><span className="text-white/50">OUIGO</span>
              <span>{ouigo ? `${eur(ouigo.prixMin)} – ${eur(ouigo.prixMax)}` : "—"}</span></div>
            {inoui && ouigo && (
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-white/50">Écart mini</span>
                <span style={{ color: C.purple }}>{eur(inoui.prixMin - ouigo.prixMin)}</span></div>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-white/80">Grille de l'OD</div>
          <div className="mt-2 space-y-1 text-xs">
            {sel.map((r, i) => (
              <div key={i} className="flex justify-between text-white/60">
                <span>{r.operateur || "—"} · {r.classe}</span>
                <span className="text-white/80">{eur(r.prixMin)} – {eur(r.prixMax)}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {ref && <YieldLab prixMin={band[0]} prixMax={band[1]} od={od} classe={cls} />}

      <footer className="mt-6 text-[11px] leading-relaxed text-white/30">
        <p><span style={{ color: C.green }}>Donnée réelle</span> : grille de prix et positionnement INOUI/OUIGO (SNCF Open Data, {data.source}).
        <span style={{ color: C.amber }}> Hypothèse paramétrable</span> : l'élasticité-prix, ainsi que la demande, la capacité et la variabilité du module yield. L'allocation suit l'algorithme EMSR-b, méthode de référence du revenue management. Prix optimal <code>p* = p_ref·(1+ε)/(2ε)</code>. Calcul 100 % déterministe. Modèle démonstrateur, distinct du moteur de yield de production SNCF.</p>
      </footer>
    </main>
  );
}
