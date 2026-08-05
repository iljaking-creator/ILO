#!/usr/bin/env bash
# Lädt alle Charakter-Assets aus dem Manifest in charaktere/ herunter.
# Auf einem Rechner mit freiem Internetzugang ausführen (die Higgsfield-CDN
# war in der Cloud-Session gesperrt): bash scripts/download-charaktere.sh
set -euo pipefail
cd "$(dirname "$0")/.."

command -v jq >/dev/null || { echo "jq wird benötigt (apt install jq / brew install jq)"; exit 1; }

mkdir -p charaktere/konzepte charaktere/b-russ

jq -r '.varianten[] | .id + " " + .url' charaktere/manifest.json | while read -r id url; do
  out="charaktere/konzepte/${id}.png"
  [ -f "$out" ] || curl -fsS -o "$out" "$url"
  echo "OK  $out"
done

curl -fsS -o charaktere/b-russ/modelsheet.png "$(jq -r '.empfehlung.turnaround_url' charaktere/manifest.json)"
echo "OK  charaktere/b-russ/modelsheet.png"
curl -fsS -o charaktere/b-russ/expressions.png "$(jq -r '.empfehlung.expression_sheet_url' charaktere/manifest.json)"
echo "OK  charaktere/b-russ/expressions.png"
