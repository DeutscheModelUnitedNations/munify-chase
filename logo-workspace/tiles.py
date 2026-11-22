#!/usr/bin/env python3
"""Rebuild the large icon rasters from the standard cut.

export_variants derives every raster from --favicon-source, which is the
small-size cut. That is right for a 16 px tab and wrong for a 180 or 512 px
tile, where the open rostrum and open table should show. This regenerates the
sizes above 48 px from the standard cut on a white tile, scaled to 75% so the
mark clears a maskable icon's safe zone.

    python3 tiles.py
"""
import os
import subprocess
import sys

from build import symbol_paths, svg, path, MUNIFY, BLUE
from products import chase_parts, delegator_parts, CHASE, DELEGATOR, FULL

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.join(HERE, "kit")
RENDER = os.path.expanduser("~/.claude/skills/logo-design/scripts/render_png.py")
SCALE = 0.75
BIG = {"favicon-96x96.png": 96, "apple-touch-icon.png": 180,
       "web-app-manifest-192x192.png": 192, "web-app-manifest-512x512.png": 512}


def mark_parts(key):
    if key == "munify":
        sym, _ = symbol_paths(**MUNIFY)
        return [(sym, "evenodd")]
    parts = chase_parts(CHASE, True) if key == "chase" else delegator_parts(DELEGATOR, True)
    solid, outlined = parts
    out = [(solid, None)]
    if outlined:
        out.append((outlined, "evenodd"))
    return out


def tile(key):
    """White tile with the standard mark centred at 75%."""
    off = 128.0 * (1.0 - SCALE)
    shapes = "".join(path(d, BLUE, r) for d, r in mark_parts(key))
    body = f'<g transform="translate({off:.2f} {off:.2f}) scale({SCALE})">{shapes}</g>'
    return svg(FULL, f"MUNify {key} tile", [body], bg="#FFFFFF")


def render(src, dest, size):
    subprocess.run([sys.executable, RENDER, src, "-o", dest, "--size", str(size)],
                   check=True, capture_output=True)


def main():
    targets = {"munify": os.path.join(KIT, "web"),
               "chase": os.path.join(KIT, "web-chase"),
               "delegator": os.path.join(KIT, "web-delegator")}
    for key, out_dir in targets.items():
        src = os.path.join(KIT, f"tile-{key}.svg")
        with open(src, "w", encoding="utf-8") as fh:
            fh.write(tile(key))
        render(src, os.path.join(out_dir, "icon-192.png"), 192)
        render(src, os.path.join(out_dir, "icon-512.png"), 512)
        render(src, os.path.join(out_dir, "maskable-512.png"), 512)
        render(src, os.path.join(out_dir, "apple-touch-icon.png"), 180)
        print(f"{key}: rebuilt 180/192/512 from the standard cut")
    # the app itself is CHASE
    static = os.path.join(os.path.dirname(HERE), "static")
    src = os.path.join(KIT, "tile-chase.svg")
    for name, size in BIG.items():
        render(src, os.path.join(static, name), size)
    print("static/: 96/180/192/512 rebuilt from the CHASE standard cut")


if __name__ == "__main__":
    main()
