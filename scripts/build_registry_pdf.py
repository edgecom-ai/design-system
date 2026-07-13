#!/usr/bin/env python3
"""Generate registry-workflow.pdf — a brief one-pager explaining the @edgecom
shadcn registry workflow for developers and stakeholders."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
)

# ---- Edgecom brand ----------------------------------------------------------
PRIMARY = colors.HexColor("#0966C0")   # brand blue
ACCENT = colors.HexColor("#00a991")    # teal accent
INK = colors.HexColor("#1f2733")
MUTED = colors.HexColor("#5b6672")
LIGHT = colors.HexColor("#eef4fb")
BORDER = colors.HexColor("#d7dde5")
OK = colors.HexColor("#0f9d6b")
WARN = colors.HexColor("#c9820a")
PEND = colors.HexColor("#8a94a1")

SANS = "Helvetica"       # clean sans stand-in for Inter (Inter not embedded)
SANS_B = "Helvetica-Bold"

styles = getSampleStyleSheet()

def style(name, **kw):
    base = kw.pop("parent", styles["Normal"])
    return ParagraphStyle(name, parent=base, **kw)

title = style("eTitle", fontName=SANS_B, fontSize=20, textColor=colors.white,
              leading=24)
subtitle = style("eSub", fontName=SANS, fontSize=10.5, textColor=colors.white,
                 leading=14)
h2 = style("eH2", fontName=SANS_B, fontSize=12.5, textColor=PRIMARY,
           spaceBefore=12, spaceAfter=4, leading=15)
body = style("eBody", fontName=SANS, fontSize=9.6, textColor=INK, leading=13.5,
             spaceAfter=4)
small = style("eSmall", fontName=SANS, fontSize=8.4, textColor=MUTED, leading=11)
stage_t = style("eStage", fontName=SANS_B, fontSize=8.2, textColor=colors.white,
                alignment=TA_CENTER, leading=10)
stage_s = style("eStageSub", fontName=SANS, fontSize=6.8, textColor=colors.white,
                alignment=TA_CENTER, leading=8)
cell_h = style("cellH", fontName=SANS_B, fontSize=8.6, textColor=colors.white,
               leading=11)
cell_b = style("cellB", fontName=SANS, fontSize=8.6, textColor=INK, leading=11)
badge = style("badge", fontName=SANS_B, fontSize=8.6, textColor=colors.white,
              alignment=TA_CENTER, leading=11)

story = []

# ---- Header band ------------------------------------------------------------
header = Table(
    [[Paragraph("Edgecom Design System", title)],
     [Paragraph("The <b>@edgecom</b> component registry &mdash; workflow overview", subtitle)]],
    colWidths=[7.0 * inch],
)
header.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PRIMARY),
    ("LEFTPADDING", (0, 0), (-1, -1), 16),
    ("RIGHTPADDING", (0, 0), (-1, -1), 16),
    ("TOPPADDING", (0, 0), (0, 0), 14),
    ("BOTTOMPADDING", (0, 0), (0, 0), 2),
    ("TOPPADDING", (0, 1), (0, 1), 0),
    ("BOTTOMPADDING", (0, 1), (0, 1), 14),
    ("LINEBELOW", (0, -1), (-1, -1), 3, ACCENT),
]))
story += [header, Spacer(1, 10)]

story.append(Paragraph(
    "A single, versioned source of truth for Edgecom's UI tokens and components &mdash; "
    "consumed by the new portal, Claude Code, and Claude Design so everyone builds from "
    "the same design system instead of re-implementing components or hardcoding colors.",
    body))

# ---- What it is -------------------------------------------------------------
story.append(Paragraph("What it is", h2))
story.append(Paragraph(
    "One repository (<b>ee-shadcn</b>) plays two roles at once: a <b>docs / preview site</b> "
    "for browsing components, and the <b>registry server</b> itself. A shadcn registry is "
    "simply <b>&ldquo;components-as-JSON served over HTTP&rdquo;</b> &mdash; you author component "
    "definitions, build them into JSON files, and other projects install them with one command.",
    body))

# ---- Pipeline ---------------------------------------------------------------
story.append(Paragraph("The pipeline &mdash; five stages", h2))

def stage(title_txt, sub_txt):
    return [Paragraph(title_txt, stage_t), Paragraph(sub_txt, stage_s)]

stage_data = [[
    stage("1. Source &amp; restyle", "pull from shadcn studio, restyle to tokens"),
    Paragraph("&rarr;", style("arr", fontName=SANS_B, fontSize=13,
                              textColor=ACCENT, alignment=TA_CENTER)),
    stage("2. Author catalog", "registry.json"),
    Paragraph("&rarr;", style("arr2", fontName=SANS_B, fontSize=13,
                              textColor=ACCENT, alignment=TA_CENTER)),
    stage("3. Build", "pnpm exec shadcn build"),
    Paragraph("&rarr;", style("arr3", fontName=SANS_B, fontSize=13,
                              textColor=ACCENT, alignment=TA_CENTER)),
    stage("4. Serve", "public/r/*.json over HTTP"),
    Paragraph("&rarr;", style("arr4", fontName=SANS_B, fontSize=13,
                              textColor=ACCENT, alignment=TA_CENTER)),
    stage("5. Consume", "shadcn add @edgecom/*"),
]]
bw = 1.16 * inch
aw = 0.28 * inch
pipe = Table(stage_data, colWidths=[bw, aw, bw, aw, bw, aw, bw, aw, bw])
box_style = [
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
]
for col in (0, 2, 4, 6, 8):
    box_style.append(("BACKGROUND", (col, 0), (col, 0),
                      PRIMARY if col in (0, 8) else colors.HexColor("#2b7fd0")))
    box_style.append(("ROUNDEDCORNERS", [4, 4, 4, 4]))
pipe.setStyle(TableStyle(box_style))
story += [pipe, Spacer(1, 2)]
story.append(Paragraph(
    "Stages 1&ndash;3 happen in this repo (producer). Stages 4&ndash;5 are how every "
    "downstream project (consumer) pulls the result.", small))

# ---- Three channels ---------------------------------------------------------
story.append(Paragraph("Who consumes it &mdash; three channels", h2))
ch = Table([[
    Paragraph("<b>New portal</b><br/>Adds <b>@edgecom</b> to its own "
              "<font face='Helvetica-Oblique'>components.json</font>, then runs "
              "<font face='Helvetica-Oblique'>shadcn add @edgecom/theme @edgecom/button</font>. "
              "Tokens &amp; components land in the portal&rsquo;s source.", cell_b),
    Paragraph("<b>Claude Code</b><br/>Via the shadcn MCP server &mdash; a "
              "<b>discovery / install</b> channel, not a runtime token lookup. Once "
              "installed, tokens live in the consumer&rsquo;s <font face='Helvetica-Oblique'>"
              "globals.css</font> as semantic classes.", cell_b),
    Paragraph("<b>Claude Design</b><br/>Runs <font face='Helvetica-Oblique'>/design-sync</font> "
              "from this repo to snapshot the system for design work; re-run after token or "
              "component changes.", cell_b),
]], colWidths=[2.33 * inch, 2.33 * inch, 2.34 * inch])
ch.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.white),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
]))
story += [ch]

# ---- Status table -----------------------------------------------------------
story.append(Paragraph("Where we are today", h2))

def status_badge(label, color):
    t = Table([[Paragraph(label, badge)]], colWidths=[0.95 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("ROUNDEDCORNERS", [3, 3, 3, 3]),
    ]))
    return t

rows = [
    [Paragraph("Stage", cell_h), Paragraph("Status", cell_h), Paragraph("Detail", cell_h)],
    [Paragraph("Theme tokens packaged", cell_b), status_badge("DONE", OK),
     Paragraph("Primary blue, teal accent, chart roles, light/dark &mdash; built &amp; served.", cell_b)],
    [Paragraph("Component primitives", cell_b), status_badge("IN PROGRESS", WARN),
     Paragraph("57 primitives built in <font face='Helvetica-Oblique'>src/</font>, not yet declared as registry items.", cell_b)],
    [Paragraph("Deploy &amp; wire consumers", cell_b), status_badge("PENDING", PEND),
     Paragraph("Publish as a public GitHub registry; wire portal, shadcn MCP, and Claude Design.", cell_b)],
]
st = Table(rows, colWidths=[1.85 * inch, 1.15 * inch, 4.0 * inch])
st.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f6f9fc")]),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("LINEBELOW", (0, 0), (-1, -2), 0.4, BORDER),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
]))
story += [st, Spacer(1, 4)]

# ---- Next steps -------------------------------------------------------------
story.append(Paragraph("Next steps", h2))
story.append(Paragraph(
    "1.&nbsp; Declare each primitive as an item in <font face='Helvetica-Oblique'>registry.json</font> "
    "(with a clear description + dependency links), then rebuild so "
    "<font face='Helvetica-Oblique'>public/r/button.json</font>, "
    "<font face='Helvetica-Oblique'>card.json</font>, etc. exist.<br/>"
    "2.&nbsp; Push the public GitHub repo so items install via <b>edgecom-ai/design-system/&lt;name&gt;</b>.<br/>"
    "3.&nbsp; Wire the consumers: portal <font face='Helvetica-Oblique'>components.json</font>, "
    "the shadcn MCP server, and Claude Design <font face='Helvetica-Oblique'>/design-sync</font>.",
    body))

story += [Spacer(1, 8), HRFlowable(width="100%", thickness=0.5, color=BORDER),
          Spacer(1, 3),
          Paragraph("Edgecom Energy &middot; Design System &middot; internal reference", small)]

doc = SimpleDocTemplate(
    "/Users/bngan/Documents/ee-shadcn/registry-workflow.pdf",
    pagesize=letter,
    leftMargin=0.55 * inch, rightMargin=0.55 * inch,
    topMargin=0.5 * inch, bottomMargin=0.5 * inch,
    title="Edgecom @edgecom Registry Workflow",
    author="Edgecom Energy",
)
doc.build(story)
print("Wrote registry-workflow.pdf")
