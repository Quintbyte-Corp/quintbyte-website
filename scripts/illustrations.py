"""
QuintByte's flat brand illustrations, drawn in code.

Run `python scripts/illustrations.py` to rewrite src/components/art/scenes.ts; the page
components render the scenes inline (components/art/Scene.tsx). Each scene is a list of
beats that build once, in order, when the scene scrolls into view (globals.css, ".qb-scene"):
  IN   fades and rises into place      POP  pops in from its centre
  DRAW draws its lines (paths only)    [beat, beat] plays together
Brand tokens only; figures are faceless; apricot is only ever the client ("you"). The How It
Works scene is hand-built separately (components/sections/ProcessArt.tsx).
"""

import json
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "components", "art", "scenes.ts")

SLATE, MINT, CYAN, BG, APR, PAPER, W = "#334A52", "#E6F4F1", "#01BDE0", "#96AFB8", "#DF9F6E", "#F6F9F9", "#FFFFFF"
SCENES = {}


# ---------------------------------------------------------------- beats and scenes

def IN(m):
    return ("in", m)


def POP(m):
    return ("pop", m)


def DRAW(m):
    return ("draw", m)


def scene(name, beats, w=1600, h=900, wrap=None):
    body, i = "", 0
    for beat in beats:
        group = beat if isinstance(beat, list) else [beat]
        for kind, m in group:
            body += f'<g class="qa qa-{kind}" style="--i:{i}">{m}</g>'
        i += 1
    if wrap:
        body = f'<g transform="{wrap}">{body}</g>'
    body = (f'<rect width="{w}" height="{h}" fill="{PAPER}"/>'
            f'<g stroke-linecap="round" stroke-linejoin="round">{body}</g>')
    # The whole build takes about 1.5s however many beats a scene has
    SCENES[name] = {"w": w, "h": h, "step": min(150, round(1500 / max(i - 1, 1))), "body": body}


FIT = "translate(0 112.5) scale(.75)"  # a 1600x900 scene shown whole on a 1200x900 canvas


# ---------------------------------------------------------------- drawing helpers

def at(x, y, s, body):
    return f'<g transform="translate({x} {y}) scale({s})">{body}</g>'


def rect(x, y, w, h, fill=W, stroke=SLATE, sw=4, rx=10, extra=""):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{st}{extra}/>'


def circle(cx, cy, r, fill=W, stroke=SLATE, sw=4):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"{st}/>'


def line(d, stroke=BG, sw=4, extra=""):
    return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}"{extra}/>'


def drw(d, stroke=BG, sw=4):
    """A line that draws itself (use inside DRAW)"""
    return line(d, stroke, sw, ' pathLength="100"')


def dotted(d):
    return line(d, extra=' stroke-dasharray="2 14"')


def bars(x, y, widths, gap=26, sw=8, stroke=BG):
    return "".join(line(f"M{x} {y + i * gap}h{w}", stroke, sw) for i, w in enumerate(widths))


def tick(cx, cy, s=1, stroke=SLATE, sw=5):
    return line(f"M{cx - 10 * s} {cy}l{7 * s} {7 * s} {14 * s}-{15 * s}", stroke, sw)


def check_node(cx, cy, r=18):
    return circle(cx, cy, r, W, SLATE, 4) + tick(cx, cy + 1, r / 18, SLATE, 4)


def step_node(cx, cy, r=18):
    return circle(cx, cy, r, W, BG, 4) + circle(cx, cy, r * 0.42, CYAN, None)


def node(cx, cy, r=8):
    return circle(cx, cy, r, CYAN, None)


def window(x, y, w, h):
    s = rect(x, y, w, h, W, SLATE, 5, 18) + line(f"M{x} {y + 52}H{x + w}", SLATE, 4)
    return s + "".join(circle(x + 32 + i * 26, y + 26, 7, BG, None) for i in range(3))


def doc(x, y, w, h, n=4, fill=W, rot=0):
    t = f' transform="rotate({rot} {x + w / 2} {y + h / 2})"' if rot else ""
    s = rect(x, y, w, h, fill, SLATE, 4, 8)
    s += bars(x + 28, y + 36, [max(w - 56 - (i % 2) * 40, 20) for i in range(n)])
    return f"<g{t}>{s}</g>"


def envelope(x, y, w=120, h=80, fill=W):
    return rect(x, y, w, h, fill, SLATE, 4, 8) + line(f"M{x + 4} {y + 6}l{w / 2 - 4} {h * 0.55} {w / 2 - 4}-{h * 0.55}", SLATE, 4)


