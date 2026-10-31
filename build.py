#!/usr/bin/env python3
"""Generates the static bilingual site into ./public  (run: python3 build.py)"""
import random, html, pathlib

OUT = pathlib.Path(__file__).parent / "public"
EMAIL = "africaconnectgroup1@gmail.com"
PHONE_WA = "243899639009"          # WhatsApp number (RDC)
PHONE1, PHONE1_D = "+243899639009", "+243 899 639 009"
PHONE2, PHONE2_D = "+213793338879", "+213 793 338 879"

ICONS = {
 "cacao": '<ellipse cx="12" cy="12" rx="6.5" ry="9.5" transform="rotate(35 12 12)"/><path d="M8 17c3-1 2-4 4-5s3-3 4-5"/>',
 "agro": '<path d="M12 22V10M12 10c0-4 3-6 8-6 0 4-3 6-8 6zM12 15c0-3-2-5-7-5 0 3 2 5 7 5z"/>',
 "export": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 "invest": '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
 "academy": '<path d="M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
 "mining": '<path d="M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l3 6 3-6M12 9v12"/>',
 "sustain": '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l8-8"/>',
}
def icon(k, cls="ico"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[k]}</svg>'

# ----------------------------------------------------------------- CONTENT
POLES = [
 dict(slug="cacao-coffee", icon="cacao",
  name=dict(fr="Cacao & Coffee", en="Cacao & Coffee"),
  short=dict(fr="Mise en relation des acteurs des filières cacao et café, recherche de débouchés et valorisation.",
             en="Connecting cocoa and coffee value-chain players, finding outlets and adding value."),
  intro=dict(fr="Un pôle dédié aux filières cacao et café : mise en relation des acteurs, recherche de débouchés commerciaux et opportunités de valorisation et de transformation.",
             en="A division dedicated to the cocoa and coffee sectors: connecting stakeholders, finding commercial outlets and exploring value-addition and processing opportunities."),
  what=dict(fr=["Mise en relation entre producteurs, coopératives, exportateurs et acheteurs","Recherche de débouchés commerciaux pour le cacao et le café","Identification d’opportunités de valorisation et de transformation locale","Appui à la structuration des offres et à la présentation aux acheteurs"],
            en=["Introductions between producers, cooperatives, exporters and buyers","Sourcing commercial outlets for cocoa and coffee","Identifying local value-addition and processing opportunities","Support to structure offers and present them to buyers"]),
  who=dict(fr=["Producteurs et coopératives","Exportateurs et négociants","Acheteurs et torréfacteurs","Investisseurs de la filière"],
           en=["Producers and cooperatives","Exporters and traders","Buyers and roasters","Sector investors"])),
 dict(slug="agro-commodities", icon="agro",
  name=dict(fr="Agro Commodities", en="Agro Commodities"),
  short=dict(fr="Facilitation des échanges de matières premières agricoles entre producteurs, fournisseurs et acheteurs.",
             en="Facilitating agricultural commodity trade between producers, suppliers and buyers."),
  intro=dict(fr="Un pôle consacré aux matières premières agricoles, à la facilitation des échanges commerciaux et au développement de relations entre producteurs, fournisseurs et acheteurs.",
             en="A division focused on agricultural raw materials, facilitating trade and building relationships between producers, suppliers and buyers."),
  what=dict(fr=["Facilitation des échanges de matières premières agricoles","Mise en relation entre producteurs, fournisseurs et acheteurs","Veille sur les opportunités de marché","Accompagnement dans la négociation et la structuration des partenariats commerciaux"],
            en=["Facilitating agricultural commodity trade","Connecting producers, suppliers and buyers","Monitoring market opportunities","Support in negotiating and structuring commercial partnerships"]),
  who=dict(fr=["Producteurs agricoles","Fournisseurs et agrégateurs","Importateurs et industriels","Distributeurs"],
           en=["Agricultural producers","Suppliers and aggregators","Importers and manufacturers","Distributors"])),
 dict(slug="export-solutions", icon="export",
  name=dict(fr="Export Solutions", en="Export Solutions"),
  short=dict(fr="Accompagnement des entreprises dans leur démarche d’exportation et l’accès aux marchés internationaux.",
             en="Helping companies export and access international markets."),
  intro=dict(fr="Un pôle destiné à accompagner les entreprises dans leur démarche d’exportation, la recherche de marchés, la mise en relation commerciale et la facilitation des opérations internationales.",
             en="A division that supports companies in their export journey: market research, commercial introductions and facilitation of international operations."),
  what=dict(fr=["Accompagnement de la démarche d’exportation","Recherche et identification de marchés","Mise en relation avec des acheteurs et partenaires internationaux","Facilitation des opérations commerciales internationales"],
            en=["Guidance throughout the export process","Market research and identification","Introductions to international buyers and partners","Facilitating international commercial operations"]),
  who=dict(fr=["Exportateurs et futurs exportateurs","PME à vocation internationale","Producteurs et coopératives","Importateurs étrangers"],
           en=["Exporters and aspiring exporters","SMEs with international ambitions","Producers and cooperatives","Foreign importers"])),
 dict(slug="investment-partnerships", icon="invest",
  name=dict(fr="Investment & Partnerships", en="Investment & Partnerships"),
  short=dict(fr="Recherche de partenaires stratégiques, facilitation des investissements et coopération entre entreprises.",
             en="Finding strategic partners, facilitating investment and fostering business cooperation."),
  intro=dict(fr="Un pôle axé sur la recherche de partenaires stratégiques, la facilitation des investissements, la coopération entre entreprises et le développement de projets économiques.",
             en="A division centred on finding strategic partners, facilitating investment, fostering cooperation between companies and developing economic projects."),
  what=dict(fr=["Recherche de partenaires stratégiques","Facilitation des investissements","Coopération et mise en relation entre entreprises","Appui au développement de projets économiques"],
            en=["Finding strategic partners","Facilitating investments","Cooperation and introductions between companies","Support for developing economic projects"]),
  who=dict(fr=["Investisseurs et fonds","Porteurs de projets","Entreprises en recherche de partenaires","Institutions publiques et privées"],
           en=["Investors and funds","Project sponsors","Companies seeking partners","Public and private institutions"])),
 dict(slug="training-academy", icon="academy",
  name=dict(fr="Training Academy", en="Training Academy"),
  short=dict(fr="Formation professionnelle, renforcement des capacités et accompagnement des entrepreneurs.",
             en="Professional training, capacity building and entrepreneur support."),
  intro=dict(fr="Un pôle consacré à la formation professionnelle, au renforcement des capacités, à l’accompagnement des entrepreneurs et au développement des compétences commerciales.",
             en="A division devoted to professional training, capacity building, entrepreneur support and the development of commercial skills."),
  what=dict(fr=["Formation professionnelle","Renforcement des capacités des équipes et des organisations","Accompagnement des entrepreneurs","Développement des compétences commerciales"],
            en=["Professional training","Capacity building for teams and organisations","Entrepreneur support","Developing commercial skills"]),
  who=dict(fr=["Entrepreneurs et porteurs de projets","PME et leurs équipes","Coopératives","Organisations de développement"],
           en=["Entrepreneurs and project owners","SMEs and their teams","Cooperatives","Development organisations"])),
 dict(slug="mining-commodities", icon="mining",
  name=dict(fr="Mining & Commodities", en="Mining & Commodities"),
  short=dict(fr="Collaboration et facilitation commerciale dans le secteur minier, dans le respect des réglementations.",
             en="Collaboration and commercial facilitation in mining, in line with applicable regulations."),
  intro=dict(fr="Un pôle destiné aux opportunités de collaboration et de facilitation commerciale dans le secteur minier et celui des matières premières, dans le respect des réglementations applicables.",
             en="A division for collaboration and commercial facilitation opportunities in the mining and commodities sector, in compliance with applicable regulations."),
  what=dict(fr=["Facilitation commerciale dans le secteur minier et des matières premières","Mise en relation entre acteurs et partenaires","Identification d’opportunités de collaboration","Respect strict des réglementations applicables"],
            en=["Commercial facilitation in mining and commodities","Introductions between players and partners","Identifying collaboration opportunities","Strict compliance with applicable regulations"]),
  who=dict(fr=["Opérateurs et fournisseurs","Acheteurs et partenaires commerciaux","Investisseurs","Institutions"],
           en=["Operators and suppliers","Buyers and commercial partners","Investors","Institutions"])),
 dict(slug="sustainability", icon="sustain",
  name=dict(fr="Sustainability", en="Sustainability"),
  short=dict(fr="Pratiques responsables, valorisation durable des ressources et initiatives à impact positif.",
             en="Responsible practices, sustainable use of resources and positive-impact initiatives."),
  intro=dict(fr="Un pôle qui vise à promouvoir des pratiques responsables, la valorisation durable des ressources et des initiatives économiques ayant un impact positif.",
             en="A division that promotes responsible practices, the sustainable use of resources and economic initiatives with a positive impact."),
  what=dict(fr=["Promotion de pratiques responsables","Valorisation durable des ressources","Soutien aux initiatives économiques à impact positif","Intégration de la durabilité dans l’ensemble de nos pôles"],
            en=["Promoting responsible practices","Sustainable use of resources","Supporting positive-impact economic initiatives","Embedding sustainability across all our divisions"]),
  who=dict(fr=["Entreprises engagées","Organisations de développement","Partenaires techniques","Investisseurs à impact"],
           en=["Committed companies","Development organisations","Technical partners","Impact investors"])),
]

