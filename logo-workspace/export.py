#!/usr/bin/env python3
"""Export the logos as single files on white, with clear space around them.

Every mark is cropped to its own ink, then padded by 22% of the ink height on
all four sides. That is roughly the centre table square of the chamber, the
clear-space unit the usage guide defines, and applying it to the ink height
rather than the width keeps the margin identical on a square symbol and on a
wide lockup.

    python3 export.py [target-folder]        # default: ~/Downloads/MUNify-Logos

Writes an SVG and a PNG (2000 px on the long edge) per mark.
"""
import os
import re
import subprocess
import sys

from build import symbol_paths, f, MUNIFY
from products import CHASE, DELEGATOR

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.join(HERE, "kit")
RENDER = os.path.expanduser("~/.claude/skills/logo-design/scripts/render_png.py")
PAD = 0.22          # share of the ink height, on every side
LONG_EDGE = 2000

# Marks whose kit file sits on the padded 256 canvas, so the viewBox is not the
# ink box: their ink is computed from the same constants that drew them.
def munify_ink():
    _, ink = symbol_paths(**MUNIFY)
    return ink


def chase_ink():
    ri, ro, w, g, open_i, dw, dh, dgap = CHASE
    cy = (256.0 - (ro + dgap + dh)) / 2.0 - 2.0 + ro
    return (128.0 - ro, cy - ro, 128.0 + ro, cy + dgap + dh)


def delegator_ink():
    cell, gap = DELEGATOR
    span = 3 * cell + 2 * gap
    o = (256.0 - span) / 2.0
    return (o, o, o + span, o + span)


# (output name, kit file, ink box or None to use the file's own viewBox)
MARKS = [
    ("MUNify-Symbol", "munify-symbol-blue.svg", munify_ink),
    ("MUNify-CHASE-Symbol", "icon-chase-blue.svg", chase_ink),
    ("MUNify-DELEGATOR-Symbol", "icon-delegator-blue.svg", delegator_ink),
    ("MUNify-Logo-horizontal", "munify-horizontal-blue.svg", None),
    ("MUNify-Logo-gestapelt", "munify-stacked-blue.svg", None),
    ("MUNify-Wortmarke", "munify-wordmark-blue.svg", None),
    ("MUNify-CHASE-Logo", "munify-chase-blue.svg", None),
    ("MUNify-CHASE-Logo-kompakt", "munify-chase-compact-blue.svg", None),
    ("MUNify-DELEGATOR-Logo", "munify-delegator-blue.svg", None),
    ("MUNify-DELEGATOR-Logo-kompakt", "munify-delegator-compact-blue.svg", None),
]


def read_kit(name):
    with open(os.path.join(KIT, name), encoding="utf-8") as fh:
        s = fh.read()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    bodies = re.findall(r"<path[^>]*/>", s)
    return (vb[0], vb[1], vb[0] + vb[2], vb[1] + vb[3]), "\n  ".join(bodies)


def main():
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "~/Downloads/MUNify-Logos"
    out_dir = os.path.expanduser(out_dir)
    os.makedirs(out_dir, exist_ok=True)

    for label, kit_file, ink_fn in MARKS:
        box, bodies = read_kit(kit_file)
        if ink_fn is not None:
            box = ink_fn()
        x0, y0, x1, y1 = box
        pad = (y1 - y0) * PAD
        vx, vy = x0 - pad, y0 - pad
        vw, vh = (x1 - x0) + 2 * pad, (y1 - y0) + 2 * pad
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" '
               f'viewBox="{f(vx)} {f(vy)} {f(vw)} {f(vh)}" '
               f'width="{f(vw)}" height="{f(vh)}" role="img" aria-label="{label}">\n'
               f'  <path fill="#FFFFFF" d="M{f(vx)} {f(vy)} H{f(vx+vw)} '
               f'V{f(vy+vh)} H{f(vx)} Z"/>\n  {bodies}\n</svg>\n')
        svg_path = os.path.join(out_dir, label + ".svg")
        with open(svg_path, "w", encoding="utf-8") as fh:
            fh.write(svg)

        scale = LONG_EDGE / max(vw, vh)
        subprocess.run([sys.executable, RENDER, svg_path,
                        "-o", os.path.join(out_dir, label + ".png"),
                        "--width", str(round(vw * scale)),
                        "--height", str(round(vh * scale)),
                        "--bg", "#FFFFFF"], check=True, capture_output=True)
        print(f"{label}  {round(vw * scale)}x{round(vh * scale)}")
    print(f"\n-> {out_dir}")


if __name__ == "__main__":
    main()