def gear(cx, cy, r, fill=W):
    teeth = "".join(f'<rect x="{cx - r * 0.2}" y="{cy - r * 1.22}" width="{r * 0.4}" height="{r * 0.5}" rx="4" '
                    f'fill="{fill}" stroke="{SLATE}" stroke-width="4" transform="rotate({i * 45} {cx} {cy})"/>'
                    for i in range(8))
    return teeth + circle(cx, cy, r, fill, SLATE, 4) + circle(cx, cy, r * 0.36, PAPER, SLATE, 4)


def avatar(cx, cy, r=20, fill=BG):
    return circle(cx, cy, r, fill, None)


def card(x, y, w=210, h=86, fill=W, rot=0, check=False):
    t = f' transform="rotate({rot} {x + w / 2} {y + h / 2})"' if rot else ""
    s = (rect(x, y, w, h, fill, SLATE, 4, 10) + avatar(x + 40, y + h / 2)
         + line(f"M{x + 76} {y + 32}H{x + w - 30}M{x + 76} {y + 56}H{x + w - 70}", BG, 8))
    if check:
        s += check_node(x + w - 4, y + 4)
    return f"<g{t}>{s}</g>"


def shadow(cx, y, rx=70):
    return f'<ellipse cx="{cx}" cy="{y}" rx="{rx}" ry="10" fill="{BG}" opacity=".35"/>'


def seated(cx, shirt, top=446, bottom=560):
    return (f'<path d="M{cx-62} {bottom}V{top+42}Q{cx-62} {top} {cx-20} {top}H{cx+20}Q{cx+62} {top} {cx+62} {top+42}V{bottom}Z" '
            f'fill="{shirt}" stroke="{SLATE}" stroke-width="4"/>' + circle(cx, top - 44, 36, SLATE, None))


def laptop_back(cx, y=486):
    return rect(cx - 58, y, 116, 74, W, SLATE, 4, 8) + node(cx, y + 37, 7)


def standing(cx, shirt, top=360, floor=752, arm=None):
    s = shadow(cx, floor + 6, 80)
    s += (f'<rect x="{cx-44}" y="{top+190}" width="36" height="{floor-top-190}" rx="14" fill="{SLATE}"/>'
          f'<rect x="{cx+8}" y="{top+190}" width="36" height="{floor-top-190}" rx="14" fill="{SLATE}"/>')
    s += (f'<path d="M{cx-62} {top+200}V{top+50}Q{cx-62} {top} {cx-12} {top}H{cx+12}Q{cx+62} {top} {cx+62} {top+50}V{top+200}Z" '
          f'fill="{shirt}" stroke="{SLATE}" stroke-width="5"/>')
    if arm:
        (x1, y1), (x2, y2) = arm
        s += line(f"M{x1} {y1}L{x2} {y2}", SLATE, 24)
    return s + circle(cx, top - 44, 38, SLATE, None)


def plant(x, floor, s=1):
    b = (line("M0 0c-30-60-10-110 0-130M0 0c10-50 40-90 70-100M0 0c-20-40-60-60-90-60", SLATE, 5)
         + f'<ellipse cx="-4" cy="-130" rx="16" ry="34" fill="{MINT}" stroke="{SLATE}" stroke-width="4"/>'
         + f'<ellipse cx="70" cy="-100" rx="34" ry="16" fill="{MINT}" stroke="{SLATE}" stroke-width="4" transform="rotate(-30 70 -100)"/>'
         + f'<ellipse cx="-88" cy="-60" rx="34" ry="16" fill="{MINT}" stroke="{SLATE}" stroke-width="4" transform="rotate(20 -88 -60)"/>'
         + f'<path d="M-34 0h68l-8 70h-52z" fill="{W}" stroke="{SLATE}" stroke-width="5"/>')
    return at(x, floor - 70 * s, s, b)


def mug(x, y, fill=MINT):
    return rect(x, y, 56, 60, fill, SLATE, 4, 4) + line(f"M{x + 56} {y + 12}c22 0 22 34 0 34", SLATE, 4)


def desk(x1, x2, y, legs=True, floor=None):
    s = rect(x1, y, x2 - x1, 18, SLATE, None, 0, 9)
    if legs:
        h = (floor or y + 140) - y - 12
        s += rect(x1 + 30, y + 12, 14, h, SLATE, None, 0, 7) + rect(x2 - 44, y + 12, 14, h, SLATE, None, 0, 7)
    return s