AUDIENCE = dict(
 fr=["Entreprises locales et internationales","Producteurs et coopératives agricoles","Exportateurs et importateurs","Acheteurs de matières premières","Investisseurs et partenaires commerciaux","PME et entrepreneurs","Institutions publiques et privées","Organisations de développement et partenaires techniques"],
 en=["Local and international companies","Producers and agricultural cooperatives","Exporters and importers","Commodity buyers","Investors and commercial partners","SMEs and entrepreneurs","Public and private institutions","Development organisations and technical partners"])

MISSION = dict(
 fr=["Accompagner les entreprises dans leur développement et leur stratégie commerciale.","Faciliter les relations d’affaires entre producteurs, fournisseurs, acheteurs, investisseurs et partenaires.","Contribuer à la valorisation des matières premières africaines.","Favoriser les opportunités d’exportation et l’accès aux marchés internationaux.","Faciliter les partenariats commerciaux et institutionnels.","Accompagner les PME et les entrepreneurs dans la structuration et le développement de leurs projets.","Promouvoir des initiatives économiques durables et créatrices de valeur en Afrique."],
 en=["Support companies in their development and commercial strategy.","Facilitate business relationships between producers, suppliers, buyers, investors and partners.","Contribute to the value-addition of African raw materials.","Promote export opportunities and access to international markets.","Facilitate commercial and institutional partnerships.","Help SMEs and entrepreneurs structure and grow their projects.","Promote sustainable, value-creating economic initiatives in Africa."])

VALUES = dict(
 fr=[("Confiance","Des relations d’affaires fondées sur la transparence et la fiabilité."),("Partenariat","Des collaborations durables, gagnantes pour toutes les parties."),("Ouverture","Un regard international, un ancrage africain."),("Responsabilité","Une création de valeur respectueuse des réglementations et des ressources.")],
 en=[("Trust","Business relationships built on transparency and reliability."),("Partnership","Lasting collaborations that work for every party."),("Openness","An international outlook, rooted in Africa."),("Responsibility","Value creation that respects regulations and resources.")])

STEPS = dict(
 fr=[("Écouter","Nous comprenons votre besoin, votre offre ou votre projet."),("Connecter","Nous identifions et vous mettons en relation avec les bons partenaires."),("Structurer","Nous vous aidons à cadrer l’opportunité et à préparer la discussion."),("Avancer","Nous facilitons la suite pour concrétiser la collaboration.")],
 en=[("Listen","We understand your need, your offer or your project."),("Connect","We identify the right partners and introduce you."),("Structure","We help frame the opportunity and prepare the discussion."),("Move forward","We facilitate next steps to make the collaboration real.")])

T = dict(  # UI strings
 nav_home=dict(fr="Accueil", en="Home"), nav_about=dict(fr="À propos", en="About"),
 nav_poles=dict(fr="Nos pôles", en="Our divisions"), nav_contact=dict(fr="Contact", en="Contact"),
 cta=dict(fr="Nous contacter", en="Get in touch"),
 skip=dict(fr="Aller au contenu", en="Skip to content"),
)
def t(k, l): return T[k][l]

# ----------------------------------------------------------------- LAYOUT
def esc(s): return html.escape(s, quote=True)

