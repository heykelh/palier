"""Ingestion de la base des prix TGV INOUI / OUIGO (SNCF Open Data, ODbL).
Auto-detecte les colonnes -> DuckDB. Source officielle CSV, pas d'API morte."""
import os, sys, datetime, requests, duckdb, pandas as pd

DATASET = "tarifs-tgv-inoui-ouigo"
CSV_URL = (f"https://ressources.data.sncf.com/api/explore/v2.1/catalog/"
           f"datasets/{DATASET}/exports/csv?delimiter=%3B")
DB, RAW = "pricing.duckdb", "data/tarifs_raw.csv"

def fetch(url=CSV_URL, out=RAW):
    os.makedirs("data", exist_ok=True)
    print(f"-> telechargement {url}")
    r = requests.get(url, timeout=60); r.raise_for_status()
    open(out, "wb").write(r.content)
    print(f"   ecrit {out} ({len(r.content)//1024} Ko)")
    return out

def _find(cols, *needles):
    for c in cols:
        if all(n in c.lower() for n in needles):
            return c
    return None

def load(path=RAW, db=DB):
    df = pd.read_csv(path, sep=";")
    print("\nColonnes detectees :", list(df.columns))
    cols = df.columns
    m = dict(
        origine     = _find(cols, "origine") or _find(cols, "depart"),
        destination = _find(cols, "destination") or _find(cols, "arrivee"),
        classe      = _find(cols, "classe"),
        prix_min    = _find(cols, "prix", "min") or _find(cols, "minimum"),
        prix_max    = _find(cols, "prix", "max") or _find(cols, "maximum"),
        operateur   = _find(cols, "transporteur") or _find(cols, "operateur") or _find(cols, "train"),
    )
    print("Mapping :", m)
    con = duckdb.connect(db)
    con.register("src", df)
    con.execute("CREATE OR REPLACE TABLE tarifs AS SELECT * FROM src")
    n = con.execute("SELECT count(*) FROM tarifs").fetchone()[0]
    print(f"\n{n} lignes chargees dans {db}::tarifs\n")
    print(df.head(8).to_string())
    con.close()
    return m

def snapshot(path=RAW):
    """Versionne la base des prix (fare/base tracking) + diff vs precedent."""
    os.makedirs("data/snapshots", exist_ok=True)
    today = datetime.date.today().isoformat()
    df = pd.read_csv(path, sep=";")
    df.to_csv(f"data/snapshots/tarifs_{today}.csv", index=False)
    prev = sorted(p for p in os.listdir("data/snapshots") if p < f"tarifs_{today}.csv")
    if prev:
        old = pd.read_csv(f"data/snapshots/{prev[-1]}")
        print(f"Snapshot {today}: {len(df)} lignes ({len(df)-len(old):+d} vs {prev[-1]})")
    else:
        print(f"Snapshot {today}: {len(df)} lignes (premier snapshot)")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "snapshot":
        fetch(); snapshot()
    else:
        fetch(); load()
