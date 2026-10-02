/* Zuri Cliff: Cookie-Einwilligung. GA4 und Meta-Pixel laden erst nach Zustimmung. */
(function () {
  var GA_ID = 'G-JM8MX1LTEF';
  var PIXEL_ID = '1103962212198227';
  var KEY = 'zc_consent';          // 'all' = Analyse und Marketing, 'none' = abgelehnt
  var MAXAGE = 31536000;           // 12 Monate

  var TXT = {
    en: { text: 'We use cookies. Essential cookies keep this site working. With your consent we also use analytics (Google Analytics) and marketing (Meta Pixel) cookies to understand how the site is used and to measure our advertising. You can decline, and change your choice at any time under “Cookie settings” in the footer.',
          accept: 'Accept all', decline: 'Decline', privacy: 'Privacy Policy', terms: 'Terms & Conditions', cookies: 'Cookie Policy', imprint: 'Imprint', settings: 'Cookie settings' },
    de: { text: 'Wir verwenden Cookies. Essenzielle Cookies sorgen dafür, dass die Website funktioniert. Mit Ihrer Einwilligung nutzen wir zusätzlich Analyse- (Google Analytics) und Marketing-Cookies (Meta-Pixel), um die Nutzung der Website zu verstehen und unsere Werbung zu messen. Sie können ablehnen und Ihre Wahl jederzeit unter «Cookie-Einstellungen» in der Fusszeile ändern.',
          accept: 'Alle akzeptieren', decline: 'Ablehnen', privacy: 'Datenschutz', terms: 'AGB', cookies: 'Cookie-Richtlinie', imprint: 'Impressum', settings: 'Cookie-Einstellungen' },
    fr: { text: 'Nous utilisons des cookies. Les cookies essentiels assurent le fonctionnement du site. Avec votre consentement, nous utilisons en plus des cookies d’analyse (Google Analytics) et de marketing (Meta Pixel) pour comprendre l’utilisation du site et mesurer notre publicité. Vous pouvez refuser et modifier votre choix à tout moment via « Paramètres des cookies » en bas de page.',
          accept: 'Tout accepter', decline: 'Refuser', privacy: 'Confidentialité', terms: 'Conditions', cookies: 'Politique de cookies', imprint: 'Mentions légales', settings: 'Paramètres des cookies' },
    it: { text: 'Utilizziamo i cookie. I cookie essenziali garantiscono il funzionamento del sito. Con il vostro consenso utilizziamo inoltre cookie di analisi (Google Analytics) e di marketing (Meta Pixel) per capire come viene usato il sito e misurare la nostra pubblicità. Potete rifiutare e modificare la scelta in qualsiasi momento da «Impostazioni cookie» a piè di pagina.',
          accept: 'Accetta tutti', decline: 'Rifiuta', privacy: 'Privacy', terms: 'Condizioni', cookies: 'Cookie Policy', imprint: 'Note legali', settings: 'Impostazioni cookie' },
    es: { text: 'Utilizamos cookies. Las cookies esenciales mantienen el sitio en funcionamiento. Con su consentimiento, usamos además cookies de análisis (Google Analytics) y de marketing (Meta Pixel) para entender cómo se usa el sitio y medir nuestra publicidad. Puede rechazar y cambiar su elección en cualquier momento en «Configuración de cookies», al pie de la página.',
          accept: 'Aceptar todas', decline: 'Rechazar', privacy: 'Privacidad', terms: 'Condiciones', cookies: 'Política de cookies', imprint: 'Aviso legal', settings: 'Configuración de cookies' }
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
  function deleteTrackingCookies() {
    var host = location.hostname, parts = host.split('.'), doms = [host, '.' + host];
    if (parts.length > 2) doms.push('.' + parts.slice(-2).join('.'));
    else doms.push('.' + host);
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0 || n === '_fbp' || n === '_fbc' || n === '_gid') {
        doms.forEach(function (d) { document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d; });
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    });
  }

  var loaded = false;
  function loadTracking() {
    if (loaded) return; loaded = true;
    // Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var g = document.createElement('script');
    g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(g);
    // Meta Pixel
    if (/^\d{10,20}$/.test(PIXEL_ID)) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }
      (window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }

  var banner = null;
  function syncHeight() {
    var h = (banner && !banner.hidden) ? banner.offsetHeight : 0;
    document.documentElement.style.setProperty('--cb-h', h + 'px');
  }
  function closeBanner() { if (banner) { banner.hidden = true; } syncHeight(); }
  function decide(v) {
    var had = getChoice() === 'all';
    setChoice(v);
    if (v === 'all') { loadTracking(); closeBanner(); }
    else {
      window['ga-disable-' + GA_ID] = true;
      deleteTrackingCookies();
      closeBanner();
      if (had || loaded) location.reload();
    }
  }
  function openLegal(page, ev) {
    if (typeof window.showLegal === 'function') { if (ev) ev.preventDefault(); window.showLegal(page); }
  }
  function css() {
    if (document.getElementById('zc-cb-css')) return;
    var s = document.createElement('style'); s.id = 'zc-cb-css';
    s.textContent = '.zc-cb{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#14110e;border-top:1px solid rgba(184,148,63,.35);color:#d8cfc0;padding:18px clamp(1.25rem,5vw,3rem) calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-wrap:wrap;gap:14px 28px;align-items:center;justify-content:space-between;font:12px/1.55 "Jost",system-ui,sans-serif}'
      + '.zc-cb[hidden]{display:none}.zc-cb p{margin:0;max-width:760px}.zc-cb a{color:#b8943f;text-decoration:underline;margin-right:.9em;white-space:nowrap}'
      + '.zc-cb .zc-links{display:block;margin-top:.5em}.zc-cb .zc-btns{display:flex;gap:10px;flex-wrap:wrap}'
      + '.zc-cb button{font:inherit;font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:11px 24px;min-width:128px;border:1px solid #b8943f;background:transparent;color:#d8cfc0;cursor:pointer}'
      + '.zc-cb button:hover,.zc-cb button:focus-visible{background:#b8943f;color:#14110e}'
      + '.zc-legal{margin-top:1.2rem;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.zc-legal a,.zc-legal button{color:inherit;opacity:.8;margin-right:1.2em;text-decoration:none;background:none;border:0;padding:0;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}'
      + '.zc-legal a:hover,.zc-legal button:hover{opacity:1;text-decoration:underline}'
      + '@media(max-width:600px){.zc-cb{padding:13px 1.25rem calc(13px + env(safe-area-inset-bottom,0px));font-size:11px}.zc-cb .zc-btns{width:100%}.zc-cb button{flex:1;min-width:0;padding:11px 10px}}';
    document.head.appendChild(s);
  }
  function legalHref(page) { return (typeof window.showLegal === 'function') ? '#' : '/#' + page; }
  function build() {
    css();
    banner = document.createElement('div');
    banner.className = 'zc-cb'; banner.id = 'zc-cookie-banner';
    banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-label', 'Cookies');
    banner.hidden = true;
    banner.innerHTML = '<div><p data-zc-t="text"></p><span class="zc-links">'
      + ['privacy', 'terms', 'cookies'].map(function (p) { return '<a data-zc-legal="' + p + '" data-zc-t="' + p + '" href="' + legalHref(p) + '"></a>'; }).join('')
      + '<a data-zc-t="imprint" href="/imprint/"></a></span></div>'
      + '<div class="zc-btns"><button type="button" data-zc-act="none" data-zc-t="decline"></button><button type="button" data-zc-act="all" data-zc-t="accept"></button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (ev) {
      var a = ev.target.closest('[data-zc-act]'); if (a) { decide(a.getAttribute('data-zc-act')); return; }
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

  window.zcConsent = { open: function () { if (!banner) return; banner.hidden = false; render(); }, get: getChoice };

  // Vor der Wahl: nichts laden. Nach Zustimmung (gespeichert): sofort laden, wie bisher im Kopf der Seite.
  if (getChoice() === 'all') loadTracking();

  document.addEventListener('DOMContentLoaded', function () {
    build(); footerLinks(); render();
    if (!getChoice()) { banner.hidden = false; render(); }
    window.addEventListener('resize', syncHeight);
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
})();