def net_svg():
    random.seed(7)
    pts = [(random.randint(20, 580), random.randint(20, 480)) for _ in range(34)]
    lines, dots = [], []
    for i, (x, y) in enumerate(pts):
        near = sorted(pts, key=lambda p: (p[0]-x)**2 + (p[1]-y)**2)[1:3]
        for (a, b) in near:
            lines.append(f'<line x1="{x}" y1="{y}" x2="{a}" y2="{b}"/>')
        r = random.choice([2.5, 3, 4, 5])
        dots.append(f'<circle cx="{x}" cy="{y}" r="{r}" style="animation-delay:{(i*0.37)%4:.2f}s"/>')
    return f'<svg class="net" viewBox="0 0 600 500" aria-hidden="true"><g class="net-l">{"".join(lines)}</g><g class="net-d">{"".join(dots)}</g></svg>'

def page(lang, path, title, desc, body, alt_path):
    other = "en" if lang == "fr" else "fr"
    pre = "" if lang == "fr" else "/en"
    opre = "" if other == "fr" else "/en"
    def u(p): return (pre + p) if p != "/" else (pre or "/")
    def ou(p): return (opre + p) if p != "/" else (opre or "/")
    nav = [("nav_home", "/"), ("nav_about", "/about"), ("nav_poles", "/#poles"), ("nav_contact", "/contact")]
    links = "".join(f'<a href="{u(p)}"{" aria-current=page" if p == path else ""}>{t(k, lang)}</a>' for k, p in nav)
    poles_foot = "".join(f'<a href="{u("/poles/"+p["slug"])}">{p["name"][lang]}</a>' for p in POLES)
    wa_msg = "Bonjour Africa Connect Group, " if lang == "fr" else "Hello Africa Connect Group, "
    tagline = ("Connecter les opportunités économiques africaines au monde." if lang == "fr"
               else "Connecting African economic opportunities to the world.")
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="theme-color" content="#0a1a33">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="/assets/logo.jpg"><meta property="og:type" content="website">
<link rel="icon" href="/assets/favicon.png">
<link rel="alternate" hreflang="{other}" href="{ou(alt_path)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=4">
</head>
<body>
<a class="skip" href="#main">{t("skip", lang)}</a>
<header class="hdr" id="hdr">
 <div class="wrap hdr-in">
  <a class="brand" href="{u("/")}" aria-label="Africa Connect Group"><img src="/assets/logo-wide.png" alt="Africa Connect Group" width="798" height="394"></a>
  <nav class="nav" id="nav" aria-label="Main">{links}
   <a class="btn btn-gold nav-cta" href="{u("/contact")}">{t("cta", lang)}</a></nav>
  <a class="lang" href="{ou(alt_path)}" hreflang="{other}" aria-label="Switch language">{other.upper()}</a>
  <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
 </div>
</header>
<main id="main">
{body.replace("{{U}}", pre)}
</main>
<footer class="ftr">
 <div class="wrap ftr-grid">
  <div>
   <a class="ftr-logo" href="{u("/")}"><img src="/assets/logo-wide.png" alt="Africa Connect Group" width="798" height="394"></a>
   <p class="muted">{tagline}</p>
   <p class="muted small">Africa Connect Group SARL · RDC</p>
  </div>
  <div><h4>{t("nav_poles", lang)}</h4>{poles_foot}</div>
  <div><h4>{t("nav_contact", lang)}</h4>
   <a href="mailto:{EMAIL}">{EMAIL}</a>
   <a href="tel:{PHONE1}">{PHONE1_D}</a>
   <a href="tel:{PHONE2}">{PHONE2_D}</a>
   <a href="https://wa.me/{PHONE_WA}" target="_blank" rel="noopener">WhatsApp</a>
  </div>
 </div>
 <div class="wrap ftr-bot"><span>© 2026 Africa Connect Group SARL.</span><span>{"Tous droits réservés." if lang=="fr" else "All rights reserved."}</span></div>
</footer>
<a class="wa-float" href="https://wa.me/{PHONE_WA}?text={esc(wa_msg)}" target="_blank" rel="noopener" aria-label="WhatsApp">
 <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.800 1.500 5.900 1.500 7 0 12.700-5.600 12.700-12.500S23 3 16 3zm0 22.800c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.400 1.100 1.200-4.200-.3-.4c-1.100-1.700-1.600-3.600-1.600-5.600C5.200 9.700 10 5 16 5s10.800 4.700 10.800 10.500S21.900 25.800 16 25.800zm5.900-7.800c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.200-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.400-.5-2.600-1.600-1-.9-1.600-1.900-1.800-2.200-.2-.3 0-.5.100-.7l.5-.6c.2-.2.200-.3.300-.5.100-.2.100-.4 0-.6l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.100-.9.400-.3.300-1.200 1.100-1.200 2.700s1.200 3.200 1.400 3.400c.2.200 2.300 3.500 5.600 4.900.8.300 1.400.5 1.900.6.8.2 1.500.2 2.100.1.600-.1 1.900-.8 2.200-1.500.3-.8.3-1.400.2-1.500-.1-.2-.3-.3-.6-.4z"/></svg>
