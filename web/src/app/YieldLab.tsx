"use client";
import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from "recharts";
import { emsrb, genererPaliers } from "@/lib/yield";

const C = { green: "#4ade80", purple: "#a78bfa", coral: "#fb923c", amber: "#fbbf24", blue: "#60a5fa" };
const eur = (n: number) => `${n.toFixed(0)} \u20ac`;

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-4 ${className}`}>{children}</div>;
}

export default function YieldLab({ prixMin, prixMax, od, classe }: { prixMin: number; prixMax: number; od: string; classe: string }) {
  const [nPaliers, setNPaliers] = useState(5);
  const [capacite, setCapacite] = useState(510);
  const [demande, setDemande] = useState(420);
  const [variabilite, setVariabilite] = useState(0.3);

  const { rows, revenu, demandeTotale } = useMemo(() => {
    const paliers = genererPaliers(prixMin, prixMax, nPaliers, demande, variabilite);
    return emsrb(paliers, capacite);
  }, [prixMin, prixMax, nPaliers, capacite, demande, variabilite]);

  const remplissage = Math.min(100, (Math.min(demande, capacite) / capacite) * 100);
  const surDemande = demande > capacite;

  return (
    <section className="mt-4">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white/90">Yield management, allocation des places (EMSR-b)</h2>
        <p className="mt-1 text-sm text-white/50">
          Avant l'ouverture des ventes : repartition de la capacite du train entre paliers tarifaires,
          selon la sensibilite prix et la demande attendue. Trajet {od}, classe {classe}.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="text-sm font-medium text-white/80">Parametres du train</div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/40">
            <span>Nombre de paliers</span><span className="text-white/70">{nPaliers}</span>
          </div>
          <input type="range" min={3} max={8} step={1} value={nPaliers} onChange={(e) => setNPaliers(+e.target.value)} className="mt-1 w-full" />

          <div className="mt-4 flex items-center justify-between text-xs text-white/40">
            <span>Capacite (places)</span><span className="text-white/70">{capacite}</span>
          </div>
          <input type="range" min={200} max={1000} step={10} value={capacite} onChange={(e) => setCapacite(+e.target.value)} className="mt-1 w-full" />

          <div className="mt-4 flex items-center justify-between text-xs text-white/40">
            <span>Demande totale attendue</span><span className="text-white/70">{demande}</span>
          </div>
          <input type="range" min={50} max={1200} step={10} value={demande} onChange={(e) => setDemande(+e.target.value)} className="mt-1 w-full" />

          <div className="mt-4 flex items-center justify-between text-xs text-white/40">
            <span>Variabilite de la demande</span><span className="text-white/70">{Math.round(variabilite * 100)} %</span>
          </div>
          <input type="range" min={0.1} max={0.6} step={0.05} value={variabilite} onChange={(e) => setVariabilite(+e.target.value)} className="mt-1 w-full" />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-white/40">Revenu espere</div>
              <div className="mt-1 text-xl font-semibold" style={{ color: C.green }}>{eur(revenu)}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-white/40">Taux de remplissage</div>
              <div className="mt-1 text-xl font-semibold" style={{ color: remplissage > 90 ? C.coral : C.blue }}>
                {remplissage.toFixed(0)} %
              </div>
            </div>
          </div>
          {surDemande && (
            <p className="mt-3 text-[11px] leading-relaxed" style={{ color: C.amber }}>
              Demande ({demande}) superieure a la capacite ({capacite}) : train sous contrainte, l'arbitrage
              entre paliers devient critique. C'est le cas ou le yield management cree le plus de valeur.
            </p>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <div className="text-sm font-medium text-white/80">Places allouees par palier</div>
            <div className="text-[11px] text-white/30">du tarif le plus eleve au plus bas</div>
          </div>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff12" />
                <XAxis dataKey="nom" tick={{ fill: "#ffffff66", fontSize: 11 }}
                  tickFormatter={(v, i) => `${v} (${eur(rows[i]?.prix ?? 0)})`} interval={0} />
                <YAxis tick={{ fill: "#ffffff66", fontSize: 11 }} width={36} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #ffffff22", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number, _n, p) => [`${v} places (demande ${p.payload.demande})`, `${p.payload.nom} a ${eur(p.payload.prix)}`]} />
                <Bar dataKey="alloc" radius={[4, 4, 0, 0]}>
                  {rows.map((_, i) => <Cell key={i} fill={[C.green, C.blue, C.purple, C.amber, C.coral][i % 5]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-xs">
              <thead className="bg-white/[0.04] text-white/50">
                <tr>
                  <th className="px-3 py-2 text-left">Palier</th>
                  <th className="px-3 py-2 text-right">Prix</th>
                  <th className="px-3 py-2 text-right">Demande</th>
                  <th className="px-3 py-2 text-right">Places allouees</th>
                  <th className="px-3 py-2 text-right">Limite de resa</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.nom} className="border-t border-white/5 text-white/70">
                    <td className="px-3 py-2">{r.nom}</td>
                    <td className="px-3 py-2 text-right">{eur(r.prix)}</td>
                    <td className="px-3 py-2 text-right">{r.demande}</td>
                    <td className="px-3 py-2 text-right font-medium text-white/90">{r.alloc}</td>
                    <td className="px-3 py-2 text-right">{r.bl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
