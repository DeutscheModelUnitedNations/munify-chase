#!/usr/bin/env python3
"""Product symbols for CHASE and DELEGATOR.

Siblings of the MUNify chamber by vocabulary, not by copying it: same band and
square weights, angles on multiples of 15 deg, flat, zero radius, one colour.

    CHASE      a segmented arch of benches over a solid rostrum. The room in
               plan from the speaker's point of view, built from the same
               bench the chamber is built from.
    DELEGATOR  the same room as a seating chart: eight seats, open floor.
               Orthogonal where the chamber is radial.

Each has a small-size cut with heavier parts and wider gaps for use below 24 px.

    python3 products.py
"""
from build import f, svg, path, write, band, band_outline, BLUE, COLOURWAYS

FULL = (0.0, 0.0, 256.0, 256.0)
C = 128.0


def rect(x0, y0, x1, y1):
    return f"M{f(x0)} {f(y0)} H{f(x1)} V{f(y1)} H{f(x0)} Z"


def rect_outline(x0, y0, x1, y1, b=12.0):
    """A square left open: outer ring plus an inner hole, drawn evenodd.

    One place in each mark is shown vacant. Dropped in the small-size cut,
    where a 12-unit border closes up below about 24 px.
    """
    return (f"M{f(x0)} {f(y0)} H{f(x1)} V{f(y1)} H{f(x0)} Z "
            f"M{f(x0+b)} {f(y0+b)} H{f(x1-b)} V{f(y1-b)} H{f(x0+b)} Z")


# ---------------------------------------------------------------- CHASE ----
# The house as a segmented arch: three benches of 45 deg with 22.5 deg gaps
# fill the half circle exactly (3*45 + 2*22.5 = 180), the same angular rhythm
# as MUNify's ring. The right-hand bench is the open one, echoing MUNify's
# off-centre opening; the rostrum below it stays solid.
#
# The rostrum has to stay lighter than the arch. At 124 x 54 it stopped
# reading as a desk and became a plinth the arch was standing on.
#
# (ri, ro, bench, gap, open index, desk width, desk height, gap under the arch)
CHASE = (58.0, 108.0, 45.0, 22.5, 2, 112.0, 46.0, 20.0)
# small cut: wider arch gaps, solid throughout, heavier desk
CHASE_SMALL = (54.0, 108.0, 40.0, 30.0, None, 120.0, 52.0, 22.0)
BORDER = 12.0


def chase_parts(p, vacant=False):
    """(solid, outlined) path pair. The open bench is the vacant place."""
    ri, ro, w, g, open_i, dw, dh, dgap = p
    cy = (256.0 - (ro + dgap + dh)) / 2.0 - 2.0 + ro
    solid, outlined, cur = [], None, 180.0
    while cur < 359.0:
        a0, a1 = cur, cur + w
        if vacant and open_i is not None and len(solid) + (outlined is not None) == open_i:
            outlined = band_outline(C, cy, ri, ro, a0, a1, BORDER)
        else:
            solid.append(band(C, cy, ri, ro, a0, a1))
        cur = a1 + g
    top = cy + dgap
    solid.append(rect(C - dw / 2, top, C + dw / 2, top + dh))
    return " ".join(solid), outlined


# ------------------------------------------------------------ DELEGATOR ----
# cell size, gap  (3x3 grid, centre cell left open as the floor)
DELEGATOR = (56.0, 18.0)
DELEGATOR_SMALL = (54.0, 26.0)


# Which seats are left open, as (col, row) from the top-left. (1, 1) is the
# floor and is always empty. Mid-left and bottom-right: deliberately not a
# symmetric pair, so the grid reads as a chart with two seats still to fill
# rather than as a pattern. Axis pairs like ML+MR or TC+BC are a trap - they
# line up with the open centre and split the grid into two halves.
DELEGATOR_VACANT = frozenset({(0, 1), (2, 2)})


def delegator_parts(p, vacant=False):
    """(solid, outlined) path pair for the seating grid."""
    cell, gap = p
    span = 3 * cell + 2 * gap
    origin = (256.0 - span) / 2.0
    cells = [origin, origin + cell + gap, origin + 2 * (cell + gap)]
    solid, outlined = [], []
    for row, y in enumerate(cells):
        for col, x in enumerate(cells):
            if (col, row) == (1, 1):
                continue
            if vacant and (col, row) in DELEGATOR_VACANT:
                outlined.append(rect_outline(x, y, x + cell, y + cell))
            else:
                solid.append(rect(x, y, x + cell, y + cell))
    return " ".join(solid), (" ".join(outlined) if outlined else None)



PRODUCTS = {
    "chase": (chase_parts, CHASE, CHASE_SMALL, "MUNify CHASE"),
    "delegator": (delegator_parts, DELEGATOR, DELEGATOR_SMALL,
                  "MUNify DELEGATOR"),
}


def shapes(parts, fill):
    """Render a (solid, outlined) pair; the outlined half needs evenodd."""
    solid, outlined = parts
    out = [path(solid, fill)] if solid else []
    if outlined:
        out.append(path(outlined, fill, "evenodd"))
    return out


def main():
    for key, (build_parts, std_p, small_p, label) in PRODUCTS.items():
        std = build_parts(std_p, vacant=True)
        # below ~24 px a 12-unit border closes up, so the small cut is solid
        small = build_parts(small_p, vacant=False)
        for suffix, fill in COLOURWAYS:
            write(f"icon-{key}-{suffix}.svg",
                  svg(FULL, label + " symbol", shapes(std, fill)))
        for suffix, fill in (("blue", BLUE), ("white", "#FFFFFF")):
            write(f"icon-{key}-small-{suffix}.svg",
                  svg(FULL, label + " symbol, small-size cut", shapes(small, fill)))
        # browser tab / app tile: white ground, blue mark
        write(f"icon-{key}-favicon.svg",
              svg(FULL, label, shapes(small, BLUE), bg="#FFFFFF"))


if __name__ == "__main__":
    main()