</a>
<script src="/assets/main.js?v=4" defer></script>
</body>
</html>'''

def write(lang, path, html_):
    base = OUT if lang == "fr" else OUT / "en"
    p = base / (path.strip("/") or "index")
    f = p.with_suffix(".html") if path != "/" else base / "index.html"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(html_, encoding="utf-8")

def li(items): return "<ul class='ticks'>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ul>"

def pole_card(p, lang, pre):
    return f'''<a class="card pole reveal" href="{pre}/poles/{p["slug"]}">
 <span class="ico-wrap">{icon(p["icon"])}</span>
 <h3>{p["name"][lang]}</h3><p>{esc(p["short"][lang])}</p>
 <span class="more">{"Découvrir" if lang=="fr" else "Explore"} →</span></a>'''

# ----------------------------------------------------------------- PAGES
WWA_CSS = """<style>
.wwa{position:relative;background:#fff;padding:clamp(3rem,7vw,5.5rem) 0;overflow:hidden}
.wwa .wwa-net{position:absolute;left:-6%;bottom:-25%;width:min(700px,110vw);opacity:.55;pointer-events:none;z-index:0}
.wwa .wwa-net .net-l line{stroke:#cfdaef;stroke-width:1;opacity:1}
.wwa .wwa-net .net-d circle{fill:#9db4de;animation:none;opacity:.8}
.wwa-in{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,5vw,4rem);align-items:center}
.wwa-eyebrow{display:inline-flex;align-items:center;gap:.6rem;text-transform:uppercase;letter-spacing:.16em;font-size:.76rem;font-weight:700;color:#c8962a;margin:0 0 1rem}
.wwa-eyebrow::before{content:"";width:34px;height:2px;background:#c8962a}
.wwa h2{color:#0a1a33;font-size:clamp(1.9rem,4.2vw,2.9rem);margin:0 0 1rem}
.wwa h2 em{color:#c8962a}
.wwa-p{color:#5a6578;font-size:1.05rem;max-width:30rem;margin:0 0 1.5rem}
.wwa-pills{list-style:none;padding:0;margin:0 0 1.8rem;display:grid;gap:.7rem;max-width:26rem}
.wwa-pills li{display:flex;align-items:center;gap:.9rem;background:#fff;color:#0a1a33;font-weight:700;font-size:.95rem;padding:.7rem 1rem;border-radius:14px;border:1px solid #e3eaf6;box-shadow:0 6px 18px rgba(16,38,74,.06)}
.wwa-pills i{flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#2457b5,#10264a);color:#e3b650}
.wwa-pills svg{width:18px;height:18px}
.wwa-btn{display:inline-flex;align-items:center;gap:.6rem}
.wwa-btn b{transition:transform .2s}.wwa-btn:hover b{transform:translateX(4px)}
.wwa-vis{position:relative;display:grid;place-items:center;min-height:520px}
.wwa-glow{position:absolute;left:50%;top:50%;width:92%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#e6edfa 0,#f4f7fd 55%,transparent 72%)}
.wwa-ring{position:absolute;left:50%;top:50%;width:84%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:1.5px dashed rgba(200,150,42,.55)}
.wwa-dots{position:absolute;right:2%;bottom:4%;width:120px;height:120px;background-image:radial-gradient(#c8962a 1.6px,transparent 1.9px);background-size:16px 16px;opacity:.55}
.wwa-strip{position:absolute;left:24%;top:0;bottom:0;width:22%;border-radius:16px;background:linear-gradient(180deg,#2457b5,#10264a 70%,#0a1a33);box-shadow:0 20px 40px rgba(16,38,74,.25)}
.wwa-strip::after{content:"";position:absolute;inset:0;border-radius:inherit;background-image:radial-gradient(rgba(255,255,255,.3) 1.2px,transparent 1.5px);background-size:14px 14px;opacity:.55}
.wwa-vis img{position:relative;z-index:2;height:480px;width:auto;max-width:100%;filter:drop-shadow(0 18px 22px rgba(10,26,51,.28))}
.wwa-card{position:absolute;z-index:3;display:flex;align-items:center;gap:.6rem;background:#fff;color:#0a1a33;font-weight:700;font-size:.82rem;padding:.55rem .9rem .55rem .55rem;border-radius:14px;box-shadow:0 12px 30px rgba(16,38,74,.18);animation:wwaf 6s ease-in-out infinite}
.wwa-card i{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:#c8962a;color:#fff}
.wwa-card svg{width:17px;height:17px}
.wwa-card small{display:block;font-weight:600;font-size:.7rem;color:#5a6578}
.wc1{left:0;top:16%}.wc2{right:-2%;top:56%;animation-delay:-3s}
@keyframes wwaf{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media(max-width:860px){
 .wwa{padding:2.5rem 0 3rem}
 .wwa-in{grid-template-columns:1fr;gap:2rem}
 .wwa-pills{max-width:none}
 .wwa .btn{width:100%;justify-content:center}
 .wwa-vis{min-height:400px;border-radius:26px;background:linear-gradient(180deg,#eef3fc,#fff);border:1px solid #e3eaf6;overflow:hidden}
 .wwa-vis img{height:340px}
 .wwa-strip{left:50%;transform:translateX(-98%);width:25%;top:6%;bottom:6%}
 .wwa-glow{width:110%}.wwa-ring{width:92%}
 .wc1{left:3%;top:9%}.wc2{right:3%;top:auto;bottom:9%}
 .wwa-card{font-size:.76rem}
}

.hero .hero-in{padding-bottom:clamp(6rem,12vw,9.5rem)}
.statwrap{position:relative;z-index:5;margin-top:-4.2rem}
.statbar{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-radius:24px;border:1px solid #e3eaf6;box-shadow:0 24px 60px rgba(10,26,51,.16);overflow:hidden}
.stat{padding:1.6rem 1.7rem 1.5rem;border-left:1px solid #e3eaf6}
.stat:first-child{border-left:0}
.stat b{display:block;font-family:Fraunces,Georgia,serif;font-size:clamp(1.3rem,2.1vw,1.7rem);line-height:1.15;white-space:nowrap;color:#0a1a33}
.stat i{display:block;width:34px;height:3px;border-radius:3px;background:#c8962a;margin:.7rem 0 .6rem}
.stat span{color:#5a6578;font-size:.92rem;line-height:1.4}
@media(max-width:860px){
 .statwrap{margin-top:-3rem}
 .statbar{grid-template-columns:1fr 1fr;border-radius:20px}
 .stat{padding:1.1rem 1.1rem 1rem;border-left:0;border-top:1px solid #e3eaf6}
 .stat:nth-child(2n){border-left:1px solid #e3eaf6}
 .stat:nth-child(-n+2){border-top:0}
 .stat span{font-size:.82rem}.stat b{font-size:1.25rem}
}
.wwa{padding-top:clamp(3.5rem,8vw,6rem)}

.vm{position:relative;background:linear-gradient(180deg,#f4f7fd,#fff);padding:clamp(3.5rem,8vw,6rem) 0;overflow:hidden}
.vm-vision{position:relative;overflow:hidden;border-radius:28px;color:#fff;background:radial-gradient(120% 140% at 100% 0,#1d4a9a 0,#10264a 45%,#0a1a33 100%);padding:clamp(2rem,5vw,3.8rem);display:grid;grid-template-columns:1.5fr 1fr;gap:2rem;align-items:center;box-shadow:0 30px 70px rgba(10,26,51,.25)}
.vm-vision .vm-net{position:absolute;right:-8%;top:-20%;width:min(620px,100%);opacity:.5;pointer-events:none}
.vm-vision .vm-net .net-l line{stroke:#e3b650;stroke-width:1;opacity:.35}
.vm-vision .vm-net .net-d circle{fill:#e3b650;animation:none;opacity:.6}
.vm-eyebrow{display:inline-flex;align-items:center;gap:.6rem;text-transform:uppercase;letter-spacing:.16em;font-size:.76rem;font-weight:700;color:#e3b650;margin:0 0 1rem}
.vm-eyebrow::before{content:"";width:34px;height:2px;background:#e3b650}
.vm-vision h2{font-size:clamp(1.5rem,3.2vw,2.35rem);line-height:1.25;color:#fff;margin:0;max-width:34rem;position:relative}
.vm-vision h2 em{color:#e3b650}
.vm-vision>div{position:relative;z-index:1}
.vm-orb{justify-self:center;width:min(230px,60vw);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;border:1.5px dashed rgba(227,182,80,.6);position:relative}
.vm-orb::before{content:"";position:absolute;inset:14%;border-radius:50%;border:1px solid rgba(255,255,255,.25)}
.vm-orb span{width:46%;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#e3b650,#c8962a);color:#0a1a33;box-shadow:0 14px 34px rgba(0,0,0,.35)}
.vm-orb svg{width:52%;height:52%}
.vm-head{text-align:center;max-width:36rem;margin:clamp(3rem,6vw,4.5rem) auto 2rem}
.vm-head .vm-eyebrow{color:#c8962a}.vm-head .vm-eyebrow::before{background:#c8962a}
.vm-head h3{font-size:clamp(1.6rem,3.4vw,2.3rem);color:#0a1a33}
.vm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem}
.vm-card{position:relative;background:#fff;border:1px solid #e3eaf6;border-radius:20px;padding:1.5rem 1.4rem 1.4rem;overflow:hidden;transition:.25s;box-shadow:0 8px 24px rgba(16,38,74,.05)}
.vm-card:hover{transform:translateY(-6px);border-color:#c8962a;box-shadow:0 20px 44px rgba(16,38,74,.14)}
.vm-card::after{content:"";position:absolute;left:0;top:0;height:3px;width:0;background:#c8962a;transition:width .35s}
.vm-card:hover::after{width:100%}
.vm-num{position:absolute;right:1rem;top:.6rem;font-family:Fraunces,Georgia,serif;font-size:2.6rem;line-height:1;color:#eef2fa;font-weight:600}
.vm-ico{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#2457b5,#10264a);color:#e3b650;margin-bottom:1.1rem;position:relative}
.vm-ico svg{width:25px;height:25px}
.vm-card h4{font-family:Fraunces,Georgia,serif;font-size:1.2rem;color:#0a1a33;margin:0 0 .4rem;position:relative}
.vm-card p{color:#5a6578;font-size:.9rem;line-height:1.55;margin:0;position:relative}
.vm-cta{display:flex;flex-direction:column;justify-content:center;gap:.8rem;background:linear-gradient(135deg,#c8962a,#e3b650);border:0;color:#1a1200}
.vm-cta h4,.vm-cta p{color:#1a1200}
.vm-cta b{font-weight:700;font-size:.95rem}
@media(max-width:1000px){.vm-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:860px){
 .vm-vision{grid-template-columns:1fr;border-radius:22px}
 .vm-orb{width:150px;order:-1;justify-self:start}
 .vm-vision .vm-net{opacity:.3}
}
@media(max-width:520px){.vm-grid{grid-template-columns:1fr}.vm-card{display:grid;grid-template-columns:50px 1fr;column-gap:1rem;padding:1.2rem}.vm-ico{grid-row:span 2;margin:0}.vm-card h4{margin-bottom:.2rem}.vm-num{font-size:2rem}.vm-card.vm-cta{display:flex;grid-template-columns:none}}
</style>"""

def vm_section(lang, pre):
    L = lambda fr, en: fr if lang == "fr" else en
    def ic(paths): return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths}</svg>'
    items = [
     (ic('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'), L("Accompagner","Support"), L("Aider les entreprises dans leur développement et leur stratégie commerciale.","Helping companies grow and shape their commercial strategy.")),
     (ic('<circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 12l10-6M7 12l10 6"/>'), L("Connecter","Connect"), L("Relier producteurs, fournisseurs, acheteurs, investisseurs et partenaires.","Linking producers, suppliers, buyers, investors and partners.")),
     (ICONS["mining"] and ic(ICONS["mining"]), L("Valoriser","Add value"), L("Mettre en valeur les matières premières africaines.","Adding value to African raw materials.")),
     (ic(ICONS["export"]), L("Exporter","Export"), L("Ouvrir l’accès aux marchés internationaux.","Opening access to international markets.")),
     (ic('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'), L("Partenariats","Partnerships"), L("Faciliter les partenariats commerciaux et institutionnels.","Facilitating commercial and institutional partnerships.")),
     (ic(ICONS["invest"]), L("Entrepreneurs","Entrepreneurs"), L("Structurer et développer les projets des PME et entrepreneurs.","Structuring and growing SME and entrepreneur projects.")),
     (ic(ICONS["sustain"]), L("Durabilité","Sustainability"), L("Promouvoir des initiatives durables, créatrices de valeur en Afrique.","Promoting sustainable, value-creating initiatives in Africa.")),
    ]
    cards = "".join(f'<div class="vm-card reveal"><span class="vm-num">0{i+1}</span><div class="vm-ico">{i_}</div><h4>{t_}</h4><p>{d_}</p></div>' for i, (i_, t_, d_) in enumerate(items))
    cards += f'<a class="vm-card vm-cta reveal" href="{pre}/about#mission"><h4>{L("Toute notre mission","Our full mission")}</h4><p>{L("Découvrez comment nous agissons.","See how we work.")}</p><b>{L("En savoir plus","Learn more")} →</b></a>'
    net = net_svg().replace('class="net"', 'class="vm-net"')
    return f"""<section class="vm" id="vision"><div class="wrap">
 <div class="vm-vision reveal">{net}
  <div><p class="vm-eyebrow">{L("Notre vision","Our vision")}</p>
  <h2>{L("Devenir la référence dans la connexion des <em>opportunités économiques</em> entre l’Afrique et le reste du monde.","To become the reference in connecting <em>economic opportunities</em> between Africa and the rest of the world.")}</h2></div>
  <div class="vm-orb"><span>{ic('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>')}</span></div>
 </div>
 <div class="vm-head reveal"><p class="vm-eyebrow">{L("Notre mission","Our mission")}</p><h3>{L("Sept engagements pour faire avancer vos projets.","Seven commitments to move your projects forward.")}</h3></div>
 <div class="vm-grid">{cards}</div>
</div></section>"""


def home(lang):
    pre = "" if lang == "fr" else "/en"
    L = lambda fr, en: fr if lang == "fr" else en
    return f'''
