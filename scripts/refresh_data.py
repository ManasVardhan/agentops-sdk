"""Refresh src/data/packages.json from PyPI and pypistats.

Daily downloads are merged into the existing history, so the series keeps
growing past pypistats' 180-day window. Test counts are kept as is. Any
package whose fetch fails keeps its previous values.
"""

import datetime
import json
import pathlib
import sys
import urllib.request

DATA = pathlib.Path(__file__).resolve().parent.parent / "src" / "data" / "packages.json"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "agentops-sdk-site"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def refresh(pkg):
    name = pkg["name"]
    meta = get(f"https://pypi.org/pypi/{name}/json")
    info = meta["info"]
    reqs = info.get("requires_dist") or []
    pkg["version"] = info["version"]
    pkg["summary"] = info["summary"]
    pkg["dependencies"] = [r for r in reqs if "extra ==" not in r]
    pkg["extras"] = sorted({r.split("extra == ")[1].strip('"') for r in reqs if "extra ==" in r})
    pkg["releases"] = {v: f[0]["upload_time"][:10] for v, f in meta["releases"].items() if f}

    pkg["recent"] = get(f"https://pypistats.org/api/packages/{name}/recent")["data"]
    daily = dict(pkg["dailyDownloads"])
    fresh = {}
    for row in get(f"https://pypistats.org/api/packages/{name}/overall?mirrors=false")["data"]:
        fresh[row["date"]] = fresh.get(row["date"], 0) + row["downloads"]
    daily.update(fresh)
    pkg["dailyDownloads"] = sorted(daily.items())


def main():
    data = json.loads(DATA.read_text())
    failed = []
    for pkg in data["packages"]:
        try:
            refresh(pkg)
        except Exception as e:  # keep the previous snapshot for this package
            failed.append(pkg["name"])
            print(f"warn: {pkg['name']}: {e}", file=sys.stderr)
    if len(failed) < len(data["packages"]):
        data["fetchedAt"] = datetime.date.today().isoformat()
    DATA.write_text(json.dumps(data, indent=1) + "\n")
    print(f"refreshed {len(data['packages']) - len(failed)}/{len(data['packages'])} packages")


if __name__ == "__main__":
    main()