def bubble(x, y, w, h, fill=W, tail="left"):
    tx = x + 50 if tail == "left" else x + w - 50
    d = (f"M{x + 20} {y}h{w - 40}a20 20 0 0 1 20 20v{h - 40}a20 20 0 0 1-20 20"
         + (f"H{tx + 30}l-30 28v-28H{x + 20}" if tail == "left" else f"H{tx}v28l-30-28H{x + 20}")
         + f"a20 20 0 0 1-20-20v-{h - 40}a20 20 0 0 1 20-20z")
    return f'<path d="{d}" fill="{fill}" stroke="{SLATE}" stroke-width="4"/>'


def floor(y=760, x1=80, x2=1520):
    return DRAW(drw(f"M{x1} {y}H{x2}", BG, 3))


# ================================================================ page scenes

# Home (16:9): you, your lead, and the team behind them
board = rect(1300, 250, 200, 230, W, BG, 4, 12) + "".join(
    rect(x, y, 72, 60, MINT if i != 2 else W, SLATE, 3, 6)
    for i, (x, y) in enumerate([(1322, 274), (1406, 274), (1322, 352), (1406, 352), (1322, 430)])) + tick(1356, 380, 1.3)
team = [560, 760, 960, 1160]
scene("home", [
    floor(),
    [IN(desk(470, 1250, 560, floor=760)), IN(board), IN(plant(1400, 760))],
    *[IN(seated(x, shirt) + laptop_back(x)) for x, shirt in zip(team, [MINT, W, BG, MINT])],
    IN(rect(846, 534, 24, 26, W, SLATE, 3, 2) + line("M870 540c10 0 10 14 0 14", SLATE, 3)),
    IN(standing(170, APR, arm=((222, 400), (262, 470)))),
    IN(standing(380, W, arm=((330, 400), (290, 468))) + rect(268, 440, 56, 74, MINT, SLATE, 4, 6, ' transform="rotate(-8 296 477)"')),
    DRAW(drw("M380 270V200H1160") + "".join(drw(f"M{x} 200V346") for x in team)),
    [POP(node(x, 350)) for x in team],
    POP(bubble(90, 150, 210, 86) + "".join(node(160 + i * 36, 193) for i in range(3))),
])

# Training (16:10): one of us teaching the others a tool
scene("training", [
    floor(860),
    [IN(rect(470, 110, 600, 340, W, SLATE, 5, 14) + rect(510, 150, 220, 22, SLATE, None, 0, 11)),
     IN(rect(110, 300, 200, 300, W, BG, 4, 10) + "".join(
         line(f"M110 {y + 60}H310", BG, 4) + "".join(rect(130 + j * 42, y, w, 58, f, SLATE, 3, 3)
                                                    for j, (w, f) in enumerate([(30, MINT), (24, W), (36, BG), (28, W)]))
         for y in [340, 420, 500])),
     IN(plant(1460, 860, 0.9))],
    IN(standing(1240, W, top=470, floor=860, arm=((1188, 510), (1100, 430)))),
    DRAW(drw("M560 300H1000")),
    [POP(step_node(560, 300, 22)), POP(step_node(780, 300, 22)), POP(check_node(1000, 300, 22))],
    IN(rect(500, 360, 520, 50, MINT, None, 0, 10) + bars(530, 385, [300], sw=8, stroke=SLATE)),
    *[IN(seated(x, shirt, top=630, bottom=760)) for x, shirt in zip([440, 640, 840], [MINT, BG, W])],
    IN(desk(330, 960, 760, floor=860) + rect(400, 712, 110, 48, W, SLATE, 4, 4) + rect(610, 718, 90, 42, MINT, SLATE, 4, 4) + mug(830, 700, W)),
], 1600, 1000)

# Services (16:9): the services around one accountable lead, with you below
hub = (800, 420)
tiles = [(330, 210), (330, 450), (330, 690), (1270, 210), (1270, 450), (1270, 690)]
edge = [(tx + 110 if tx < 800 else tx - 110, ty) for tx, ty in tiles]
cal = (rect(280, 166, 100, 90, W, SLATE, 4, 8) + rect(280, 166, 100, 24, SLATE, None, 0, 8)
       + "".join(rect(294 + c * 26, 202 + r * 24, 18, 16, MINT if (r, c) == (1, 2) else PAPER, BG, 2, 3)
                 for r in range(2) for c in range(3)))