<section class="hero">
 {net_svg()}
 <div class="wrap hero-in">
  <p class="eyebrow">{L("Conseil · Commerce international · Partenariats","Advisory · International trade · Partnerships")}</p>
  <h1>{L("Connecter les opportunités <em>africaines</em> au reste du monde.","Connecting <em>African</em> opportunities to the rest of the world.")}</h1>
  <p class="lead">{L("Africa Connect Group accompagne les entreprises, facilite les échanges commerciaux et crée des partenariats durables entre l’Afrique et les marchés internationaux.","Africa Connect Group supports businesses, facilitates trade and builds lasting partnerships between Africa and international markets.")}</p>
  <div class="actions">
   <a class="btn btn-gold" href="{pre}/contact">{L("Proposer une collaboration","Propose a collaboration")}</a>
   <a class="btn btn-ghost" href="#poles">{L("Découvrir nos pôles","Discover our divisions")}</a>
  </div>
  <ul class="hero-tags"><li>{L("Ancrage en RDC","Rooted in the DRC")}</li><li>{L("Expansion en Afrique australe","Expanding in Southern Africa")}</li><li>{L("Ouverture internationale","International reach")}</li></ul>
 </div>
</section>

{WWA_CSS}
<div class="statwrap"><div class="wrap"><div class="statbar reveal">
 <div class="stat"><b>7</b><i></i><span>{L("pôles d’activité complémentaires","complementary areas of activity")}</span></div>
 <div class="stat"><b>RDC</b><i></i><span>{L("notre point d’ancrage","our home base")}</span></div>
 <div class="stat"><b>{L("Afrique australe","Southern Africa")}</b><i></i><span>{L("notre marché d’expansion","our expansion market")}</span></div>
 <div class="stat"><b>{L("International","International")}</b><i></i><span>{L("partenaires et acheteurs du monde entier","partners and buyers worldwide")}</span></div>
