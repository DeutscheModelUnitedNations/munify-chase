#!/usr/bin/env python3
"""Build the MUNify logo kit (concept B - Chamber).

Regenerates every master SVG from first principles: the symbol geometry is
computed, the wordmark is outlined from the Outfit variable font (no live text
in any output file).

    python3 build.py
"""
import math
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "kit")
FONT = os.path.expanduser("~/Library/Fonts/Outfit-VariableFont_wght.ttf")

BLUE = "#01548F"          # DMUN-Blau, --color-primary
NAVY = "#1B1837"          # --navy-900, the only approved dark ground
INK = "#000000"

# ---------------------------------------------------------------- symbol ----
# The assembly seen from above: benches around a table. Four benches of w plus
# one of 2w left open, with five gaps between them, so
#     (nsolid + 2) * w + (nsolid + 1) * gap = 360.
#
# The open bench is rotated OFF the vertical axis, and that is load-bearing: a
# wide opening centred beneath a symmetric pair of benches reads as a mouth,
# and the whole mark becomes a smiley face. Keep the rotation a multiple of
# 15 deg - every boundary then shifts by a multiple of 15 and stays clear of a
# near-miss angle. Only gaps of 22.5 and 30 satisfy that for nsolid = 4.
MUNIFY = dict(ri=58.0, ro=108.0, gap=22.5, nsolid=4, rot=-30.0,
              dot=52.0, border=12.0)
# Small-size cut: wider gaps, and the open bench goes solid, because a 12-unit
# border closes to mush below about 24 px.
MUNIFY_SMALL = dict(ri=52.0, ro=110.0, gap=30.0, nsolid=4, rot=-30.0,
                    dot=56.0, border=0.0)


def f(v):
    s = f"{v:.2f}"
    return s.rstrip("0").rstrip(".") if "." in s else s