icons = [
    cal,
    rect(268, 412, 124, 76, W, SLATE, 4, 8) + avatar(300, 450, 18) + bars(326, 440, [44, 30], gap=22),
    bubble(260, 638, 110, 60, MINT) + bubble(310, 684, 90, 50, W, tail="right"),
    rect(1206, 164, 128, 92, W, SLATE, 4, 8) + line("M1206 186H1334", SLATE, 4)
    + line("M1250 206l-16 14 16 14M1290 206l16 14-16 14M1276 202l-12 36", SLATE, 5),
    f'<path d="M1230 380h80v120l-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z" fill="{W}" stroke="{SLATE}" stroke-width="4"/>'
    + bars(1246, 410, [48, 36, 48], gap=22, sw=6),
    gear(1270, 690, 36),
]
scene("services", [
    POP(circle(*hub, 80, W, SLATE, 6) + circle(*hub, 30, CYAN, None)),
    DRAW("".join(drw(f"M{hub[0]} {hub[1]}L{ex} {ey}") for ex, ey in edge)),
    *[IN(rect(tx - 110, ty - 85, 220, 170, W, SLATE, 4, 14) + ic) for (tx, ty), ic in zip(tiles, icons)],
    [POP(node(ex, ey, 9)) for ex, ey in edge],
    DRAW(drw(f"M{hub[0]} {hub[1] + 80}V750", CYAN, 4)),
    POP(circle(800, 772, 22, APR, None)),
])

# About (16:9): five friends, one firm
scene("about", [
    floor(790),
    IN(rect(380, 110, 840, 440, W, BG, 4, 16) + line("M800 110V550M380 330H1220", BG, 4)),
    DRAW(drw("M420 470l120-90 90 60 140-120 120 100 110-70 180 120")),
    [IN(plant(200, 790)), IN(plant(1420, 790, 1.1))],
    *[IN(standing(x, shirt, top=top, floor=782))
      for x, top, shirt in [(520, 400, MINT), (660, 380, W), (800, 360, BG), (940, 385, W), (1080, 405, MINT)]],
])

# Contact (4:3): your message reaching us
scene("contact", [
    floor(),
    IN(desk(300, 1300, 620, floor=760) + mug(1120, 560) + rect(380, 584, 130, 36, W, SLATE, 4, 4)),
    IN(rect(560, 260, 480, 320, W, SLATE, 5, 16) + f'<path d="M520 580h560l-30 40H550z" fill="{W}" stroke="{SLATE}" stroke-width="5"/>'),
    IN("".join(rect(600, y, w, 30 if i < 2 else 100, PAPER, BG, 3, 6) for i, (y, w) in enumerate([(300, 220), (350, 400), (400, 400)]))
       + bars(620, 430, [280, 240], sw=7) + rect(600, 520, 150, 40, SLATE, None, 0, 6)),
    POP(circle(190, 300, 22, APR, None)),
    IN(dotted("M190 300C300 140 520 120 800 160S1300 180 1400 300")),
    POP(f'<g transform="rotate(-6 800 160)">{envelope(740, 120)}</g>'),
    POP(circle(1400, 300, 44, W, SLATE, 5)),
    DRAW(drw("M1382 302l12.6 12.6 25.2-27", SLATE, 6)),
], 1200, 900, FIT)

# ================================================================ service scenes (4:3; key content inside y 90-810)

cells = "".join(rect(150 + c * 86, 270 + r * 88, 68, 70, MINT if (r, c) == (1, 3) else W, BG, 3, 6) for r in range(4) for c in range(5))
dial = "".join(line(f"M{880 + 98 * math.sin(math.radians(i * 30)):.1f} {300 - 98 * math.cos(math.radians(i * 30)):.1f}"
                    f"L{880 + 108 * math.sin(math.radians(i * 30)):.1f} {300 - 108 * math.cos(math.radians(i * 30)):.1f}", BG, 4) for i in range(12))
scene("svc-executive-assistance", [
    DRAW(drw("M80 709H1120", SLATE, 18)),
    IN(rect(120, 170, 470, 470, W, SLATE, 5, 16) + rect(120, 170, 470, 70, SLATE, None, 0, 16) + rect(120, 220, 470, 20, SLATE, None, 0, 0)
       + circle(210, 170, 12, W, SLATE, 4) + circle(500, 170, 12, W, SLATE, 4) + cells),
    [POP(node(184, 481, 9)), POP(node(356, 305, 9))],
    IN(circle(880, 300, 120, W, SLATE, 5) + dial),
    DRAW(drw("M880 300V222", SLATE, 8) + drw("M880 300l52 34", SLATE, 8)),
    IN(f'<path d="M680 560h300v140H680z" fill="{W}" stroke="{SLATE}" stroke-width="5"/>' + line("M680 610h80l20 30h120l20-30h80", SLATE, 4)),
    IN(envelope(720, 470, 150, 96)),
    IN(envelope(760, 500, 150, 96, MINT)),
], 1200, 900)