</div></div></div>
<section class="wwa" id="about">
 {net_svg().replace('class="net"','class="wwa-net"')}
 <div class="wrap wwa-in">
  <div class="wwa-txt reveal">
   <p class="wwa-eyebrow">{L("Qui sommes-nous","Who we are")}</p>
   <h2>{L("Votre partenaire de confiance pour faire des <em>affaires</em> en Afrique.","Your trusted partner for doing <em>business</em> in Africa.")}</h2>
   <p class="wwa-p">{L("Conseil, commerce international et partenariats : nous connectons les opportunités africaines au reste du monde.","Advisory, international trade and partnerships: we connect African opportunities to the rest of the world.")}</p>
   <ul class="wwa-pills">
    <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6"/></svg></i>{L("Conseil stratégique","Strategic advisory")}</li>
    <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg></i>{L("Commerce international","International trade")}</li>
    <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12l3 3 5-6M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg></i>{L("Partenariats durables","Lasting partnerships")}</li>
   </ul>
   <a class="btn btn-gold wwa-btn" href="{pre}/about">{L("En savoir plus","Learn more")} <b>→</b></a>
  </div>
  <div class="wwa-vis reveal">
   <div class="wwa-glow"></div><div class="wwa-ring"></div><div class="wwa-dots"></div><div class="wwa-strip"></div>
   <img src="/assets/people.png" alt="{L("Poignée de main entre deux partenaires d’affaires","Handshake between two business partners")}" width="554" height="942" loading="lazy">
   <div class="wwa-card wc1"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg></i><span>{L("Producteurs","Producers")}<small>{L("↔ acheteurs","↔ buyers")}</small></span></div>
   <div class="wwa-card wc2"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg></i><span>{L("Investisseurs","Investors")}<small>{L("& partenaires","& partners")}</small></span></div>
  </div>
 </div>
</section>

{vm_section(lang, pre)}

<section class="sec" id="poles">
 <div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow dark">{L("Nos pôles d’activité","Our areas of activity")}</p>
   <h2>{L("Sept pôles complémentaires, un seul point de contact.","Seven complementary divisions, one point of contact.")}</h2></div>
  <div class="grid">{"".join(pole_card(p, lang, pre) for p in POLES)}
   <a class="card pole cta-card reveal" href="{pre}/contact"><h3>{L("Un projet en tête ?","Have a project in mind?")}</h3><p>{L("Parlons-en : nous vous orienterons vers le bon pôle.","Let’s talk: we’ll point you to the right division.")}</p><span class="more">{L("Nous écrire","Write to us")} →</span></a>
  </div>
 </div>
</section>

<section class="sec sec-soft">
 <div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow dark">{L("À qui nous nous adressons","Who we work with")}</p>
   <h2>{L("Tous ceux qui font vivre les marchés africains.","Everyone who drives African markets.")}</h2></div>
  <ul class="chips reveal">{"".join(f"<li>{esc(a)}</li>" for a in AUDIENCE[lang])}</ul>
 </div>
</section>

<section class="sec">
 <div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow dark">{L("Notre approche","Our approach")}</p>
   <h2>{L("Comment collaborer avec nous.","How to work with us.")}</h2></div>
  <ol class="steps">{"".join(f'<li class="reveal"><span class="n">0{i+1}</span><h3>{a}</h3><p>{b}</p></li>' for i,(a,b) in enumerate(STEPS[lang]))}</ol>
 </div>
</section>

<section class="sec sec-navy" id="opportunities">
 <div class="wrap opp">
  <div class="reveal"><p class="eyebrow">{L("Projets & opportunités","Projects & opportunities")}</p>
   <h2>{L("Vous cherchez un acheteur, un fournisseur ou un investisseur ?","Looking for a buyer, a supplier or an investor?")}</h2>
   <p class="lead">{L("Présentez-nous votre offre, votre besoin ou votre projet. Notre équipe l’étudie et vous met en relation avec les bons interlocuteurs.","Share your offer, your need or your project. Our team reviews it and connects you with the right counterparts.")}</p></div>
  <div class="opp-box reveal">
   <ul class="ticks gold">
    <li>{L("Offre de matières premières","Commodity offers")}</li>
    <li>{L("Demande d’achat","Purchase requests")}</li>
    <li>{L("Recherche d’investisseur ou de partenaire","Investor or partner search")}</li>
    <li>{L("Demande d’accompagnement ou de formation","Advisory or training request")}</li></ul>
   <a class="btn btn-gold" href="{pre}/contact">{L("Soumettre une opportunité","Submit an opportunity")}</a>
  </div>
 </div>
