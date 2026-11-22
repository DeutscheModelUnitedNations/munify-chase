#!/usr/bin/env python3
"""The expressive set: the flat marks lifted off the page.

Screen only. These carry a drop-shadow filter, so they do not print, they
render inconsistently across browsers, and they contradict the DMUN guidelines
(`--depth: 0`, `--noise: 0`). The flat marks in kit/ stay the masters; use
these for app-store listings, social and marketing, never for the favicon,
print, or anything that has to go one-colour.

    python3 depth.py
"""
from build import symbol_paths, svg, path, write, MUNIFY, BLUE
from products import chase_parts, delegator_parts, CHASE, DELEGATOR, FULL

NAVY = "#1B1837"


def lift(fid, colour, opacity):
    return (f'<defs><filter id="{fid}" x="-25%" y="-25%" width="160%" height="160%">'
            f'<feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="{colour}" '
            f'flood-opacity="{opacity}"/></filter></defs>')


def marks():
    sym, _ = symbol_paths(**MUNIFY)
    c_solid, c_open = chase_parts(CHASE, vacant=True)
    d_solid, d_open = delegator_parts(DELEGATOR, vacant=True)
    return {
        # (parts, label) where parts is a list of (d, fill-rule)
        "munify": ([(sym, "evenodd")], "MUNify"),
        "chase": ([(c_solid, None), (c_open, "evenodd")], "MUNify CHASE"),
        "delegator": ([(d_solid, None), (d_open, "evenodd")], "MUNify DELEGATOR"),
    }


def main():
    for key, (parts, label) in marks().items():
        shapes = "".join(path(d, BLUE, r) for d, r in parts)
        write(f"lift-{key}-blue.svg",
              svg(FULL, f"{label}, lifted", [lift("s", "#013256", "0.3"),
                  f'<g filter="url(#s)">{shapes}</g>'], bg="#FFFFFF"))
        # on the one approved dark ground the mark goes white and the shadow
        # goes black, or it disappears into the navy
        white = "".join(path(d, "#FFFFFF", r) for d, r in parts)
        write(f"lift-{key}-reversed.svg",
              svg(FULL, f"{label}, lifted, reversed",
                  [lift("s", "#000000", "0.45"),
                   f'<g filter="url(#s)">{white}</g>'], bg=NAVY))


if __name__ == "__main__":
    main()