drawers = "".join(line(f"M680 {y}H1010", SLATE, 4) + rect(810, y + 34, 70, 16, BG, None, 0, 8) for y in [400, 500, 600])
scene("svc-administrative-operations-support", [
    DRAW(drw("M60 709H1140", SLATE, 18)),
    *[IN(doc(x, y, 180, 230, 4, W, r)) for x, y, r in [(110, 470, -12), (150, 430, 8), (100, 400, -4), (170, 380, 14)]],
    IN(rect(680, 300, 330, 400, W, SLATE, 5, 12) + drawers),
    IN(dotted("M380 520C460 520 520 600 640 600") + node(640, 600, 9)),
    IN("".join(rect(710 + j * 72, 250 + (j % 2) * 10, 62, 110, f, SLATE, 4, 6) for j, f in enumerate([MINT, W, BG, MINT]))
       + rect(690, 330, 310, 70, W, SLATE, 5, 6) + rect(810, 356, 70, 16, BG, None, 0, 8)),
    IN(rect(380, 120, 220, 290, W, SLATE, 5, 10) + rect(445, 106, 90, 30, SLATE, None, 0, 6)
       + "".join(rect(410, y, 34, 34, W, SLATE, 4, 6) + bars(462, y + 17, [100 - i * 10]) for i, y in enumerate([180, 250, 320]))),
    [DRAW(drw("M417 196l7 7 12-13", SLATE, 5)), DRAW(drw("M417 266l7 7 12-13", SLATE, 5))],
], 1200, 900)

cols = [480, 830, 1180]
scene("svc-crm-sales-support", [
    [IN(card(x, y, rot=r)) for x, y, r in [(70, 300, -14), (90, 380, 9), (60, 470, -6), (100, 560, 12), (70, 640, -10)]],
    IN(window(440, 110, 1100, 680) + "".join(rect(cx, 200, 320, 560, PAPER, None, 0, 12) + rect(cx + 24, 224, [110, 150, 90][i], 14, SLATE, None, 0, 7)
                                              for i, cx in enumerate(cols))),
    IN(dotted("M330 500C400 500 400 300 460 300") + node(462, 300, 9)),
    *[IN(card(cols[0] + 24, y, w=272)) for y in [264, 370, 476, 582]],
    [IN(card(cols[1] + 24, y, w=272)) for y in [264, 370]],
    *[POP(card(cols[2] + 24, y, w=272, check=True)) for y in [264, 370, 476]],
    IN(card(cols[1] + 120, 500, w=272, fill=MINT, rot=-4)
       + f'<path d="M1196 548l0 58 16-14 12 26 14-6-12-26 22-2z" fill="{SLATE}" stroke="{W}" stroke-width="3"/>'),
], 1200, 900, FIT)

headset = (line("M-40 -50C-40 -110 40 -110 40 -50", BG, 9) + circle(-40, -44, 13, BG, None) + circle(40, -44, 13, BG, None)
           + line("M-40 -34Q-34 -6 -8 -8", BG, 6) + node(-8, -8, 6))
scene("svc-customer-service-client-support", [
    IN(at(600, 500, 1.6, seated(0, MINT, top=0, bottom=114) + laptop_back(0, 40) + rect(-230, 114, 460, 16, SLATE, None, 0, 8))),
    POP(at(600, 500, 1.6, headset)),
    POP(bubble(110, 190, 320, 120) + avatar(170, 238, 26, APR) + bars(216, 230, [170, 120], gap=24)),
    POP(bubble(150, 380, 210, 80) + "".join(node(205 + k * 34, 418, 8) for k in range(3))),
    POP(bubble(780, 250, 320, 120, MINT, tail="right") + bars(816, 290, [210, 150], gap=24, stroke=SLATE)),
    POP(check_node(1060, 260, 20)),
], 1200, 900)


def post(x, y, fill):
    return (rect(x, y, 150, 186, fill, SLATE, 4, 10) + rect(x + 16, y + 16, 118, 90, PAPER, BG, 3, 6)
            + f'<path d="M{x + 22} {y + 100}l34-40 26 26 18-16 30 30z" fill="{BG}"/>' + node(x + 108, y + 38, 9)
            + bars(x + 18, y + 134, [100, 70], gap=22, sw=7))


