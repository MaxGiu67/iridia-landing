#!/usr/bin/env python3
"""
LAIC eBook Template Generator
Genera un PDF template riutilizzabile con lo stesso stile grafico dell'ebook LAIC.

COME USARE:
- Modifica le variabili nella sezione "CONTENUTI PERSONALIZZABILI"
- Esegui lo script per generare il PDF
- Sostituisci i testi segnaposto con i tuoi contenuti
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, Frame
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import textwrap
import os

# ============================================================
# FORMATO PAGINA (identico all'originale: 384 x 600 pt)
# ============================================================
PAGE_W = 384
PAGE_H = 600

# ============================================================
# PALETTE COLORI (estratti dal PDF originale)
# ============================================================
NAVY_DARK    = HexColor("#0F1B2D")    # Sfondo copertina / header scuro
NAVY_MID     = HexColor("#1B2A4A")    # Sfondo sezioni evidenziate
NAVY_LIGHT   = HexColor("#2C3E5A")    # Sfondo secondario
BLUE_ACCENT  = HexColor("#3B82F6")    # Accenti, numeri problemi, link
BLUE_LIGHT   = HexColor("#60A5FA")    # Accenti chiari, icone
CYAN_ACCENT  = HexColor("#22D3EE")    # Decorazioni, highlights
WHITE        = HexColor("#FFFFFF")    # Testo su sfondo scuro
OFF_WHITE    = HexColor("#F0F4F8")    # Sfondo pagine interne
DARK_TEXT     = HexColor("#1E293B")    # Testo principale scuro
GRAY_TEXT     = HexColor("#64748B")    # Testo secondario
LIGHT_GRAY   = HexColor("#E2E8F0")    # Bordi, separatori

# ============================================================
# CONTENUTI PERSONALIZZABILI
# ============================================================

# Branding
BRAND_NAME = "LAIC"
BRAND_TAGLINE = "L'AI che parla la lingua della tua azienda"
WEBSITE = "www.laic.it"
EMAIL = "info@laic.it"

# Copertina
COVER_TITLE = "6 problemi che costano\nalle PMI italiane\nmigliaia di ore l'anno"
COVER_SUBTITLE = "— e che i loro sistemi IT\npotrebbero già risolvere"

# Pagina statistiche (pagina 2)
STATS_TITLE = "Il divario dell'innovazione"
STAT_BIG = "71%"
STAT_BIG_LABEL = "delle grandi imprese\nusa l'AI in Italia"
STAT_SMALL = "8%"
STAT_SMALL_LABEL = "delle PMI italiane\nadotta soluzioni AI"
STATS_SOURCE = "Fonte: Osservatorio AI, Politecnico di Milano, 2025"

# Pagina introduzione (pagina 3)
INTRO_TITLE = "Non parliamo di tecnologia.\nParliamo dei tuoi problemi."
INTRO_TEXT = (
    "Questo ebook non è un manuale tecnico sull'intelligenza artificiale. "
    "È una guida pratica per imprenditori e manager di PMI italiane che vogliono "
    "capire dove stanno perdendo tempo, efficienza e denaro — e cosa possono fare "
    "con gli strumenti che già hanno a disposizione."
)

# Problemi (pagine 4-9) - Lista di tuple (numero, titolo, sottotitolo, testo)
PROBLEMS = [
    (
        1,
        "La conoscenza dispersa",
        "Le informazioni esistono, ma nessuno le trova",
        "In molte PMI, la conoscenza aziendale è frammentata tra email, documenti Word, "
        "fogli Excel, e la memoria dei dipendenti più esperti. Quando qualcuno ha bisogno "
        "di un'informazione, inizia una caccia al tesoro che può durare ore. "
        "L'AI può indicizzare e rendere cercabile tutta la documentazione aziendale, "
        "rispondendo a domande in linguaggio naturale."
    ),
    (
        2,
        "L'estrazione manuale dei dati",
        "Fatture, contratti, ordini: tutto trascritto a mano",
        "Ogni giorno, i tuoi dipendenti copiano dati da fatture, contratti e ordini "
        "in fogli di calcolo o gestionali. È un lavoro ripetitivo, soggetto a errori, "
        "e che sottrae tempo ad attività a maggior valore. "
        "L'AI può estrarre automaticamente i dati dai documenti e inserirli nei tuoi sistemi."
    ),
    (
        3,
        "Il customer service sommerso",
        "Troppe richieste, troppo poco personale",
        "I clienti fanno sempre le stesse domande via email, telefono o chat. "
        "Il tuo team passa ore a rispondere manualmente a richieste ripetitive. "
        "Un assistente AI può gestire le domande frequenti 24/7, escalando solo "
        "i casi complessi al team umano."
    ),
    (
        4,
        "I report manuali",
        "Ogni mese, lo stesso lavoro noioso",
        "Preparare report mensili significa raccogliere dati da diverse fonti, "
        "formattarli, creare grafici e scrivere commenti. Un processo che può "
        "richiedere giorni di lavoro. L'AI può automatizzare la generazione di report, "
        "aggregando dati e producendo analisi in pochi minuti."
    ),
    (
        5,
        "Le approvazioni bloccate",
        "Workflow via email che si perdono nel nulla",
        "Richieste di ferie, ordini di acquisto, autorizzazioni: tutto viaggia via email "
        "e si blocca nella casella di qualcuno. Nessuno sa a che punto è il processo. "
        "L'AI può orchestrare workflow automatici con notifiche, promemoria e "
        "tracciamento in tempo reale."
    ),
    (
        6,
        "L'HR sepolto dal lavoro ripetitivo",
        "Screening CV, onboarding, domande ricorrenti",
        "Il reparto risorse umane dedica gran parte del tempo a screening di CV, "
        "risposte a domande dei dipendenti e processi di onboarding manuali. "
        "L'AI può pre-selezionare candidati, rispondere alle FAQ interne e "
        "guidare i nuovi assunti attraverso i processi di inserimento."
    ),
]

# Pagina conclusiva (il filo conduttore)
CONCLUSION_TITLE = "Il filo conduttore"
CONCLUSION_TEXT = (
    "Tutti questi problemi hanno una cosa in comune: nascono da dati che già esistono "
    "nella tua azienda, ma che non vengono sfruttati in modo efficiente. "
    "L'intelligenza artificiale non serve a sostituire le persone, ma a liberarle "
    "dalle attività ripetitive per concentrarsi su ciò che conta davvero."
)

# CTA (Call to Action)
CTA_TITLE = "Vuoi scoprire come\nrisolvere questi problemi\nnella tua azienda?"
CTA_TEXT = "Prenota una consulenza gratuita di 30 minuti"
CTA_CONTACT = "Scrivi a: info@laic.it\nVisita: www.laic.it"

# Fonti
SOURCES = [
    "Osservatorio Artificial Intelligence, Politecnico di Milano, 2025",
    "McKinsey Global Institute, The State of AI, 2024",
    "ISTAT, Digitalizzazione delle imprese italiane, 2024",
    "Accenture, AI Maturity in European SMEs, 2024",
]


# ============================================================
# FUNZIONI DI DISEGNO
# ============================================================

def draw_rounded_rect(c, x, y, w, h, radius, fill_color=None, stroke_color=None):
    """Disegna un rettangolo arrotondato."""
    p = c.beginPath()
    p.roundRect(x, y, w, h, radius)
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
    c.drawPath(p, fill=1 if fill_color else 0, stroke=1 if stroke_color else 0)


def draw_circle(c, x, y, r, fill_color):
    """Disegna un cerchio pieno."""
    c.setFillColor(fill_color)
    c.circle(x, y, r, fill=1, stroke=0)


def draw_text_block(c, text, x, y, max_width, font_name, font_size, color, leading=None, align="left"):
    """Disegna un blocco di testo con wrap automatico."""
    if leading is None:
        leading = font_size * 1.4

    style = ParagraphStyle(
        'custom',
        fontName=font_name,
        fontSize=font_size,
        leading=leading,
        textColor=color,
        alignment={"left": TA_LEFT, "center": TA_CENTER, "right": TA_RIGHT, "justify": TA_JUSTIFY}.get(align, TA_LEFT),
    )

    p = Paragraph(text.replace('\n', '<br/>'), style)
    w, h = p.wrap(max_width, PAGE_H)
    p.drawOn(c, x, y - h)
    return h


def draw_page_number(c, page_num, total_pages):
    """Disegna il numero di pagina in basso."""
    c.setFont("Helvetica", 8)
    c.setFillColor(GRAY_TEXT)
    c.drawCentredString(PAGE_W / 2, 20, f"{page_num}")


def draw_header_bar(c, brand=True):
    """Disegna la barra header in alto delle pagine interne."""
    # Linea sottile blu in alto
    c.setStrokeColor(BLUE_ACCENT)
    c.setLineWidth(3)
    c.line(0, PAGE_H - 2, PAGE_W, PAGE_H - 2)

    if brand:
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(GRAY_TEXT)
        c.drawString(30, PAGE_H - 25, BRAND_NAME)
        c.setFont("Helvetica", 7)
        c.drawRightString(PAGE_W - 30, PAGE_H - 25, WEBSITE)


def draw_decorative_dots(c, x, y, count=5, spacing=12, radius=2, color=BLUE_LIGHT):
    """Disegna dots decorativi."""
    for i in range(count):
        alpha = 1.0 - (i * 0.15)
        c.setFillColor(color)
        c.circle(x + i * spacing, y, radius * (1 - i * 0.1), fill=1, stroke=0)


# ============================================================
# PAGINE DEL TEMPLATE
# ============================================================

def page_cover(c):
    """Pagina 1: Copertina."""
    # Sfondo scuro pieno
    c.setFillColor(NAVY_DARK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Elementi decorativi - cerchi sfumati
    c.setFillColor(HexColor("#1A2744"))
    c.circle(PAGE_W * 0.8, PAGE_H * 0.85, 80, fill=1, stroke=0)
    c.setFillColor(HexColor("#162240"))
    c.circle(PAGE_W * 0.15, PAGE_H * 0.3, 50, fill=1, stroke=0)

    # Linea decorativa superiore
    c.setStrokeColor(BLUE_ACCENT)
    c.setLineWidth(2)
    c.line(30, PAGE_H - 40, 120, PAGE_H - 40)

    # Brand name
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(WHITE)
    c.drawString(30, PAGE_H - 80, BRAND_NAME)

    # Tagline
    c.setFont("Helvetica", 9)
    c.setFillColor(BLUE_LIGHT)
    c.drawString(30, PAGE_H - 98, BRAND_TAGLINE)

    # Titolo principale
    y_title = PAGE_H * 0.58
    draw_text_block(c, COVER_TITLE, 30, y_title, PAGE_W - 60,
                    "Helvetica-Bold", 24, WHITE, leading=30, align="left")

    # Sottotitolo
    y_sub = PAGE_H * 0.35
    draw_text_block(c, COVER_SUBTITLE, 30, y_sub, PAGE_W - 60,
                    "Helvetica", 15, CYAN_ACCENT, leading=20, align="left")

    # Linea decorativa in basso
    c.setStrokeColor(BLUE_ACCENT)
    c.setLineWidth(1)
    c.line(30, 60, PAGE_W - 30, 60)

    # Website in basso
    c.setFont("Helvetica", 8)
    c.setFillColor(GRAY_TEXT)
    c.drawCentredString(PAGE_W / 2, 40, WEBSITE)


def page_stats(c):
    """Pagina 2: Statistiche impatto."""
    # Sfondo bianco
    c.setFillColor(OFF_WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    draw_header_bar(c)

    # Titolo
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(DARK_TEXT)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 70, STATS_TITLE)

    # Card statistica grande
    card_y = PAGE_H - 250
    draw_rounded_rect(c, 40, card_y, PAGE_W - 80, 140, 10, fill_color=NAVY_DARK)

    # Numero grande
    c.setFont("Helvetica-Bold", 52)
    c.setFillColor(CYAN_ACCENT)
    c.drawCentredString(PAGE_W / 2, card_y + 80, STAT_BIG)

    # Label
    draw_text_block(c, STAT_BIG_LABEL, 40, card_y + 70, PAGE_W - 80,
                    "Helvetica", 12, WHITE, leading=16, align="center")

    # Separatore "VS"
    vs_y = card_y - 30
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(BLUE_ACCENT)
    c.drawCentredString(PAGE_W / 2, vs_y, "VS")

    # Card statistica piccola
    card2_y = vs_y - 150
    draw_rounded_rect(c, 40, card2_y, PAGE_W - 80, 120, 10, fill_color=NAVY_MID)

    c.setFont("Helvetica-Bold", 48)
    c.setFillColor(HexColor("#F87171"))  # Rosso per contrasto
    c.drawCentredString(PAGE_W / 2, card2_y + 65, STAT_SMALL)

    draw_text_block(c, STAT_SMALL_LABEL, 40, card2_y + 55, PAGE_W - 80,
                    "Helvetica", 12, WHITE, leading=16, align="center")

    # Fonte
    c.setFont("Helvetica-Oblique", 7)
    c.setFillColor(GRAY_TEXT)
    c.drawCentredString(PAGE_W / 2, 50, STATS_SOURCE)

    draw_page_number(c, 2, 12)


def page_intro(c):
    """Pagina 3: Introduzione."""
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    draw_header_bar(c)

    # Decorazione
    draw_rounded_rect(c, 30, PAGE_H - 55, 4, 30, 2, fill_color=BLUE_ACCENT)

    # Titolo
    y = PAGE_H - 80
    h = draw_text_block(c, INTRO_TITLE, 45, y, PAGE_W - 75,
                        "Helvetica-Bold", 18, DARK_TEXT, leading=24, align="left")

    # Separatore
    sep_y = y - h - 20
    c.setStrokeColor(LIGHT_GRAY)
    c.setLineWidth(0.5)
    c.line(45, sep_y, PAGE_W - 45, sep_y)

    # Testo
    draw_text_block(c, INTRO_TEXT, 45, sep_y - 15, PAGE_W - 90,
                    "Helvetica", 11, DARK_TEXT, leading=17, align="justify")

    # Box evidenziato in basso
    box_y = 80
    draw_rounded_rect(c, 30, box_y, PAGE_W - 60, 70, 8, fill_color=HexColor("#EFF6FF"))
    draw_rounded_rect(c, 30, box_y, 4, 70, 2, fill_color=BLUE_ACCENT)

    draw_text_block(c, "<b>In questo ebook</b> troverai 6 problemi concreti, con soluzioni "
                    "pratiche che puoi implementare nella tua azienda.",
                    45, box_y + 60, PAGE_W - 100,
                    "Helvetica", 10, DARK_TEXT, leading=14, align="left")

    draw_page_number(c, 3, 12)


def page_problem(c, number, title, subtitle, text, page_num):
    """Pagina problema (template riutilizzabile per ogni sezione)."""
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    draw_header_bar(c)

    # Header sezione con sfondo
    header_h = 160
    header_y = PAGE_H - 38 - header_h

    # Sfondo header navy
    draw_rounded_rect(c, 20, header_y, PAGE_W - 40, header_h, 12, fill_color=NAVY_DARK)

    # Cerchio con numero
    circle_x = 65
    circle_y = header_y + header_h - 40
    draw_circle(c, circle_x, circle_y, 22, BLUE_ACCENT)
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(WHITE)
    c.drawCentredString(circle_x, circle_y - 7, str(number))

    # Label "PROBLEMA"
    c.setFont("Helvetica", 8)
    c.setFillColor(BLUE_LIGHT)
    c.drawString(95, circle_y + 5, f"PROBLEMA {number}")

    # Titolo problema
    draw_text_block(c, title, 40, header_y + header_h - 65, PAGE_W - 80,
                    "Helvetica-Bold", 18, WHITE, leading=22, align="left")

    # Sottotitolo
    draw_text_block(c, subtitle, 40, header_y + 25, PAGE_W - 80,
                    "Helvetica", 10, CYAN_ACCENT, leading=14, align="left")

    # Contenuto
    content_y = header_y - 25
    draw_text_block(c, text, 35, content_y, PAGE_W - 70,
                    "Helvetica", 10.5, DARK_TEXT, leading=16, align="justify")

    # Box soluzione in basso
    sol_y = 70
    draw_rounded_rect(c, 25, sol_y, PAGE_W - 50, 80, 8, fill_color=HexColor("#F0FDF4"))
    draw_rounded_rect(c, 25, sol_y, 4, 80, 2, fill_color=HexColor("#22C55E"))

    draw_text_block(c, "<b>La soluzione:</b> [Inserisci qui la descrizione della soluzione "
                    "specifica per questo problema]",
                    42, sol_y + 68, PAGE_W - 95,
                    "Helvetica", 9.5, DARK_TEXT, leading=14, align="left")

    draw_page_number(c, page_num, 12)


def page_conclusion(c):
    """Pagina 10: Il filo conduttore."""
    c.setFillColor(OFF_WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    draw_header_bar(c)

    # Decorazione superiore
    draw_rounded_rect(c, PAGE_W/2 - 30, PAGE_H - 90, 60, 4, 2, fill_color=BLUE_ACCENT)

    # Titolo
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(DARK_TEXT)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 130, CONCLUSION_TITLE)

    # Testo
    draw_text_block(c, CONCLUSION_TEXT, 40, PAGE_H - 160, PAGE_W - 80,
                    "Helvetica", 11.5, DARK_TEXT, leading=18, align="justify")

    # Punti chiave
    points_y = PAGE_H - 310
    key_points = [
        "I dati esistono già nella tua azienda",
        "L'AI li rende accessibili e utilizzabili",
        "Le persone vengono liberate per attività strategiche",
    ]

    for i, point in enumerate(key_points):
        py = points_y - i * 55
        draw_rounded_rect(c, 35, py, PAGE_W - 70, 45, 8, fill_color=WHITE)

        # Icona check
        draw_circle(c, 60, py + 22, 10, BLUE_ACCENT)
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(WHITE)
        c.drawCentredString(60, py + 18, "✓")

        # Testo
        c.setFont("Helvetica", 10.5)
        c.setFillColor(DARK_TEXT)
        c.drawString(80, py + 18, point)

    draw_page_number(c, 10, 12)


def page_cta(c):
    """Pagina 11: Call to Action."""
    # Sfondo scuro
    c.setFillColor(NAVY_DARK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Elementi decorativi
    c.setFillColor(HexColor("#1A2744"))
    c.circle(50, PAGE_H - 50, 40, fill=1, stroke=0)
    c.circle(PAGE_W - 40, 100, 60, fill=1, stroke=0)

    # Linea decorativa
    c.setStrokeColor(CYAN_ACCENT)
    c.setLineWidth(2)
    c.line(PAGE_W/2 - 40, PAGE_H - 100, PAGE_W/2 + 40, PAGE_H - 100)

    # Titolo CTA
    draw_text_block(c, CTA_TITLE, 35, PAGE_H - 130, PAGE_W - 70,
                    "Helvetica-Bold", 22, WHITE, leading=30, align="center")

    # Sottotitolo
    c.setFont("Helvetica", 12)
    c.setFillColor(BLUE_LIGHT)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 310, CTA_TEXT)

    # Box contatto
    box_y = PAGE_H - 420
    draw_rounded_rect(c, 50, box_y, PAGE_W - 100, 80, 10, fill_color=BLUE_ACCENT)

    draw_text_block(c, CTA_CONTACT, 50, box_y + 70, PAGE_W - 100,
                    "Helvetica-Bold", 12, WHITE, leading=20, align="center")

    # Brand
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(WHITE)
    c.drawCentredString(PAGE_W / 2, 80, BRAND_NAME)
    c.setFont("Helvetica", 8)
    c.setFillColor(GRAY_TEXT)
    c.drawCentredString(PAGE_W / 2, 60, BRAND_TAGLINE)

    draw_page_number(c, 11, 12)


def page_sources(c):
    """Pagina 12: Fonti e riferimenti."""
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    draw_header_bar(c)

    # Titolo
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(DARK_TEXT)
    c.drawString(35, PAGE_H - 70, "Fonti e riferimenti")

    # Linea
    c.setStrokeColor(BLUE_ACCENT)
    c.setLineWidth(2)
    c.line(35, PAGE_H - 78, 130, PAGE_H - 78)

    # Fonti
    y = PAGE_H - 110
    for i, source in enumerate(SOURCES):
        # Numero
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(BLUE_ACCENT)
        c.drawString(35, y, f"[{i+1}]")

        # Testo fonte
        c.setFont("Helvetica", 9)
        c.setFillColor(DARK_TEXT)
        # Wrap text
        lines = textwrap.wrap(source, width=55)
        for line in lines:
            c.drawString(55, y, line)
            y -= 14
        y -= 10

    # Box disclaimer
    disc_y = 80
    draw_rounded_rect(c, 30, disc_y, PAGE_W - 60, 50, 6, fill_color=OFF_WHITE)
    draw_text_block(c, "Questo documento è stato prodotto da " + BRAND_NAME +
                    " a scopo informativo. I dati citati provengono dalle fonti sopra indicate.",
                    40, disc_y + 42, PAGE_W - 80,
                    "Helvetica", 7.5, GRAY_TEXT, leading=11, align="left")

    # Footer brand
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(DARK_TEXT)
    c.drawCentredString(PAGE_W / 2, 50, BRAND_NAME)
    c.setFont("Helvetica", 7)
    c.setFillColor(GRAY_TEXT)
    c.drawCentredString(PAGE_W / 2, 38, f"{WEBSITE}  |  {EMAIL}")

    draw_page_number(c, 12, 12)


# ============================================================
# GENERAZIONE PDF
# ============================================================

def generate_ebook(output_path):
    """Genera l'intero ebook PDF."""
    c = canvas.Canvas(output_path, pagesize=(PAGE_W, PAGE_H))
    c.setTitle(f"{BRAND_NAME} - eBook Template")
    c.setAuthor(BRAND_NAME)
    c.setSubject("eBook Template Riutilizzabile")

    # Pagina 1: Copertina
    page_cover(c)
    c.showPage()

    # Pagina 2: Statistiche
    page_stats(c)
    c.showPage()

    # Pagina 3: Introduzione
    page_intro(c)
    c.showPage()

    # Pagine 4-9: Problemi
    for i, (num, title, subtitle, text) in enumerate(PROBLEMS):
        page_problem(c, num, title, subtitle, text, i + 4)
        c.showPage()

    # Pagina 10: Conclusione
    page_conclusion(c)
    c.showPage()

    # Pagina 11: CTA
    page_cta(c)
    c.showPage()

    # Pagina 12: Fonti
    page_sources(c)

    c.save()
    print(f"✅ eBook generato: {output_path}")
    print(f"   Pagine: 12")
    print(f"   Formato: {PAGE_W} x {PAGE_H} pt")


if __name__ == "__main__":
    output = "/sessions/lucid-hopeful-carson/mnt/laic_lead_magnet/LAIC_ebook_template.pdf"
    generate_ebook(output)