</section>

<section class="sec">
 <div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow dark">{L("Nos valeurs","Our values")}</p><h2>{L("Ce qui guide nos collaborations.","What guides our collaborations.")}</h2></div>
  <div class="vals">{"".join(f'<div class="val reveal"><h3>{a}</h3><p>{b}</p></div>' for a,b in VALUES[lang])}</div>
 </div>
</section>
{contact_band(lang, pre)}'''

def contact_band(lang, pre):
    L = lambda fr, en: fr if lang == "fr" else en
    return f'''<section class="band"><div class="wrap band-in">
 <div><h2>{L("Construisons ensemble votre prochaine opportunité.","Let’s build your next opportunity together.")}</h2>
 <p>{L("Réponse par WhatsApp, e-mail ou téléphone.","Reach us by WhatsApp, email or phone.")}</p></div>
 <div class="actions"><a class="btn btn-navy" href="{pre}/contact">{L("Nous contacter","Contact us")}</a>
 <a class="btn btn-line" href="https://wa.me/{PHONE_WA}" target="_blank" rel="noopener">WhatsApp</a></div></div></section>'''

def about(lang):
    pre = "" if lang == "fr" else "/en"
    L = lambda fr, en: fr if lang == "fr" else en
    return f'''
{phead(lang, L("À propos","About us"), L("Une entreprise tournée vers la connexion des opportunités.","A company built around connecting opportunities."), L("Accueil","Home"), pre)}
<section class="sec"><div class="wrap split">
 <div class="reveal"><h2>{L("Qui nous sommes","Who we are")}</h2></div>
 <div class="reveal">
  <p>{L("Africa Connect Group SARL est une entreprise qui s’inscrit dans une dynamique de développement économique, de conseil stratégique, de facilitation des affaires, de commerce international et de création de partenariats en Afrique.","Africa Connect Group SARL is a company engaged in economic development, strategic advisory, business facilitation, international trade and partnership creation in Africa.")}</p>
  <p>{L("Notre ambition est de contribuer à la valorisation des richesses africaines, à l’accompagnement des entreprises et des entrepreneurs, ainsi qu’au développement de relations commerciales durables entre les acteurs économiques africains et les partenaires internationaux.","Our ambition is to help add value to Africa’s wealth, to support businesses and entrepreneurs, and to develop lasting commercial relationships between African economic players and international partners.")}</p>
  <p>{L("Notre point d’ancrage est la République démocratique du Congo (RDC), avec une vision d’expansion vers d’autres marchés africains, notamment en Afrique australe, et vers les marchés internationaux.","We are anchored in the Democratic Republic of the Congo (DRC), with a vision to expand to other African markets, notably Southern Africa, and to international markets.")}</p>
 </div></div></section>
<section class="sec sec-navy"><div class="wrap cols2">
 <div class="panel reveal"><h3>{L("Notre vision","Our vision")}</h3><p>{L("Faire d’Africa Connect Group une entreprise de référence dans la connexion des opportunités économiques, la valorisation des ressources africaines et le développement de partenariats stratégiques entre l’Afrique et le reste du monde.","To make Africa Connect Group a reference company in connecting economic opportunities, adding value to African resources and developing strategic partnerships between Africa and the rest of the world.")}</p></div>
 <div class="panel reveal" id="mission"><h3>{L("Notre mission","Our mission")}</h3><ul class="ticks gold">{"".join(f"<li>{esc(m)}</li>" for m in MISSION[lang])}</ul></div>
</div></section>
<section class="sec"><div class="wrap split">
 <div class="reveal"><h2>{L("Notre positionnement","Our positioning")}</h2></div>
 <div class="reveal"><p>{L("Un partenaire d’affaires capable de rapprocher les opportunités, les compétences, les ressources et les marchés.","A business partner able to bring together opportunities, skills, resources and markets.")}</p>
 <p>{L("Plus qu’une présence en ligne, nous construisons une véritable vitrine institutionnelle qui inspire confiance, facilite la prise de contact et ouvre la voie à de nouvelles collaborations.","More than an online presence, we are building a genuine institutional showcase that inspires trust, makes contact easy and opens the way to new collaborations.")}</p></div>
</div></section>
<section class="sec sec-soft"><div class="wrap">
 <div class="sec-head reveal"><h2>{L("Nos valeurs","Our values")}</h2></div>
 <div class="vals">{"".join(f'<div class="val reveal"><h3>{a}</h3><p>{b}</p></div>' for a,b in VALUES[lang])}</div></div></section>
<section class="sec"><div class="wrap split">
 <div class="reveal"><h2>{L("Notre ambition à long terme","Our long-term ambition")}</h2></div>
 <div class="reveal"><p>{L("Renforcer notre présence sur plusieurs marchés africains, développer des partenariats internationaux, accompagner des projets de valorisation des ressources et contribuer à la création d’opportunités économiques durables.","Strengthen our presence across several African markets, develop international partnerships, support resource value-addition projects and contribute to creating sustainable economic opportunities.")}</p>
 <p>{L("Une marque solide, crédible et reconnue pour sa capacité à connecter les acteurs économiques.","A solid, credible brand recognised for its ability to connect economic players.")}</p></div>
</div></section>
{contact_band(lang, pre)}'''

def phead(lang, eyebrow, title, crumb, pre, icon_html="", sub=""):
    return f'''<section class="phead"><div class="wrap">
 <p class="crumb"><a href="{pre or "/"}">{crumb}</a> / {eyebrow}</p>
 <div class="ph-row">{icon_html}<div><h1>{title}</h1>{f'<p class="lead">{sub}</p>' if sub else ''}</div></div></div></section>'''

def pole_page(p, lang):
    pre = "" if lang == "fr" else "/en"
    L = lambda fr, en: fr if lang == "fr" else en
    others = [q for q in POLES if q["slug"] != p["slug"]]
    return f'''
{phead(lang, p["name"][lang], p["name"][lang], L("Accueil","Home"), pre, f'<span class="ico-wrap big">{icon(p["icon"])}</span>', esc(p["intro"][lang]))}
<section class="sec"><div class="wrap cols2">
 <div class="reveal"><h2>{L("Ce que nous faisons","What we do")}</h2>{li(p["what"][lang])}</div>
 <div class="reveal"><h2>{L("Pour qui","Who it’s for")}</h2>{li(p["who"][lang])}
  <div class="callout"><strong>{L("Une opportunité dans ce domaine ?","An opportunity in this field?")}</strong>
  <p>{L("Dites-nous ce que vous proposez ou recherchez.","Tell us what you offer or are looking for.")}</p>
  <a class="btn btn-gold" href="{pre}/contact?pole={p["slug"]}">{L("Nous contacter","Contact us")}</a></div></div>