scene("svc-marketing-creative-support", [
    IN(rect(70, 160, 720, 520, W, SLATE, 5, 16) + "".join(rect(100 + c * 172, 190, 90, 14, SLATE, None, 0, 7) for c in range(4))),
    *[POP(post(100 + c * 172, 230 + r * 210, MINT if (c, r) == (2, 0) else W))
      for c, r in [(0, 0), (1, 0), (2, 0), (3, 0), (0, 1), (2, 1)]],
    IN(rect(830, 456, 50, 76, SLATE, None, 0, 10) + f'<path d="M880 462L1040 380V610L880 526z" fill="{W}" stroke="{SLATE}" stroke-width="5"/>'
       + rect(1030, 372, 26, 246, SLATE, None, 0, 10) + f'<path d="M920 530l-14 90h44l10-74z" fill="{SLATE}"/>'),
    DRAW(drw("M1086 430Q1112 495 1086 560")),
    DRAW(drw("M1120 400Q1158 495 1120 590")),
    DRAW(drw("M1154 370Q1200 495 1154 620")),
], 1200, 900)

handles = "".join(rect(hx - 8, hy - 8, 16, 16, W, CYAN, 3, 2) for hx, hy in [(690, 230), (880, 230), (690, 420), (880, 420)])
scene("svc-graphic-design-creative-production", [
    IN(rect(220, 140, 760, 520, W, SLATE, 5, 12)),
    POP(circle(440, 380, 130, MINT, SLATE, 4)),
    POP(f'<path d="M560 520l110-200 110 200z" fill="{W}" stroke="{SLATE}" stroke-width="4"/>'),
    POP(rect(700, 240, 170, 170, BG, SLATE, 4, 10)),
    IN(rect(690, 230, 190, 190, "none", CYAN, 3, 0) + handles),
    DRAW(drw("M300 600C420 500 560 640 900 560", SLATE, 5)),
    IN(line("M300 600L380 520M900 560L820 620", BG, 3) + circle(380, 520, 8, W, BG, 3) + circle(820, 620, 8, W, BG, 3)
       + rect(291, 591, 18, 18, W, SLATE, 4, 2) + rect(891, 551, 18, 18, W, SLATE, 4, 2)),
    [POP(circle(420 + i * 90, 740, 30, f, SLATE, 4)) for i, f in enumerate([SLATE, MINT, CYAN, BG, W])],
], 1200, 900)

scene("svc-it-technical-support", [
    DRAW(drw("M60 669H1140", SLATE, 18)),
    IN(rect(200, 210, 520, 340, W, SLATE, 5, 16) + f'<path d="M160 550h600l-34 50H194z" fill="{W}" stroke="{SLATE}" stroke-width="5"/>'),
    *[IN(rect(240, y, 440, 60, MINT if i == 2 else PAPER, None, 0, 10) + bars(312, y + 30, [250 - i * 40]))
      for i, y in enumerate([260, 340, 420])],
    [POP(check_node(276, y + 30, 18)) for y in [260, 340, 420]],
    POP(gear(950, 290, 80)),
    IN(f'<path d="M820 470h260v100a12 12 0 0 1-12 12H832a12 12 0 0 1-12-12z" fill="{W}" stroke="{SLATE}" stroke-width="5"/>'
       + line("M860 470l-20-90M1040 470l20-90", SLATE, 6) + "".join(node(870 + i * 34, 526, 8) for i in range(3)) + line("M1000 526h40", BG, 8)),
    DRAW(drw("M790 420Q770 390 790 360") + drw("M760 440Q725 390 760 340")),
], 1200, 900)

scene("svc-website-digital-solutions", [
    IN(window(110, 150, 760, 540) + node(160, 240, 12) + "".join(rect(600 + k * 70, 233, 50, 14, BG, None, 0, 7) for k in range(3))),
    IN(rect(150, 290, 300, 28, SLATE, None, 0, 14) + rect(150, 334, 220, 28, SLATE, None, 0, 14)
       + bars(150, 400, [280, 230], gap=26, sw=8) + rect(150, 450, 150, 46, SLATE, None, 0, 8)),
    IN(rect(500, 290, 330, 210, MINT, None, 0, 12) + f'<path d="M540 470l90-100 70 70 40-40 50 70z" fill="{BG}"/>'),
    [IN(rect(150 + k * 232, 540, 210, 116, PAPER, BG, 3, 10)) for k in range(3)],
    IN(rect(820, 320, 230, 450, W, SLATE, 5, 30) + rect(890, 340, 90, 12, BG, None, 0, 6)
       + rect(846, 376, 178, 110, MINT, None, 0, 10) + rect(846, 506, 140, 20, SLATE, None, 0, 10)
       + bars(846, 556, [170, 130, 160], gap=26, sw=8) + rect(846, 650, 120, 40, SLATE, None, 0, 8)),
    POP(rect(880, 110, 230, 150, SLATE, None, 0, 16)),
    DRAW(drw("M950 160l-30 26 30 26", W, 7) + drw("M1040 160l30 26-30 26", W, 7) + drw("M1010 150l-30 72", W, 7)),
], 1200, 900)

