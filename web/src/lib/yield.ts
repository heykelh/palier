// Moteur de yield management EMSR-b - 100% deterministe.
// Alloue la capacite d'un train entre paliers tarifaires niches (nested).

/** Quantile de la loi normale centree reduite (Acklam). */
export function invNormal(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239e0];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0, -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0, 3.754408661907416e0];
  const plow = 0.02425, phigh = 1 - plow;
  let q: number, r: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= phigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

export type Palier = { nom: string; prix: number; demande: number; sigma: number };
export type YieldRow = Palier & { alloc: number; bl: number; protection: number };
export type YieldResult = { rows: YieldRow[]; revenu: number; capacite: number; demandeTotale: number };

/** EMSR-b : niveaux de protection, limites de reservation et allocation par palier. */
export function emsrb(classes: Palier[], capacite: number): YieldResult {
  const cl = [...classes].sort((a, b) => b.prix - a.prix); // du plus cher au moins cher
  const n = cl.length;
  const protection: number[] = []; // protection cumulee pour les paliers 1..j (au-dessus de j+1)

  for (let j = 1; j <= n - 1; j++) {
    let sumMu = 0, sumVar = 0, sumFMu = 0;
    for (let k = 0; k < j; k++) {
      sumMu += cl[k].demande;
      sumVar += cl[k].sigma ** 2;
      sumFMu += cl[k].prix * cl[k].demande;
    }
    const fbar = sumMu > 0 ? sumFMu / sumMu : 0;      // tarif moyen pondere des paliers proteges
    const ratio = fbar > 0 ? cl[j].prix / fbar : 0;    // prix du palier courant / tarif moyen au-dessus
    const z = invNormal(1 - ratio);
    let pi = sumMu + z * Math.sqrt(sumVar);
    pi = Math.max(0, Math.min(capacite, pi));
    protection.push(pi);
  }

  const alloc: number[] = [];
  let prev = 0;
  for (let j = 0; j < n; j++) {
    const cum = j < n - 1 ? protection[j] : capacite;
    alloc.push(Math.max(0, cum - prev));
    prev = cum;
  }

  const rows: YieldRow[] = cl.map((c, j) => ({
    ...c,
    alloc: Math.round(alloc[j]),
    bl: Math.round(j === 0 ? capacite : capacite - protection[j - 1]), // limite de reservation
    protection: Math.round(j === 0 ? 0 : protection[j - 1]),
  }));

  let rem = capacite, rev = 0;
  for (const c of cl) { const s = Math.min(c.demande, rem); rev += s * c.prix; rem -= s; }

  return { rows, revenu: Math.round(rev), capacite, demandeTotale: Math.round(cl.reduce((s, c) => s + c.demande, 0)) };
}

/** Genere N paliers entre prix_min et prix_max, avec une demande qui croit vers les bas tarifs. */
export function genererPaliers(prixMin: number, prixMax: number, n: number, demandeTotale: number, variabilite: number): Palier[] {
  const paliers: Palier[] = [];
  // poids de demande croissant vers le bas (clients bas tarif plus nombreux)
  const poids = Array.from({ length: n }, (_, i) => 1 + i * 1.3);
  const sommePoids = poids.reduce((s, p) => s + p, 0);
  for (let i = 0; i < n; i++) {
    const prix = Math.round(prixMax - (prixMax - prixMin) * (i / (n - 1)));
    const demande = (demandeTotale * poids[i]) / sommePoids;
    paliers.push({
      nom: `P${i + 1}`,
      prix,
      demande: Math.round(demande * 10) / 10,
      sigma: Math.round(demande * variabilite * 10) / 10,
    });
  }
  return paliers;
}
