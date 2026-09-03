"""Normalise la base des prix SNCF -> JSON (Next.js) + CSV (Power BI / Excel)."""
import os, json, datetime, pandas as pd
from ingest import _find, RAW, fetch

JSON_OUT = "web/src/data/tarifs.json"
CSV_OUT  = "powerbi/tarifs_powerbi.csv"

def build(path=RAW):
    df = pd.read_csv(path, sep=";")
    c = df.columns
    col = dict(
        origine=_find(c, "origine") or _find(c, "depart"),
        destination=_find(c, "destination") or _find(c, "arrivee"),
        classe=_find(c, "classe"), profil=_find(c, "profil"),
        pmin=_find(c, "prix", "min") or _find(c, "minimum"),
        pmax=_find(c, "prix", "max") or _find(c, "maximum"),
        op=_find(c, "transporteur") or _find(c, "operateur") or _find(c, "train"),
    )
    out = pd.DataFrame({
        "od": df[col["origine"]].astype(str) + " \u2192 " + df[col["destination"]].astype(str),
        "gare_origine": df[col["origine"]].astype(str),
        "gare_destination": df[col["destination"]].astype(str),
        "transporteur": df[col["op"]].astype(str) if col["op"] else "",
        "classe": df[col["classe"]].astype(str) if col["classe"] else "",
        "profil_tarifaire": df[col["profil"]].astype(str) if col["profil"] else "",
        "prix_minimum": pd.to_numeric(df[col["pmin"]], errors="coerce"),
        "prix_maximum": pd.to_numeric(df[col["pmax"]], errors="coerce"),
    }).dropna(subset=["prix_minimum", "prix_maximum"])
    out["amplitude"] = out["prix_maximum"] - out["prix_minimum"]

    os.makedirs(os.path.dirname(JSON_OUT), exist_ok=True)
    rows = [dict(od=r.od, origine=r.gare_origine, destination=r.gare_destination,
                 classe=r.classe, profil=r.profil_tarifaire, operateur=r.transporteur,
                 prixMin=float(r.prix_minimum), prixMax=float(r.prix_maximum))
            for r in out.itertuples(index=False)]
    json.dump(dict(generated=datetime.date.today().isoformat(),
                   source="SNCF Open Data - tarifs-tgv-inoui-ouigo (ODbL)", rows=rows),
              open(JSON_OUT, "w", encoding="utf-8"), ensure_ascii=False)
    print(f"JSON  : {len(rows)} lignes -> {JSON_OUT}")

    os.makedirs(os.path.dirname(CSV_OUT), exist_ok=True)
    out.to_csv(CSV_OUT, sep=";", index=False, encoding="utf-8-sig")
    print(f"CSV   : {len(out)} lignes -> {CSV_OUT}")

if __name__ == "__main__":
    if not os.path.exists(RAW):
        fetch()
    build()