scene("svc-ai-automation-support", [
    IN(rect(100, 360, 200, 140, W, SLATE, 4, 16) + envelope(140, 390, 120, 80)),
    DRAW(drw("M300 430H430")),
    POP(circle(500, 430, 90, W, SLATE, 5) + gear(500, 430, 42, MINT)),
    DRAW(drw("M570 430C620 430 620 270 700 270") + drw("M570 430C620 430 620 590 700 590")),
    [IN(rect(700, 200, 200, 140, W, SLATE, 4, 16) + doc(760, 222, 80, 100, 3)),
     IN(rect(700, 520, 200, 140, W, SLATE, 4, 16) + rect(726, 554, 148, 72, W, SLATE, 4, 8) + avatar(760, 590, 18) + bars(788, 580, [60, 40], gap=20, sw=6))],
    DRAW(drw("M900 270C960 270 960 430 990 430") + drw("M900 590C960 590 960 430 990 430")),
    [POP(node(x, y, 9)) for x, y in [(430, 430), (700, 270), (700, 590), (990, 430)]],
    POP(circle(1070, 430, 80, W, SLATE, 5) + circle(1070, 410, 26, SLATE, None) + f'<path d="M1026 488a44 44 0 0 1 88 0" fill="{BG}"/>'),
    POP(check_node(1130, 370, 24)),
], 1200, 900)

ledger = (rect(140, 140, 420, 560, W, SLATE, 5, 12) + rect(140, 140, 420, 64, SLATE, None, 0, 12) + rect(140, 180, 420, 24, SLATE, None, 0, 0)
          + "".join(bars(176, 240 + i * 46, [190]) + bars(436, 240 + i * 46, [90]) for i in range(5)))
receipt = lambda x, y, r: (f'<g transform="rotate({r} {x + 90} {y + 150})"><path d="M{x} {y}h180v300l-15-12-15 12-15-12-15 12-15-12-15 12-15-12-15 12-15-12-15 12-15-12z" '
                           f'fill="{W}" stroke="{SLATE}" stroke-width="4"/>' + bars(x + 30, y + 50, [120, 90, 120, 60, 100], gap=36, sw=7) + "</g>")
keys = "".join(rect(652 + c * 70, 466 + r * 56, 56, 40, SLATE if (r, c) == (3, 2) else PAPER, BG, 3, 6) for r in range(4) for c in range(3))
scene("svc-bookkeeping-finance-support", [
    DRAW(drw("M60 739H1140", SLATE, 18)),
    IN(ledger),
    *[POP(rect(190 + i * 82, 660 - h, 54, h, f, SLATE, 3, 4)) for i, (h, f) in enumerate([(70, BG), (100, BG), (90, BG), (140, MINT)])],
    IN(receipt(880, 170, 6)),
    IN(receipt(910, 210, -4)),
    IN(f'<g transform="rotate(-8 750 520)">' + rect(620, 340, 260, 360, W, SLATE, 5, 20) + rect(650, 370, 200, 70, MINT, SLATE, 4, 8)
       + bars(700, 405, [120], sw=8, stroke=SLATE) + keys + "</g>"),
], 1200, 900)


def profile(cx, y, fill):
    return (rect(cx - 115, y, 230, 310, fill, SLATE, 5, 16) + rect(cx - 30, y + 18, 60, 12, BG, None, 0, 6)
            + circle(cx, y + 104, 40, SLATE, None) + f'<path d="M{cx - 62} {y + 210}a62 62 0 0 1 124 0z" fill="{BG}"/>'
            + bars(cx - 70, y + 248, [140, 100], gap=26, sw=8))


scene("svc-human-resources-people-support", [
    IN(profile(330, 190, W)),
    IN(line("M560 90L600 160L640 90", BG, 4) + profile(600, 160, MINT)),
    IN(profile(870, 190, W)),
    DRAW(drw("M356 620H844")),
    POP(step_node(330, 620, 26)),
    POP(step_node(600, 620, 26)),
    POP(check_node(870, 620, 26)),
], 1200, 900)

