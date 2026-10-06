/* Zuri Cliff: Cookie-Einwilligung. GA4 und Meta-Pixel laden erst nach Zustimmung. */
(function () {
  var GA_ID = 'G-JM8MX1LTEF';
  var PIXEL_ID = '1103962212198227';
  var KEY = 'zc_consent';          // 'none' | 'analytics' | 'marketing' | 'all'
  var MAXAGE = 31536000;           // 12 Monate

  var TXT = {
    en: { text: 'We use cookies. Essential cookies keep this site working. You decide about the rest. You can change your choice at any time under “Cookie settings” in the footer.',
          optA: 'Analytics (Google Analytics): helps us understand how the site is used.', optM: 'Marketing (Meta Pixel): lets us measure our advertising on Instagram and Facebook.',
          decline: 'Decline', save: 'Save selection', accept: 'Accept all', privacy: 'Privacy Policy', terms: 'Terms & Conditions', cookies: 'Cookie Policy', imprint: 'Imprint', settings: 'Cookie settings' },
    de: { text: 'Wir verwenden Cookies. Essenzielle Cookies halten die Website in Betrieb. Über alles Weitere entscheiden Sie. Ihre Wahl können Sie jederzeit unter «Cookie-Einstellungen» in der Fusszeile ändern.',
          optA: 'Analyse (Google Analytics): hilft uns zu verstehen, wie die Website genutzt wird.', optM: 'Marketing (Meta-Pixel): erlaubt uns, unsere Werbung auf Instagram und Facebook zu messen.',
          decline: 'Ablehnen', save: 'Auswahl speichern', accept: 'Alle akzeptieren', privacy: 'Datenschutz', terms: 'AGB', cookies: 'Cookie-Richtlinie', imprint: 'Impressum', settings: 'Cookie-Einstellungen' },
    fr: { text: 'Nous utilisons des cookies. Les cookies essentiels assurent le fonctionnement du site. Pour le reste, c’est vous qui décidez. Vous pouvez modifier votre choix à tout moment sous « Paramètres des cookies » en bas de page.',
          optA: 'Analyse (Google Analytics) : nous aide à comprendre l’utilisation du site.', optM: 'Marketing (pixel Meta) : nous permet de mesurer notre publicité sur Instagram et Facebook.',
          decline: 'Refuser', save: 'Enregistrer la sélection', accept: 'Tout accepter', privacy: 'Confidentialité', terms: 'Conditions', cookies: 'Politique de cookies', imprint: 'Mentions légales', settings: 'Paramètres des cookies' },
    it: { text: 'Utilizziamo i cookie. I cookie essenziali garantiscono il funzionamento del sito. Per il resto decide lei. Può modificare la sua scelta in qualsiasi momento in «Impostazioni cookie» a fondo pagina.',
          optA: 'Analisi (Google Analytics): ci aiuta a capire come viene usato il sito.', optM: 'Marketing (pixel Meta): ci permette di misurare la nostra pubblicità su Instagram e Facebook.',
          decline: 'Rifiuta', save: 'Salva selezione', accept: 'Accetta tutti', privacy: 'Privacy', terms: 'Condizioni', cookies: 'Cookie Policy', imprint: 'Note legali', settings: 'Impostazioni cookie' },
    es: { text: 'Utilizamos cookies. Las cookies esenciales mantienen el sitio en funcionamiento. Del resto decide usted. Puede cambiar su elección en cualquier momento en «Configuración de cookies» al pie de página.',
          optA: 'Analítica (Google Analytics): nos ayuda a entender cómo se usa el sitio.', optM: 'Marketing (píxel de Meta): nos permite medir nuestra publicidad en Instagram y Facebook.',
          decline: 'Rechazar', save: 'Guardar selección', accept: 'Aceptar todas', privacy: 'Privacidad', terms: 'Condiciones', cookies: 'Política de cookies', imprint: 'Aviso legal', settings: 'Configuración de cookies' }
  };

  function lang() {
    var l = null;
    try { l = localStorage.getItem('zc_lang'); } catch (e) {}
    if (!l) l = (document.documentElement.lang || navigator.language || 'en');
    l = String(l).slice(0, 2).toLowerCase();
    return TXT[l] ? l : 'en';
  }
  function getChoice() {
    var m = document.cookie.match(/(?:^|;\s*)zc_consent=([a-z]+)/);
    return m ? m[1] : null;
  }
  function setChoice(v) {
    document.cookie = KEY + '=' + v + '; path=/; max-age=' + MAXAGE + '; SameSite=Lax';
  }
  function flags(v) { return { a: v === 'all' || v === 'analytics', m: v === 'all' || v === 'marketing' }; }
  function deleteCookies(kind) {
    var host = location.hostname, parts = host.split('.'), doms = [host, '.' + host];
    if (parts.length > 2) doms.push('.' + parts.slice(-2).join('.'));
    else doms.push('.' + host);
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      var hit = (kind === 'analytics' && (n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid'))
             || (kind === 'marketing' && (n === '_fbp' || n === '_fbc'));
      if (hit) {
        doms.forEach(function (d) { document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d; });
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    });
  }

  var loadedA = false, loadedM = false;
  function loadAnalytics() {
    if (loadedA) return; loadedA = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var g = document.createElement('script');
    g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(g);
  }
  function loadMarketing() {
    if (loadedM) return; loadedM = true;
    if (/^\d{10,20}$/.test(PIXEL_ID)) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }
      (window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }
  function applyChoice(v) { var f = flags(v); if (f.a) loadAnalytics(); if (f.m) loadMarketing(); }

  var banner = null;
  function syncHeight() {
    var h = (banner && !banner.hidden) ? banner.offsetHeight : 0;
    document.documentElement.style.setProperty('--cb-h', h + 'px');
  }
  function closeBanner() { if (banner) { banner.hidden = true; } syncHeight(); }
  function decide(v) {
    var prev = flags(getChoice()), next = flags(v);
    setChoice(v);
    var revoked = false;
    if (!next.a) { window['ga-disable-' + GA_ID] = true; deleteCookies('analytics'); if (prev.a || loadedA) revoked = true; }
    if (!next.m) { deleteCookies('marketing'); if (prev.m || loadedM) revoked = true; }
    closeBanner();
    if (revoked) { location.reload(); return; }
    applyChoice(v);
  }
  function syncChecks() {
    if (!banner) return;
    var f = flags(getChoice());
    banner.querySelector('[data-zc-chk="a"]').checked = f.a;
    banner.querySelector('[data-zc-chk="m"]').checked = f.m;
  }
  function openLegal(page, ev) {
    if (typeof window.showLegal === 'function') { if (ev) ev.preventDefault(); window.showLegal(page); }
  }
  function css() {
    if (document.getElementById('zc-cb-css')) return;
    var s = document.createElement('style'); s.id = 'zc-cb-css';
    s.textContent = '.zc-cb{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#14110e;border-top:1px solid rgba(184,148,63,.35);color:#d8cfc0;padding:18px clamp(1.25rem,5vw,3rem) calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-wrap:wrap;gap:14px 28px;align-items:center;justify-content:space-between;font:12px/1.55 "Jost",system-ui,sans-serif}'
      + '.zc-cb[hidden]{display:none}.zc-cb p{margin:0;max-width:760px}.zc-cb a{color:#b8943f;text-decoration:underline;margin-right:.9em;white-space:nowrap}'
      + '.zc-cb .zc-links{display:block;margin-top:.5em}.zc-cb .zc-btns{display:flex;gap:10px;flex-wrap:wrap}.zc-cb .zc-opts{display:flex;flex-direction:column;gap:7px;margin:10px 0 0}.zc-cb .zc-opts label{display:flex;gap:9px;align-items:flex-start;cursor:pointer}.zc-cb .zc-opts input{margin-top:3px;accent-color:#b8943f;flex:0 0 auto}'
      + '.zc-cb button{font:inherit;font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:11px 18px;width:150px;border:1px solid #b8943f;background:transparent;color:#d8cfc0;cursor:pointer}'
      + '.zc-cb button:hover,.zc-cb button:focus-visible{background:#b8943f;color:#14110e}'
      + '.zc-legal{margin-top:1.2rem;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.zc-legal a,.zc-legal button{color:inherit;opacity:.8;margin-right:1.2em;text-decoration:none;background:none;border:0;padding:0;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}'
      + '.zc-legal a:hover,.zc-legal button:hover{opacity:1;text-decoration:underline}'
      + '@media(max-width:600px){.zc-cb{padding:13px 1.25rem calc(13px + env(safe-area-inset-bottom,0px));font-size:11px;max-height:92vh;overflow-y:auto}.zc-cb .zc-btns{width:100%}.zc-cb button{flex:1 1 0;width:auto;min-width:0;padding:11px 6px;font-size:9px;letter-spacing:.1em}}';
    document.head.appendChild(s);
  }
  function legalHref(page) { return (typeof window.showLegal === 'function') ? '#' : '/#' + page; }
  function build() {
    css();
    banner = document.createElement('div');
    banner.className = 'zc-cb'; banner.id = 'zc-cookie-banner';
    banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-label', 'Cookies');
    banner.hidden = true;
    banner.innerHTML = '<div><p data-zc-t="text"></p>'
      + '<div class="zc-opts"><label><input type="checkbox" data-zc-chk="a"><span data-zc-t="optA"></span></label>'
      + '<label><input type="checkbox" data-zc-chk="m"><span data-zc-t="optM"></span></label></div>'
      + '<span class="zc-links">'
      + ['privacy', 'terms', 'cookies'].map(function (p) { return '<a data-zc-legal="' + p + '" data-zc-t="' + p + '" href="' + legalHref(p) + '"></a>'; }).join('')
      + '<a data-zc-t="imprint" href="/imprint/"></a></span></div>'
      + '<div class="zc-btns"><button type="button" data-zc-act="none" data-zc-t="decline"></button><button type="button" data-zc-act="save" data-zc-t="save"></button><button type="button" data-zc-act="all" data-zc-t="accept"></button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (ev) {
      var a = ev.target.closest('[data-zc-act]');
      if (a) {
        var act = a.getAttribute('data-zc-act');
        if (act === 'save') {
          var ca = banner.querySelector('[data-zc-chk="a"]').checked, cm = banner.querySelector('[data-zc-chk="m"]').checked;
          act = ca && cm ? 'all' : ca ? 'analytics' : cm ? 'marketing' : 'none';
        }
        decide(act); return;
      }
      var l = ev.target.closest('[data-zc-legal]'); if (l) openLegal(l.getAttribute('data-zc-legal'), ev);
    });
  }
  function footerLinks() {
    // Unterseiten: Rechtslinks in die Fusszeile; Startseite hat eine eigene Liste mit data-zc-t
    var foot = document.querySelector('footer .wrap');
    if (foot && !document.querySelector('.zc-legal') && !document.querySelector('[data-zc-open]')) {
      var p = document.createElement('p'); p.className = 'zc-legal';
      p.innerHTML = ['privacy', 'terms', 'cookies'].map(function (k) { return '<a data-zc-t="' + k + '" href="/#' + k + '"></a>'; }).join('')
        + '<a data-zc-t="imprint" href="/imprint/"></a><button type="button" data-zc-open data-zc-t="settings"></button>';
      foot.appendChild(p);
    }
    document.addEventListener('click', function (ev) {
      var o = ev.target.closest('[data-zc-open]'); if (o) { ev.preventDefault(); window.zcConsent.open(); }
    });
  }
  function render() {
    var T = TXT[lang()];
    document.querySelectorAll('[data-zc-t]').forEach(function (el) { el.textContent = T[el.getAttribute('data-zc-t')]; });
    if (banner) banner.setAttribute('lang', lang());
    syncHeight();
  }

  window.zcConsent = { open: function () { if (!banner) return; banner.hidden = false; syncChecks(); render(); }, get: getChoice };

  // Vor der Wahl: nichts laden. Nach Zustimmung (gespeichert): sofort laden, wie bisher im Kopf der Seite.
  applyChoice(getChoice());

  document.addEventListener('DOMContentLoaded', function () {
    build(); footerLinks(); render();
    if (!getChoice()) { banner.hidden = false; syncChecks(); render(); }
    window.addEventListener('resize', syncHeight);
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
})();