</div></section>
<section class="sec sec-soft"><div class="wrap">
 <div class="sec-head reveal"><h2>{L("Nos autres pôles","Our other divisions")}</h2></div>
 <div class="grid">{"".join(pole_card(q, lang, pre) for q in others[:3])}</div>
 <p class="center"><a class="link" href="{pre}/#poles">{L("Voir tous les pôles","See all divisions")} →</a></p></div></section>
{contact_band(lang, pre)}'''

def contact(lang):
    pre = "" if lang == "fr" else "/en"
    L = lambda fr, en: fr if lang == "fr" else en
    opts = "".join(f'<option value="{p["slug"]}">{p["name"][lang]}</option>' for p in POLES)
    return f'''
{phead(lang, L("Contact","Contact"), L("Parlons de votre projet.","Let’s talk about your project."), L("Accueil","Home"), pre, "", L("Acheteur, fournisseur, investisseur, institution ou entrepreneur : écrivez-nous.","Buyer, supplier, investor, institution or entrepreneur: write to us."))}
<section class="sec"><div class="wrap contact">
 <form class="form reveal" id="cform" novalidate data-lang="{lang}" data-email="{EMAIL}" data-wa="{PHONE_WA}">
  <div class="row2">
   <label>{L("Nom complet","Full name")}*<input name="name" required autocomplete="name"></label>
   <label>{L("Entreprise / organisation","Company / organisation")}<input name="company" autocomplete="organization"></label></div>
  <div class="row2">
   <label>{L("E-mail","Email")}*<input name="email" type="email" required autocomplete="email"></label>
   <label>{L("Téléphone / WhatsApp","Phone / WhatsApp")}<input name="phone" type="tel" autocomplete="tel"></label></div>
  <div class="row2">
   <label>{L("Vous êtes","You are")}
    <select name="profile"><option>{L("Acheteur","Buyer")}</option><option>{L("Fournisseur / producteur","Supplier / producer")}</option><option>{L("Investisseur","Investor")}</option><option>{L("Institution / organisation","Institution / organisation")}</option><option>{L("Entrepreneur / PME","Entrepreneur / SME")}</option><option>{L("Autre","Other")}</option></select></label>
   <label>{L("Pôle concerné","Division of interest")}
    <select name="pole"><option value="">{L("Je ne sais pas encore","Not sure yet")}</option>{opts}</select></label></div>
  <label>{L("Votre message","Your message")}*<textarea name="message" rows="5" required placeholder="{L("Décrivez votre offre, votre besoin ou votre projet…","Describe your offer, need or project…")}"></textarea></label>
  <p class="err" id="ferr" role="alert" hidden>{L("Merci de renseigner nom, e-mail et message.","Please fill in name, email and message.")}</p>
  <div class="actions">
   <button class="btn btn-wa" type="button" data-send="wa">{L("Envoyer via WhatsApp","Send via WhatsApp")}</button>
   <button class="btn btn-gold" type="button" data-send="mail">{L("Envoyer par e-mail","Send by email")}</button></div>
  <p class="small muted">{L("Le message s’ouvre dans WhatsApp ou votre application e-mail, prêt à être envoyé.","Your message opens in WhatsApp or your email app, ready to send.")}</p>
 </form>
 <aside class="info reveal">
  <h3>{L("Coordonnées","Details")}</h3>
  <a class="ci" href="mailto:{EMAIL}"><span>{L("E-mail","Email")}</span>{EMAIL}</a>
  <a class="ci" href="tel:{PHONE1}"><span>{L("Téléphone / WhatsApp (RDC)","Phone / WhatsApp (DRC)")}</span>{PHONE1_D}</a>
  <a class="ci" href="tel:{PHONE2}"><span>{L("Téléphone (Algérie)","Phone (Algeria)")}</span>{PHONE2_D}</a>
  <a class="ci" href="https://wa.me/{PHONE_WA}" target="_blank" rel="noopener"><span>WhatsApp</span>{L("Discuter maintenant","Chat now")}</a>
  <p class="small muted">Africa Connect Group SARL<br>{L("République démocratique du Congo","Democratic Republic of the Congo")}</p>
 </aside></div></section>'''

# ----------------------------------------------------------------- BUILD
def build():
    for lang in ("fr", "en"):
        L = lambda fr, en: fr if lang == "fr" else en
        base = "Africa Connect Group"
        write(lang, "/", page(lang, "/", L(f"{base} — Connecter les opportunités africaines au monde", f"{base} — Connecting African opportunities to the world"),
              L("Conseil stratégique, commerce international et partenariats en Afrique : cacao & café, agro-commodités, export, investissement, formation, mines et durabilité.","Strategic advisory, international trade and partnerships in Africa: cocoa & coffee, agro commodities, export, investment, training, mining and sustainability."), home(lang), "/"))
        write(lang, "/about", page(lang, "/about", L(f"À propos — {base}", f"About — {base}"), L("Vision, mission, positionnement et valeurs d’Africa Connect Group SARL.","Vision, mission, positioning and values of Africa Connect Group SARL."), about(lang), "/about"))
        write(lang, "/contact", page(lang, "/contact", L(f"Contact — {base}", f"Contact — {base}"), L("Contactez Africa Connect Group par WhatsApp, e-mail ou téléphone.","Contact Africa Connect Group by WhatsApp, email or phone."), contact(lang), "/contact"))
        for p in POLES:
            path = f"/poles/{p['slug']}"
            write(lang, path, page(lang, path, f"{p['name'][lang]} — {base}", p["intro"][lang], pole_page(p, lang), path))
    (OUT / "404.html").write_text((OUT / "index.html").read_text(encoding="utf-8"), encoding="utf-8")
    print("built:", len(list(OUT.rglob('*.html'))), "pages")

if __name__ == "__main__":
    build()