pts = [(220, 520), (300, 470), (380, 490), (460, 400), (560, 360)]
scene("svc-research-data-support", [
    IN(rect(150, 130, 480, 600, W, SLATE, 5, 12) + rect(190, 170, 220, 22, SLATE, None, 0, 11) + bars(190, 230, [380, 320, 360], gap=28, sw=7)
       + line("M190 330V560H590", BG, 3)),
    *[POP(rect(200 + i * 100, 680 - h, 60, h, MINT if i == 3 else BG, None, 0, 4)) for i, h in enumerate([50, 80, 60, 110])],
    DRAW(drw("M" + "L".join(f"{x} {y}" for x, y in pts), SLATE, 5)),
    [POP(node(x, y, 8)) for x, y in pts],
    IN(rect(740, 140, 320, 260, W, SLATE, 5, 16) + circle(860, 270, 80, BG, SLATE, 4) + bars(970, 230, [50, 40, 50], gap=34, sw=8)),
    POP(f'<path d="M860 270V190A80 80 0 0 1 936 295z" fill="{MINT}" stroke="{SLATE}" stroke-width="4"/>'),
    IN(line("M830 640L930 740", SLATE, 26) + circle(740, 550, 130, W, SLATE, 14)),
    DRAW(drw("M660 560L700 520 740 540 800 480", SLATE, 5)),
    POP(node(800, 480, 9)),
], 1200, 900)

scene("svc-business-operations-management-support", [
    IN(window(100, 140, 1000, 600) + rect(140, 230, 400, 470, PAPER, None, 0, 14) + bars(200, 600, [280, 200], gap=30, sw=8)),
    DRAW(drw("M220 520A120 120 0 0 1 460 520", BG, 22)),
    DRAW(f'<path d="M220 520A120 120 0 0 1 400 416" pathLength="100" fill="none" stroke="{CYAN}" stroke-width="22" stroke-linecap="butt"/>'),
    POP(line("M340 520L410 440", SLATE, 8) + circle(340, 520, 14, SLATE, None)),
    *[POP(rect(580 + i * 166, 230, 146, 160, MINT if i == 1 else W, SLATE, 4, 12) + rect(600 + i * 166, 256, 60, 12, BG, None, 0, 6)
          + rect(600 + i * 166, 290, 70, 30, SLATE, None, 0, 6) + line(f"M{600 + i * 166} 360l30-12 26 6 40-20", SLATE, 4)) for i in range(3)],
    IN(rect(580, 430, 480, 270, W, BG, 3, 12) + "".join(rect(x - 50, 520, 100, 70, W, SLATE, 4, 10) + bars(x - 28, 555, [56], sw=7) for x in [640, 820, 1000])),
    DRAW(drw("M690 555H770") + drw("M870 555H950")),
    [POP(node(730, 555, 8)), POP(node(910, 555, 8))],
    POP(check_node(1040, 520, 18)),
], 1200, 900)

rows = [(320, 260, BG), (420, 300, MINT), (560, 260, BG), (640, 330, SLATE), (800, 220, MINT)]
scene("svc-custom-project-based-support", [
    IN(rect(100, 140, 1000, 500, W, SLATE, 5, 16) + line("M100 210H1100", SLATE, 4)
       + "".join(rect(320 + k * 130, 170, 60, 14, BG, None, 0, 7) + line(f"M{300 + k * 130} 210V640", PAPER, 3) for k in range(6))
       + "".join(rect(140, 250 + i * 74, 120, 18, BG, None, 0, 9) for i in range(5))),
    *[IN(rect(x, 238 + i * 74, w, 42, f, SLATE if f != SLATE else None, 3, 12)) for i, (x, w, f) in enumerate(rows)],
    DRAW(drw("M770 222V640", CYAN, 4)),
    POP(node(770, 210, 10)),
    POP(f'<path d="M1040 556l24 24-24 24-24-24z" fill="{SLATE}"/>' + line("M1040 556V500", SLATE, 4)
        + f'<path d="M1040 500h40l-12 14 12 14h-40z" fill="{MINT}" stroke="{SLATE}" stroke-width="3"/>'),
    *[IN(rect(x, 690, 120, 100, f, SLATE, 4, 6, f' transform="rotate({r} {x + 60} 740)"')) for x, r, f in [(360, -5, MINT), (520, 4, W), (680, -3, MINT)]],
    DRAW(drw("M567 742l9.1 9.1 18.2-19.5", SLATE, 5)),
], 1200, 900)

# ================================================================ write

names = sorted(SCENES)
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Generated by scripts/illustrations.py: edit the script, not this file.\n")
    f.write("// Each scene: its canvas size, ms between build beats, and the inner SVG markup.\n\n")
    f.write("export const scenes = {\n")
    for n in names:
        s = SCENES[n]
        f.write(f"  {json.dumps(n)}: {{ w: {s['w']}, h: {s['h']}, step: {s['step']}, body: {json.dumps(s['body'])} }},\n")
    f.write("} as const;\n\nexport type SceneName = keyof typeof scenes;\n")
print(f"{len(names)} scenes, {os.path.getsize(OUT) // 1024} KB -> {os.path.relpath(OUT, ROOT)}")