def polar(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def band(cx, cy, ri, ro, a0, a1):
    """One filled band segment between two radii, a0 -> a1 clockwise (deg)."""
    large = 1 if (a1 - a0) % 360 > 180 else 0
    x0, y0 = polar(cx, cy, ro, a0)
    x1, y1 = polar(cx, cy, ro, a1)
    x2, y2 = polar(cx, cy, ri, a1)
    x3, y3 = polar(cx, cy, ri, a0)
    return (f"M{f(x0)} {f(y0)} A{f(ro)} {f(ro)} 0 {large} 1 {f(x1)} {f(y1)} "
            f"L{f(x2)} {f(y2)} A{f(ri)} {f(ri)} 0 {large} 0 {f(x3)} {f(y3)} Z")


def band_outline(cx, cy, ri, ro, a0, a1, b):
    """A band plus a constant-width inner hole, to be filled evenodd.

    The radial ends inset by a perpendicular distance b, which is an angular
    inset of asin(b/r) and so differs at each radius; the two inset points are
    joined by a chord lying exactly on the offset line. A fixed angular inset
    would leave the border visibly thicker at the outer edge.
    """
    ria, roa = ri + b, ro - b
    din = math.degrees(math.asin(b / ria))
    dout = math.degrees(math.asin(b / roa))
    p1 = polar(cx, cy, ria, a0 + din)
    p2 = polar(cx, cy, roa, a0 + dout)
    p3 = polar(cx, cy, roa, a1 - dout)
    p4 = polar(cx, cy, ria, a1 - din)
    return (band(cx, cy, ri, ro, a0, a1) +
            f" M{f(p1[0])} {f(p1[1])} L{f(p2[0])} {f(p2[1])} "
            f"A{f(roa)} {f(roa)} 0 0 1 {f(p3[0])} {f(p3[1])} "
            f"L{f(p4[0])} {f(p4[1])} "
            f"A{f(ria)} {f(ria)} 0 0 0 {f(p1[0])} {f(p1[1])} Z")


def ring_spans(gap, nsolid, rot):
    """(open bench span, [solid bench spans]) in degrees."""
    w = (360.0 - (nsolid + 1) * gap) / (nsolid + 2.0)
    c = 90.0 + rot
    spans, cur = [], c + w + gap
    for _ in range(nsolid):
        spans.append((cur, cur + w))
        cur += w + gap
    return (c - w, c + w), spans


def arc_ink(ro, spans):
    """Ink box of arc bands at radius ro, around the origin."""
    xs, ys = [], []
    for a0, a1 in spans:
        n = max(2, int(a1 - a0) + 1)
        for i in range(n + 1):
            x, y = polar(0.0, 0.0, ro, a0 + (a1 - a0) * i / n)
            xs.append(x)
            ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


def symbol_paths(ri, ro, gap, nsolid, rot, dot, border):
    """One evenodd path for the whole symbol, plus its ink box on the canvas.

    The benches never overlap, so evenodd draws them exactly as nonzero would;
    it is there so the open bench's hole reads as a hole.
    """
    op, solids = ring_spans(gap, nsolid, rot)
    x0, y0, x1, y1 = arc_ink(ro, [op] + solids)
    cx = 128.0 - (x0 + x1) / 2.0
    cy = 128.0 - (y0 + y1) / 2.0 - 2.0          # 2 units optically high
    parts = [band(cx, cy, ri, ro, a0, a1) for a0, a1 in solids]
    parts.append(band_outline(cx, cy, ri, ro, op[0], op[1], border)
                 if border else band(cx, cy, ri, ro, op[0], op[1]))
    h = dot / 2.0
    parts.append(f"M{f(cx-h)} {f(cy-h)} H{f(cx+h)} V{f(cy+h)} H{f(cx-h)} Z")
    return " ".join(parts), (cx + x0, cy + y0, cx + x1, cy + y1)


# -------------------------------------------------------------- wordmark ----
_cache = {}


def instance(weight):
    if weight not in _cache:
        _cache[weight] = instantiateVariableFont(TTFont(FONT), {"wght": weight})
    return _cache[weight]


def run_bounds(text, weight, size, x, baseline, tracking=0.0):
    """As run(), but also returns the real ink bbox (x0, y0, x1, y1)."""
    font = instance(weight)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upem = font["head"].unitsPerEm
    s = size / upem
    pen = SVGPathPen(glyphs, ntos=lambda v: f(v))
    bounds = BoundsPen(glyphs)
    cursor = x
    for ch in text:
        name = cmap[ord(ch)]
        t = Transform(s, 0, 0, -s, cursor, baseline)
        glyphs[name].draw(TransformPen(pen, t))
        glyphs[name].draw(TransformPen(bounds, t))
        cursor += glyphs[name].width * s + tracking
    return " ".join(pen.getCommands().split()), cursor, bounds.bounds


def cap_height(weight, size):
    font = instance(weight)
    return font["OS/2"].sCapHeight * size / font["head"].unitsPerEm


def union(*boxes):
    boxes = [b for b in boxes if b]
    return (min(b[0] for b in boxes), min(b[1] for b in boxes),
            max(b[2] for b in boxes), max(b[3] for b in boxes))


SIZE = 168.0
BASE = 186.0
TRACK_WORD = -2.0
TRACK_CHASE = 2.0


def svg(box, title, bodies, bg=None):
    """box = (x0, y0, x1, y1) ink box; the viewBox is cropped to it."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x0)} {f(y0)} {f(w)} {f(h)}" '
           f'width="{f(w)}" height="{f(h)}" role="img" aria-labelledby="t">',
           f"  <title id=\"t\">{title}</title>"]
    if bg:
        out.append(f'  <path fill="{bg}" d="M{f(x0)} {f(y0)} H{f(x1)} V{f(y1)} H{f(x0)} Z"/>')
    out.extend("  " + b for b in bodies)
    out.append("</svg>\n")
    return "\n".join(out)


def path(d, fill, rule=None):
    r = f' fill-rule="{rule}"' if rule else ""
    return f'<path fill="{fill}"{r} d="{d}"/>'


def write(name, content):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(content)
    print("wrote kit/" + name)


COLOURWAYS = (("blue", BLUE), ("black", INK), ("white", "#FFFFFF"))


def placed_symbol(d, ink, height, left, top):
    """Symbol group whose ink box lands at (left, top) with the given height."""
    x0, y0, x1, y1 = ink
    s = height / (y1 - y0)
    dx, dy = left - s * x0, top - s * y0
    box = (left, top, left + s * (x1 - x0), top + height)
    return f'<g transform="translate({f(dx)} {f(dy)}) scale({f(s)})">{path(d, "%s", "evenodd")}</g>', box


def wordmark_at(left, baseline):
    """MUN solid + ify light, ink-left-aligned to `left`. Returns (d, box)."""
    _, _, probe = run_bounds("MUN", 600, SIZE, 0.0, baseline, TRACK_WORD)
    x = left - probe[0]
    d1, x1, b1 = run_bounds("MUN", 600, SIZE, x, baseline, TRACK_WORD)
    d2, _, b2 = run_bounds("ify", 300, SIZE, x1, baseline, TRACK_WORD)
    return f"{d1} {d2}", union(b1, b2)


def main():
    sym, sym_ink = symbol_paths(**MUNIFY)
    sym_s, _ = symbol_paths(**MUNIFY_SMALL)
    cap = cap_height(600, SIZE)
    full = (0.0, 0.0, 256.0, 256.0)

    # --- symbol: keep the padded 256 canvas, it is also the app icon --------
    for suffix, fill in COLOURWAYS:
        write(f"munify-symbol-{suffix}.svg",
              svg(full, "MUNify symbol", [path(sym, fill, "evenodd")]))
    for suffix, fill in (("blue", BLUE), ("white", "#FFFFFF")):
        write(f"munify-symbol-small-{suffix}.svg",
              svg(full, "MUNify symbol, small-size cut",
                  [path(sym_s, fill, "evenodd")]))
    # Browser tab / app tile: the small cut on a white square. The white ground
    # is deliberate - #01548F on a dark tab bar is muddy, and the CI forbids
    # large areas of the blue, so the tile is white and the mark is blue.
    write("munify-favicon.svg",
          svg(full, "MUNify", [path(sym_s, BLUE, "evenodd")], bg="#FFFFFF"))

    # --- wordmark only, cropped to ink --------------------------------------
    wd, wbox = wordmark_at(0.0, BASE)
    for suffix, fill in COLOURWAYS:
        write(f"munify-wordmark-{suffix}.svg", svg(wbox, "MUNify wordmark", [path(wd, fill)]))

    # --- horizontal lockup: symbol ink 176 tall, wordmark cap-centred -------
    H = 176.0
    gap = cap * 0.5
    grp, sbox = placed_symbol(sym, sym_ink, H, 0.0, 0.0)
    baseline = (H + cap) / 2.0
    wd_h, wbox_h = wordmark_at(sbox[2] + gap, baseline)
    box_h = union(sbox, wbox_h)
    for suffix, fill in COLOURWAYS:
        write(f"munify-horizontal-{suffix}.svg",
              svg(box_h, "MUNify logo, horizontal", [grp % fill, path(wd_h, fill)]))
    write("munify-horizontal-reversed.svg",
          svg(box_h, "MUNify logo, reversed",
              [grp % "#FFFFFF", path(wd_h, "#FFFFFF")], bg=NAVY))

    # --- stacked lockup ------------------------------------------------------
    grp_s, sbox_s = placed_symbol(sym, sym_ink, 200.0, 0.0, 0.0)
    base_s = sbox_s[3] + cap * 0.6 + cap
    wd_s, wbox_s = wordmark_at(0.0, base_s)
    width = max(sbox_s[2], wbox_s[2])
    sdx = (width - sbox_s[2]) / 2.0
    wdx = (width - wbox_s[2]) / 2.0
    grp_s2, sbox_s2 = placed_symbol(sym, sym_ink, 200.0, sdx, 0.0)
    wd_s2, wbox_s2 = wordmark_at(wdx, base_s)
    box_s = union(sbox_s2, wbox_s2)
    for suffix, fill in COLOURWAYS:
        write(f"munify-stacked-{suffix}.svg",
              svg(box_s, "MUNify logo, stacked", [grp_s2 % fill, path(wd_s2, fill)]))
    write("munify-stacked-reversed.svg",
          svg(box_s, "MUNify logo, stacked, reversed",
              [grp_s2 % "#FFFFFF", path(wd_s2, "#FFFFFF")], bg=NAVY))

    # --- sub-brand lockups: MUNify | CHASE ----------------------------------
    for child in ("CHASE", "DELEGATOR"):
        rule_x = wbox_h[2] + gap
        rule_w = 6.0
        rule_top = baseline - cap
        rule = (f"M{f(rule_x)} {f(rule_top)} H{f(rule_x + rule_w)} "
                f"V{f(baseline)} H{f(rule_x)} Z")
        _, _, probe = run_bounds(child, 300, SIZE, 0.0, baseline, TRACK_CHASE)
        cx0 = rule_x + rule_w + gap - probe[0]
        cd, _, cbox = run_bounds(child, 300, SIZE, cx0, baseline, TRACK_CHASE)
        box_c = union(sbox, wbox_h, (rule_x, rule_top, rule_x + rule_w, baseline), cbox)
        parts = lambda fill: [grp % fill, path(wd_h, fill), path(rule, fill), path(cd, fill)]
        for suffix, fill in COLOURWAYS:
            write(f"munify-{child.lower()}-{suffix}.svg",
                  svg(box_c, f"MUNify {child} logo", parts(fill)))
        write(f"munify-{child.lower()}-reversed.svg",
              svg(box_c, f"MUNify {child} logo, reversed", parts("#FFFFFF"), bg=NAVY))

        # compact two-line cut: the 8:1 horizontal shrinks badly below ~220 px
        sub_size = SIZE * 0.5
        sub_track = sub_size * 0.08
        sub_base = sbox[3] + cap_height(300, sub_size)
        _, _, sprobe = run_bounds(child, 300, sub_size, 0.0, sub_base, sub_track)
        sd, _, sbox_c = run_bounds(child, 300, sub_size, wbox_h[0] - sprobe[0],
                                   sub_base, sub_track)
        box_k = union(sbox, wbox_h, sbox_c)
        kparts = lambda fill: [grp % fill, path(wd_h, fill), path(sd, fill)]
        for suffix, fill in COLOURWAYS:
            write(f"munify-{child.lower()}-compact-{suffix}.svg",
                  svg(box_k, f"MUNify {child} logo, compact", kparts(fill)))
        write(f"munify-{child.lower()}-compact-reversed.svg",
              svg(box_k, f"MUNify {child} logo, compact, reversed",
                  kparts("#FFFFFF"), bg=NAVY))


if __name__ == "__main__":
    main()
