// Generates the static pages into /public from scripts/content.js
// Run: node scripts/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content.js');
const fr = C.fr;
const PUB = path.join(__dirname, '..', 'public');
const SITE = process.env.SITE_URL || ''; // optional, e.g. https://www.africaconnectgroup.com

const EMAIL = 'africaconnectgroup1@gmail.com';
const PHONE1 = '+243 899 639 009', PHONE1_RAW = '+243899639009';
const PHONE2 = '+213 793 338 879', PHONE2_RAW = '+213793338879';
const WA = '243899639009';

const IC = {
  'cacao-coffee': '<path d="M7 20c-2.5-1-4-3.5-4-6.5C3 8 7 4 13 4c4 0 7 .5 8 1 0 6-3 13-9 15-1.800.6-3.500.5-5 0z"/><path d="M8 16c3-1 6-4 8-8"/>',
  'agro-commodities': '<path d="M12 21V9"/><path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 11c3 0 5-2 5-5-3 0-5 2-5 5z"/><path d="M5 21h14"/>',
  'export-solutions': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z"/>',
  'investment-partnerships': '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  'training-academy': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.500V16c0 1.500 3 3 6 3s6-1.500 6-3v-4.500"/><path d="M22 9v6"/>',
  'mining-commodities': '<path d="M12 3l8 5v8l-8 5-8-5V8z"/><path d="M12 3v18"/><path d="M4 8l8 5 8-5"/>',
  'sustainability': '<path d="M5 19c0-8 5-14 15-14 0 10-5 15-13 15"/><path d="M5 19c2-5 5-8 10-10"/>'
};
const svg = (id, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[id]}</svg>`;
const ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
const ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>';
const ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.200 7-11a7 7 0 10-14 0c0 4.800 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/></svg>';
const ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.040 2a9.900 9.900 0 00-8.500 14.900L2 22l5.300-1.400A9.900 9.900 0 1012.040 2zm0 1.800a8.100 8.100 0 11-4.200 15l-.3-.2-3.100.8.800-3-.2-.3A8.100 8.100 0 0112.040 3.800zM8.700 7.600c-.2 0-.5.100-.7.400-.3.300-1 1-1 2.300s1 2.700 1.200 2.900c.1.200 2 3.200 5 4.400 2.500 1 3 .8 3.500.7.600-.1 1.800-.7 2-1.400.3-.7.300-1.300.2-1.400l-.5-.3-1.800-.9c-.3-.1-.5-.1-.7.100l-.8 1c-.1.200-.3.200-.6.100-.3-.2-1.200-.4-2.300-1.400-.8-.8-1.400-1.700-1.600-2-.1-.3 0-.4.100-.6l.4-.5.3-.5v-.5l-.8-2c-.2-.5-.4-.4-.6-.4z"/></svg>';
const ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(fr['wa.msg'])}`;
const T = (k) => fr[k];
const i = (k, tag = 'span', attrs = '') => `<${tag} data-i18n="${k}"${attrs}>${fr[k]}</${tag}>`;

const NAV = [
  ['/', 'nav.home', 'home'], ['/about', 'nav.about', 'about'], ['/poles', 'nav.poles', 'poles'],
  ['/projects', 'nav.projects', 'projects'], ['/contact', 'nav.contact', 'contact']
];

function header(active) {
  return `<header class="site-header"><div class="wrap nav">
  <a class="brand" href="/" aria-label="Africa Connect Group"><img src="/assets/img/logo-wide.jpg" alt="Africa Connect Group" width="110" height="50"></a>
  <nav class="nav-links" id="menu" aria-label="Main">${NAV.map(([h, k, id]) => `<a href="${h}"${id === active ? ' class="active"' : ''} data-i18n="${k}">${T(k)}</a>`).join('')}</nav>
  <div class="nav-actions">
    <div class="lang" role="group" aria-label="Language"><button data-l="fr" class="on">FR</button><button data-l="en">EN</button></div>
    <a class="btn btn-gold desk" href="/contact" data-i18n="nav.cta">${T('nav.cta')}</a>
    <button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="menu"><span></span></button>
  </div></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap">
  <div class="foot-grid">
    <div class="foot-brand"><img src="/assets/img/logo-wide.jpg" alt="Africa Connect Group" width="120" height="56"><p data-i18n="footer.tag">${T('footer.tag')}</p></div>
    <div><h4 data-i18n="footer.nav">${T('footer.nav')}</h4><ul>${NAV.map(([h, k]) => `<li><a href="${h}" data-i18n="${k}">${T(k)}</a></li>`).join('')}</ul></div>
    <div><h4 data-i18n="footer.poles">${T('footer.poles')}</h4><ul>${C.poleIds.map(p => `<li><a href="/poles/${p}" data-i18n="pole.${p}.name">${T('pole.' + p + '.name')}</a></li>`).join('')}</ul></div>
    <div><h4 data-i18n="footer.contact">${T('footer.contact')}</h4><ul>
      <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
      <li><a href="tel:${PHONE1_RAW}">${PHONE1}</a></li>
      <li><a href="tel:${PHONE2_RAW}">${PHONE2}</a></li>
      <li><a href="${waLink}" data-wa target="_blank" rel="noopener">WhatsApp</a></li>
      <li data-i18n="contact.hq">${T('contact.hq')}</li></ul></div>
  </div>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} Africa Connect Group SARL. <span data-i18n="footer.rights">${T('footer.rights')}</span></span><span>RDC · Africa · International</span></div>
  </div></footer>
  <a class="wa-float" href="${waLink}" data-wa target="_blank" rel="noopener" aria-label="WhatsApp">${ICON_WA}</a>`;
}

