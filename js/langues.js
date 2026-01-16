/* ============================================================
   app.js — Script principal (VERSION STABLE)
   - Gestion dropdowns (clic extérieur)
   - Sélecteur de langue 🌍 (JS uniquement)
   - Traduction déclenchée UNIQUEMENT au chargement
     ou au changement volontaire de langue
   ============================================================ */


/* ============================================================
   1) GESTION DES DROPDOWNS
   ============================================================ */

document.addEventListener('click', (e) => {

  // Exclusions : dropdowns + sélecteur de langue
  if (
    e.target.closest('.dropdown') ||
    e.target.closest('#lang-switcher')
  ) {
    return;
  }

  // Ferme toutes les dropdowns ouvertes
  document
    .querySelectorAll('.dropdown .show')
    .forEach(el => el.classList.remove('show'));
});


/* ============================================================
   2) LANG SWITCHER — TRADUCTION GLOBALE (JS ONLY)
   ============================================================ */

(() => {

  /* ---------------- CONFIGURATION ---------------- */

  const LANGS = {
    fr: "Français",
    en: "English",
    it: "Italiano",
    es: "Español",
    de: "Deutsch",
    pt: "Português",
    nl: "Nederlands",
    pl: "Polski",
    ar: "العربية",
    zh: "中文"
  };

  const STORAGE_KEY = "site_lang";
  const API = "https://translate.googleapis.com/translate_a/single";
  const IGNORE = "script,style,code,pre,noscript,textarea,input,[data-no-translate]";
  const ATTRS = ["title", "aria-label", "placeholder", "alt"];

  const originalText = new Map();
  const originalAttrs = new Map();
  let busy = false;


  /* ---------------- LANG INIT ---------------- */

  const getStoredLang = () => {
    try {
      const l = localStorage.getItem(STORAGE_KEY);
      return LANGS[l] ? l : null;
    } catch {
      return null;
    }
  };

  const getBrowserLang = () => {
    const l = (navigator.language || "fr").split("-")[0];
    return LANGS[l] ? l : "fr";
  };

  const initialLang = getStoredLang() || getBrowserLang();


  /* ---------------- UI + CSS ---------------- */

  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      #lang-switcher {
        position: fixed !important;
        top: 70px !important;
        right: 100px !important;
        z-index: 99999 !important;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(255,255,255,.96);
        border: 1px solid rgba(0,0,0,.2);
        box-shadow: 0 4px 14px rgba(0,0,0,.15);
        font: 13px system-ui, sans-serif;
      }

      #lang-switcher select {
        border: none;
        background: transparent;
        cursor: pointer;
      }

      #lang-switcher select:focus {
        outline: none;
      }
    `;
    document.head.appendChild(style);
  }

  function buildUI() {
    const box = document.createElement('div');
    box.id = 'lang-switcher';
    box.setAttribute('aria-label', 'Sélecteur de langue');

    const globe = document.createElement('span');
    globe.textContent = '🌍';

    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Choisir la langue');

    Object.entries(LANGS).forEach(([k, v]) => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = v;
      if (k === initialLang) opt.selected = true;
      select.appendChild(opt);
    });

    box.append(globe, select);
    return { box, select };
  }

  function mountUI(ui) {
    document.body.appendChild(ui.box);
  }


  /* ---------------- COLLECTE DOM ---------------- */

  function isTextOK(node) {
    if (!node.nodeValue.trim()) return false;
    if (node.parentElement.closest(IGNORE)) return false;
    if (/^[\d\s.,:/()%+-]+$/.test(node.nodeValue)) return false;
    return true;
  }

  function collectTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];
    while (walker.nextNode()) {
      if (isTextOK(walker.currentNode)) {
        nodes.push(walker.currentNode);
      }
    }
    return nodes;
  }

  function cacheText() {
    collectTextNodes().forEach(n => {
      if (!originalText.has(n)) {
        originalText.set(n, n.nodeValue);
      }
    });
  }

  function cacheAttrs() {
    document.querySelectorAll('*').forEach(el => {
      if (el.closest(IGNORE)) return;

      ATTRS.forEach(attr => {
        const v = el.getAttribute(attr);
        if (!v) return;

        if (!originalAttrs.has(el)) {
          originalAttrs.set(el, {});
        }

        if (!originalAttrs.get(el)[attr]) {
          originalAttrs.get(el)[attr] = v;
        }
      });
    });
  }


  /* ---------------- TRADUCTION ---------------- */

  async function translate(str, lang) {
    const r = await fetch(
      `${API}?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(str)}`
    );
    const j = await r.json();
    return j[0].map(x => x[0]).join('');
  }

  async function applyTranslation(lang) {
    if (!LANGS[lang]) return;

    // 🔒 Empêche toute retraduction inutile
    if (lang === document.documentElement.lang) return;

    busy = true;

    cacheText();
    cacheAttrs();

    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

    for (const [node, original] of originalText.entries()) {
      if (node.isConnected) {
        node.nodeValue = await translate(original, lang);
      }
    }

    for (const [el, attrs] of originalAttrs.entries()) {
      if (!el.isConnected) continue;

      for (const a in attrs) {
        el.setAttribute(a, await translate(attrs[a], lang));
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}

    busy = false;
  }


  /* ---------------- OBSERVER (SÉCURISÉ) ---------------- */

  // ➜ Observe uniquement les NOUVEAUX nœuds
  // ➜ AUCUNE retraduction globale
  const observer = new MutationObserver(mutations => {
    if (busy) return;

    const lang = getStoredLang();
    if (!lang) return;

    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          isTextOK(node)
        ) {
          originalText.set(node, node.nodeValue);

          translate(node.nodeValue, lang).then(t => {
            if (node.isConnected) {
              node.nodeValue = t;
            }
          });
        }
      });
    });
  });


  /* ---------------- INIT ---------------- */

  document.addEventListener('DOMContentLoaded', () => {

    injectCSS();

    const ui = buildUI();
    mountUI(ui);

    ui.select.addEventListener('change', e => {
      applyTranslation(e.target.value);
    });

    // Traduction UNIQUE au chargement
    applyTranslation(initialLang);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

})();
