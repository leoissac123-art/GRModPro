#!/usr/bin/env python3
"""Create a separate Phase 2 variant with its own Bedrock pack UUIDs.

The initial Phase 2 release carries the current original texture set as a
separate installable copy. Its unique header and module UUIDs prevent the
duplicate-pack identity conflict with Phase 1.
"""
import json
import shutil
from pathlib import Path

root = Path(__file__).resolve().parent.parent
source = root / "packs" / "grmodpro-realism-rp"
destination = root / "packs" / "grmodpro-realism-phase2-rp"

if not (source / "manifest.json").exists():
    raise SystemExit("Phase 1 realism pack manifest is missing")

if destination.exists():
    shutil.rmtree(destination)
shutil.copytree(source, destination)

manifest_path = destination / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
manifest["header"]["name"] = "GRModPro Realism Phase 2"
manifest["header"]["description"] = (
    "GRModPro Realism Phase 2 — separate installable release with a unique pack identity. "
    "Uses the current original procedural texture set; experimental, not a full shader "
    "or complete texture replacement."
)
manifest["header"]["uuid"] = "b0e75a7d-9bd5-4d31-9a62-6f85d4a1c2e9"
manifest["header"]["version"] = [2, 0, 1]
manifest["modules"][0]["uuid"] = "a87d5b9e-ef35-4f23-a8e2-14c2d91a6b70"
manifest["modules"][0]["version"] = [2, 0, 1]
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Created {destination.relative_to(root)} with unique Phase 2 UUIDs")
