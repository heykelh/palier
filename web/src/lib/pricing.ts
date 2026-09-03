// Coeur Revenue Management - deterministe. Portage exact de pricing.py.
export function optimalPrice(prixRef: number, e: number): number {
  return (prixRef * (1 + e)) / (2 * e); // independant du volume
}
export function demandRevenue(prixRef: number, qRef: number, e: number, p: number) {
  const b = (e * qRef) / prixRef;
  const a = qRef * (1 + e);
  const d = Math.max(a - b * p, 0);
  return { d, r: p * d };
}
export function recommend(prixRef: number, e: number, min: number, max: number, qRef = 100) {
  const pStar = optimalPrice(prixRef, e);
  const pClip = Math.min(Math.max(pStar, min), max); // borne a la grille
  const rRef = demandRevenue(prixRef, qRef, e, prixRef).r;
  const rStar = demandRevenue(prixRef, qRef, e, pClip).r;
  const gainPct = rRef ? ((rStar - rRef) / rRef) * 100 : 0;
  const sens = pClip > prixRef ? "hausse" : pClip < prixRef ? "baisse" : "stable";
  return { prixRef, prixOptimal: pStar, prixRecommande: pClip, sens, gainPct };
}
export function revenueCurve(prixRef: number, e: number, band: [number, number], qRef = 100, n = 48) {
  const lo = band[0] * 0.6, hi = band[1] * 1.3, step = (hi - lo) / (n - 1);
  const out: { p: number; revenue: number }[] = [];
  for (let i = 0; i < n; i++) {
    const p = lo + i * step;
    out.push({ p: +p.toFixed(1), revenue: +demandRevenue(prixRef, qRef, e, p).r.toFixed(1) });
  }
  return out;
}