function page({ file, active, titleKey, descKey, title, desc, body, path: urlPath }) {
  const ttl = title || T(titleKey), d = desc || T(descKey);
  const canonical = SITE ? `<link rel="canonical" href="${SITE}${urlPath}">` : '';
  const html = `<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${ttl}</title>
<meta name="description" content="${d}">
<meta name="theme-color" content="#081428">
${canonical}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Africa Connect Group">
<meta property="og:title" content="${ttl}">
<meta property="og:description" content="${d}">
${SITE ? `<meta property="og:image" content="${SITE}/assets/img/og-icon.png">` : ''}
<link rel="icon" type="image/png" href="/assets/img/favicon.png">
<link rel="apple-touch-icon" href="/assets/img/og-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
<script>document.documentElement.classList.remove('no-js')</script>
</head>
<body data-title-key="${titleKey || ''}" data-desc-key="${descKey || ''}">
${header(active)}
<main>${body}</main>
${footer()}
<script src="/assets/js/content.js"></script>
<script src="/assets/js/main.js"></script>
</body></html>`;
  const out = path.join(PUB, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

const hero = (titleKey, subKey, crumb) => `<section class="page-hero on-dark"><canvas data-net></canvas><div class="wrap">
  ${crumb || ''}<h1 data-i18n="${titleKey}">${T(titleKey)}</h1><p data-i18n="${subKey}">${T(subKey)}</p></div></section>`;

const ctaBand = () => `<section style="padding-top:0"><div class="wrap"><div class="cta-band reveal"><div style="position:relative;z-index:1">
  <h2 data-i18n="cta.title">${T('cta.title')}</h2><p data-i18n="cta.text">${T('cta.text')}</p></div>
  <div class="actions"><a class="btn btn-gold" href="/contact" data-i18n="cta.btn">${T('cta.btn')}</a>
  <a class="btn btn-ghost" href="${waLink}" data-wa target="_blank" rel="noopener">${ICON_WA}<span data-i18n="cta.wa">${T('cta.wa')}</span></a></div></div></div></section>`;

const poleCards = () => C.poleIds.map((p, n) => `<a class="card reveal" href="/poles/${p}"><span class="num">0${n + 1}</span>
  <div class="icon">${svg(p)}</div><h3 data-i18n="pole.${p}.name">${T('pole.' + p + '.name')}</h3>
  <p data-i18n="pole.${p}.short">${T('pole.' + p + '.short')}</p>
  <span class="more"><span data-i18n="poles.more">${T('poles.more')}</span> ${ARROW}</span></a>`).join('');

/* ---------------- HOME ---------------- */
page({
  file: 'index.html', active: 'home', path: '/', titleKey: 'meta.title', descKey: 'meta.desc',
  body: `
<section class="hero on-dark"><canvas data-net></canvas><div class="wrap">
  <span class="eyebrow" data-i18n="hero.eyebrow">${T('hero.eyebrow')}</span>
  <h1 data-i18n="hero.title">${T('hero.title')}</h1>
  <p class="lead" data-i18n="hero.sub">${T('hero.sub')}</p>
  <div class="hero-cta"><a class="btn btn-gold" href="/poles" data-i18n="hero.cta1">${T('hero.cta1')}</a>
  <a class="btn btn-ghost" href="/contact" data-i18n="hero.cta2">${T('hero.cta2')}</a></div>
  <div class="stats">${[1, 2, 3].map(n => `<div class="stat"><b data-i18n="hero.s${n}">${T('hero.s' + n)}</b><span data-i18n="hero.s${n}l">${T('hero.s' + n + 'l')}</span></div>`).join('')}</div>
</div></section>

<section><div class="wrap split">
  <div class="reveal"><span class="eyebrow" data-i18n="intro.eyebrow">${T('intro.eyebrow')}</span>
    <h2 style="margin:14px 0 20px" data-i18n="intro.title">${T('intro.title')}</h2>
    <p class="lead" data-i18n="intro.p1">${T('intro.p1')}</p><p class="lead" data-i18n="intro.p2">${T('intro.p2')}</p>
    <a class="link-arrow" href="/about"><span data-i18n="intro.more">${T('intro.more')}</span> ${ARROW}</a></div>
  <div class="intro-card reveal"><img src="/assets/img/logo-wide.jpg" alt="Africa Connect Group" width="560" height="280" loading="lazy"></div>
</div></section>

<section class="bg-ivory"><div class="wrap">
  <div class="section-head reveal"><span class="eyebrow" data-i18n="poles.eyebrow">${T('poles.eyebrow')}</span><h2 data-i18n="poles.title">${T('poles.title')}</h2></div>
  <div class="grid-poles">${poleCards()}</div></div></section>

<section class="bg-navy on-dark"><div class="wrap split">
  <div class="reveal"><span class="eyebrow" data-i18n="vision.eyebrow">${T('vision.eyebrow')}</span>
    <p class="vision-quote" style="margin-top:18px" data-i18n="vision.title">${T('vision.title')}</p></div>
  <div class="reveal"><p data-i18n="vision.p1">${T('vision.p1')}</p><p data-i18n="vision.p2">${T('vision.p2')}</p></div>
</div></section>

<section><div class="wrap">
  <div class="section-head reveal"><span class="eyebrow" data-i18n="audience.eyebrow">${T('audience.eyebrow')}</span><h2 data-i18n="audience.title">${T('audience.title')}</h2></div>
  <div class="chips reveal">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<span class="chip" data-i18n="audience.${n}">${T('audience.' + n)}</span>`).join('')}</div></div></section>

<section class="bg-ivory"><div class="wrap">
  <div class="section-head reveal"><span class="eyebrow" data-i18n="how.eyebrow">${T('how.eyebrow')}</span><h2 data-i18n="how.title">${T('how.title')}</h2></div>
  <div class="steps">${[1, 2, 3].map(n => `<div class="step reveal"><h3 data-i18n="how.${n}.t">${T('how.' + n + '.t')}</h3><p data-i18n="how.${n}.d">${T('how.' + n + '.d')}</p></div>`).join('')}</div></div></section>

${ctaBand()}`
});

/* ---------------- ABOUT ---------------- */
page({
  file: 'about.html', active: 'about', path: '/about', titleKey: 'about.title', descKey: 'meta.desc',
  title: 'À propos — Africa Connect Group',
  body: `${hero('about.title', 'about.sub')}
<section><div class="wrap split">
  <div class="reveal"><h2 data-i18n="about.who.title">${T('about.who.title')}</h2>
  <p class="lead" style="margin-top:18px" data-i18n="intro.p1">${T('intro.p1')}</p><p class="lead" data-i18n="intro.p2">${T('intro.p2')}</p></div>
  <div class="reveal"><h2 data-i18n="about.pos.title">${T('about.pos.title')}</h2><p class="lead" style="margin-top:18px" data-i18n="about.pos.p">${T('about.pos.p')}</p></div>
</div></section>
<section class="bg-navy on-dark"><div class="wrap split">
  <div class="reveal"><span class="eyebrow" data-i18n="vision.eyebrow">${T('vision.eyebrow')}</span><p class="vision-quote" style="margin-top:18px" data-i18n="vision.title">${T('vision.title')}</p></div>
  <div class="reveal"><p data-i18n="vision.p1">${T('vision.p1')}</p><p data-i18n="vision.p2">${T('vision.p2')}</p></div></div></section>
<section class="bg-ivory"><div class="wrap">
  <div class="section-head reveal"><span class="eyebrow" data-i18n="mission.eyebrow">${T('mission.eyebrow')}</span><h2 data-i18n="mission.title">${T('mission.title')}</h2></div>
  <ul class="mission">${[1, 2, 3, 4, 5, 6, 7].map(n => `<li class="reveal" data-i18n="mission.${n}">${T('mission.' + n)}</li>`).join('')}</ul></div></section>
<section class="bg-navy on-dark"><div class="wrap">
  <div class="section-head reveal"><span class="eyebrow" data-i18n="values.eyebrow">${T('values.eyebrow')}</span><h2 data-i18n="values.title">${T('values.title')}</h2></div>
  <div class="values">${[1, 2, 3, 4, 5].map(n => `<div class="value reveal"><h3 data-i18n="values.${n}.t">${T('values.' + n + '.t')}</h3><p data-i18n="values.${n}.d">${T('values.' + n + '.d')}</p></div>`).join('')}</div></div></section>
<section><div class="wrap split">
  <div class="reveal"><h2 data-i18n="about.long.title">${T('about.long.title')}</h2><p class="lead" style="margin-top:18px" data-i18n="about.long.p">${T('about.long.p')}</p></div>
  <div class="reveal"><span class="eyebrow" data-i18n="audience.eyebrow">${T('audience.eyebrow')}</span><h2 style="margin:14px 0 22px" data-i18n="audience.title">${T('audience.title')}</h2>
  <div class="chips">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<span class="chip" data-i18n="audience.${n}">${T('audience.' + n)}</span>`).join('')}</div></div>
</div></section>
${ctaBand()}`
});

/* ---------------- POLES OVERVIEW ---------------- */
page({
  file: 'poles/index.html', active: 'poles', path: '/poles', titleKey: 'poles.page.title', descKey: 'meta.desc',
  title: 'Nos pôles — Africa Connect Group',
  body: `${hero('poles.page.title', 'poles.page.sub')}
<section><div class="wrap"><div class="grid-poles">${poleCards()}</div></div></section>${ctaBand()}`
});

/* ---------------- 7 POLE PAGES ---------------- */
C.poleIds.forEach((p) => {
  const others = C.poleIds.filter(x => x !== p).map(x => `<a href="/poles/${x}"><span class="icon">${svg(x)}</span><span data-i18n="pole.${x}.name">${T('pole.' + x + '.name')}</span></a>`).join('');
  page({
    file: `poles/${p}.html`, active: 'poles', path: `/poles/${p}`,
    titleKey: `pole.${p}.name`, descKey: `pole.${p}.desc`,
    title: `${T('pole.' + p + '.name')} — Africa Connect Group`, desc: T('pole.' + p + '.desc'),
    body: `<section class="page-hero on-dark"><canvas data-net></canvas><div class="wrap">
    <a class="crumb" href="/poles" data-i18n="pole.page.back">${T('pole.page.back')}</a>
    <h1 data-i18n="pole.${p}.name">${T('pole.' + p + '.name')}</h1><p data-i18n="pole.${p}.short">${T('pole.' + p + '.short')}</p></div></section>
<section><div class="wrap split">
  <div class="reveal"><span class="eyebrow" data-i18n="pole.page.what">${T('pole.page.what')}</span>
    <p class="lead" style="margin-top:16px" data-i18n="pole.${p}.desc">${T('pole.' + p + '.desc')}</p>
    <ul class="bullets">${[1, 2, 3, 4].map(n => `<li data-i18n="pole.${p}.b${n}">${T('pole.' + p + '.b' + n)}</li>`).join('')}</ul>
    <div style="margin-top:30px"><a class="btn btn-navy" href="/contact?pole=${p}" data-i18n="nav.cta">${T('nav.cta')}</a></div></div>
  <div class="pole-visual reveal"><canvas data-net></canvas>${svg(p, 'big')}</div>
</div></section>
<section class="bg-ivory"><div class="wrap"><div class="section-head reveal"><h2 data-i18n="pole.page.other">${T('pole.page.other')}</h2></div><div class="mini-poles">${others}</div></div></section>
${ctaBand()}`
  });
});

/* ---------------- PROJECTS ---------------- */
page({
  file: 'projects.html', active: 'projects', path: '/projects', titleKey: 'projects.title', descKey: 'meta.desc',
  title: 'Projets & opportunités — Africa Connect Group',
  body: `${hero('projects.title', 'projects.sub')}
<section><div class="wrap">
  <div class="empty reveal"><div class="icon">${svg('investment-partnerships')}</div>
    <h2 data-i18n="projects.empty.t">${T('projects.empty.t')}</h2><p data-i18n="projects.empty.d">${T('projects.empty.d')}</p>
    <div class="filters">${[1, 2, 3, 4].map(n => `<span data-i18n="projects.c${n}">${T('projects.c' + n)}</span>`).join('')}</div></div>
  <div class="cta-band reveal" style="margin-top:34px"><div style="position:relative;z-index:1"><h2 data-i18n="projects.submit.t">${T('projects.submit.t')}</h2><p data-i18n="projects.submit.d">${T('projects.submit.d')}</p></div>
  <div class="actions"><a class="btn btn-gold" href="/contact" data-i18n="projects.submit.btn">${T('projects.submit.btn')}</a></div></div>
</div></section>`
});

/* ---------------- CONTACT ---------------- */
const typeOpts = ['buyer', 'supplier', 'investor', 'institution', 'entrepreneur', 'other'].map(v => `<option value="${v}" data-i18n="form.type.${v}">${T('form.type.' + v)}</option>`).join('');
const poleOpts = C.poleIds.map(p => `<option value="${p}" data-i18n="pole.${p}.name">${T('pole.' + p + '.name')}</option>`).join('') + `<option value="other" data-i18n="form.pole.other">${T('form.pole.other')}</option>`;
const field = (id, key, type = 'text', extra = '') => `<div class="field${extra}"><label for="${id}" data-i18n="form.${key}">${T('form.' + key)}</label><input id="${id}" name="${id}" type="${type}" ${id === 'name' || id === 'email' ? 'required' : ''} autocomplete="${id === 'name' ? 'name' : id === 'email' ? 'email' : id === 'phone' ? 'tel' : id === 'company' ? 'organization' : 'country-name'}"></div>`;
page({
  file: 'contact.html', active: 'contact', path: '/contact', titleKey: 'contact.title', descKey: 'meta.desc',
  title: 'Contact — Africa Connect Group',
  body: `${hero('contact.title', 'contact.sub')}
<section><div class="wrap contact-grid">
  <aside class="info-card on-dark reveal"><h2 data-i18n="contact.info">${T('contact.info')}</h2>
    <div class="info-item"><span class="icon">${ICON_MAIL}</span><div><div><small data-i18n="contact.email">${T('contact.email')}</small><a href="mailto:${EMAIL}">${EMAIL}</a></div></div></div>
    <div class="info-item"><span class="icon">${ICON_PHONE}</span><div><div><small data-i18n="contact.phone">${T('contact.phone')}</small><a href="tel:${PHONE1_RAW}">${PHONE1}</a><a href="tel:${PHONE2_RAW}">${PHONE2}</a></div></div></div>
    <div class="info-item"><span class="icon">${ICON_WA}</span><div><div><small data-i18n="contact.wa">${T('contact.wa')}</small><a href="${waLink}" data-wa target="_blank" rel="noopener">${PHONE1}</a></div></div></div>
    <div class="info-item"><span class="icon">${ICON_PIN}</span><div><div><small>HQ</small><span data-i18n="contact.hq">${T('contact.hq')}</span></div></div></div>
    <a class="btn btn-gold" href="${waLink}" data-wa target="_blank" rel="noopener">${ICON_WA}<span data-i18n="cta.wa">${T('cta.wa')}</span></a>
  </aside>
  <form class="form reveal" id="contact-form" novalidate="false">
    ${field('name', 'name')}${field('company', 'company')}${field('email', 'email', 'email')}${field('phone', 'phone', 'tel')}${field('country', 'country')}
    <div class="field"><label for="type" data-i18n="form.type">${T('form.type')}</label><select id="type" name="type">${typeOpts}</select></div>
    <div class="field full"><label for="pole" data-i18n="form.pole">${T('form.pole')}</label><select id="pole" name="pole">${poleOpts}</select></div>
    <div class="field full"><label for="message" data-i18n="form.message">${T('form.message')}</label><textarea id="message" name="message" required data-i18n-ph="form.ph.message" placeholder="${T('form.ph.message')}"></textarea></div>
    <button class="btn btn-gold" type="submit" data-i18n="form.submit">${T('form.submit')}</button>
    <p class="note" data-i18n="form.note">${T('form.note')}</p>
  </form>
</div></section>`
});

/* ---------------- assets / config ---------------- */
fs.copyFileSync(path.join(__dirname, 'content.js'), path.join(PUB, 'assets/js/content.js'));
// expose CONTENT to the browser
fs.appendFileSync(path.join(PUB, 'assets/js/content.js'), '\nif (typeof window !== "undefined") window.CONTENT = CONTENT;\n');

const urls = ['/', '/about', '/poles', ...C.poleIds.map(p => '/poles/' + p), '/projects', '/contact'];
if (SITE) {
  fs.writeFileSync(path.join(PUB, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(PUB, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
} else {
  fs.writeFileSync(path.join(PUB, 'robots.txt'), 'User-agent: *\nAllow: /\n');
}
console.log('Built', urls.length, 'pages');
