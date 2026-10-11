/* Magno Efren — Portafolio v2
   Sin dependencias. Idioma, tema, navegación horizontal por paneles (PC),
   indicador animado del menú, titular animado, datos en vivo (Open-Meteo y GitHub),
   tarjetas con brillo al cursor, copiar correo y formulario. */
(function () {
  "use strict";

  var d = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  };
  var cache = {
    get: function (k, maxAgeMs) {
      try { var o = JSON.parse(sessionStorage.getItem(k)); if (o && Date.now() - o.t < maxAgeMs) return o.v; } catch (e) { /* noop */ }
      return null;
    },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), v: v })); } catch (e) { /* noop */ } }
  };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var STR = {
    es: {
      toLight: "Cambiar a modo claro", toDark: "Cambiar a modo oscuro",
      menuOpen: "Abrir menú", menuClose: "Cerrar menú",
      errName: "Escribe tu nombre (mínimo 2 caracteres).",
      errEmail: "Escribe un correo válido, por ejemplo nombre@dominio.com.",
      errMsg: "Cuéntame un poco más (mínimo 10 caracteres).",
      errForm: "Revisa los campos marcados.",
      ok: "Listo: se abrió tu aplicación de correo con el mensaje preparado.",
      subject: "Contacto desde el portafolio — ",
      copied: "Correo copiado", locale: "es_PE",
      live: "En vivo · Lima", humidity: "HR",
      repos: "repositorios públicos", followers: "seguidores en GitHub"
    },
    en: {
      toLight: "Switch to light mode", toDark: "Switch to dark mode",
      menuOpen: "Open menu", menuClose: "Close menu",
      errName: "Please enter your name (at least 2 characters).",
      errEmail: "Please enter a valid email, e.g. name@domain.com.",
      errMsg: "Tell me a bit more (at least 10 characters).",
      errForm: "Please review the highlighted fields.",
      ok: "Done: your email app opened with the message ready.",
      subject: "Portfolio contact — ",
      copied: "Email copied", locale: "en_US",
      live: "Live · Lima", humidity: "RH",
      repos: "public repositories", followers: "GitHub followers"
    }
  };
  function L() { return d.getAttribute("data-lang") === "en" ? "en" : "es"; }
  function t(k) { return STR[L()][k]; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------------- Idioma ---------------- */
  function applyLang(lang, persist) {
    lang = lang === "en" ? "en" : "es";
    d.setAttribute("data-lang", lang);
    d.setAttribute("lang", lang);
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (a) {
        a = a.trim(); var v = el.getAttribute("data-" + lang + "-" + a);
        if (v !== null) el.setAttribute(a, v);
      });
    });
    var title = d.getAttribute("data-title-" + lang); if (title) document.title = title;
    var og = $('meta[property="og:locale"]'); if (og) og.setAttribute("content", STR[lang].locale);
    $$("[data-set-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-set-lang") === lang)); });
    try {
      var u = new URL(window.location.href);
      if (lang === "en") u.searchParams.set("lang", "en"); else u.searchParams.delete("lang");
      history.replaceState(history.state, "", u.toString());
      var canon = $('link[rel="canonical"]');
      if (canon && canon.getAttribute("data-base")) canon.setAttribute("href", canon.getAttribute("data-base") + (lang === "en" ? "?lang=en" : ""));
    } catch (e) { /* noop */ }
    if (persist) store.set("lang", lang);
    updateThemeLabel(); updateMenuLabel(); renderLive(); renderStats();
    replayHeadline();
    requestAnimationFrame(function () { movePill(false); });
    document.dispatchEvent(new Event("langchange"));
  }

  /* ---------------- Tema ---------------- */
  function currentTheme() { return d.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function updateThemeLabel() {
    $$("[data-theme-toggle]").forEach(function (b) {
      var label = currentTheme() === "dark" ? t("toLight") : t("toDark");
      b.setAttribute("aria-label", label); b.setAttribute("title", label);
    });
  }
  function applyTheme(theme, persist) {
    if (!reduceMotion.matches) { d.classList.add("theme-anim"); setTimeout(function () { d.classList.remove("theme-anim"); }, 500); }
    d.setAttribute("data-theme", theme);
    var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", theme === "light" ? "#eef2f4" : "#07090b");
    if (persist) store.set("theme", theme);
    updateThemeLabel();
  }

  /* ---------------- Menú móvil ---------------- */
  var toggle, menu;
  function updateMenuLabel() {
    if (!toggle) return;
    toggle.setAttribute("aria-label", toggle.getAttribute("aria-expanded") === "true" ? t("menuClose") : t("menuOpen"));
  }
  function setMenu(open, focusBack) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    updateMenuLabel();
    if (open) { var a = $(".nav__link", menu); if (a) a.focus(); requestAnimationFrame(function () { movePill(false); }); }
    else if (focusBack) toggle.focus();
  }

  /* ---------------- Indicador animado del menú ---------------- */
  var activeKey = null;
  function setActive(key) {
    activeKey = key;
    $$(".nav__link[data-nav]").forEach(function (a) {
      var on = a.getAttribute("data-nav") === key;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    movePill();
  }
  var pillState = null;
  function movePill(animate) {
    var pill = $(".nav__pill"); if (!pill) return;
    var a = $(".nav__link.is-active");
    if (!a || !a.offsetParent) { pill.style.opacity = "0"; pillState = null; return; }
    var vertical = window.innerWidth <= 900;
    pill.style.opacity = "1";
    var next = vertical ? { v: true, pos: a.offsetTop - 4, size: a.offsetHeight } : { v: false, pos: a.offsetLeft, size: a.offsetWidth };
    var tf = function (st) { return st.v ? "translateY(" + st.pos + "px)" : "translateX(" + st.pos + "px)"; };
    var apply = function (st) {
      pill.style.transform = tf(st);
      if (st.v) { pill.style.height = st.size + "px"; pill.style.bottom = "auto"; pill.style.width = ""; }
      else { pill.style.width = st.size + "px"; pill.style.height = ""; pill.style.bottom = ""; }
    };
    var prev = pillState; pillState = next;
    if (animate === false || !prev || prev.v !== next.v || reduceMotion.matches || !pill.animate || (prev.pos === next.pos && prev.size === next.size)) { apply(next); return; }
    // Movimiento "líquido": la burbuja se estira hasta cubrir ambos enlaces y luego se contrae en el destino
    var lo = Math.min(prev.pos, next.pos), hi = Math.max(prev.pos + prev.size, next.pos + next.size);
    var mid = { v: next.v, pos: lo, size: hi - lo };
    var prop = next.v ? "height" : "width";
    var squash = next.v ? " scaleX(.94)" : " scaleY(.86)";
    var k0 = { transform: tf(prev) }, k1 = { transform: tf(mid) + squash, offset: .45 }, k2 = { transform: tf(next) };
    k0[prop] = prev.size + "px"; k1[prop] = mid.size + "px"; k2[prop] = next.size + "px";
    apply(next);
    pill.animate([k0, k1, k2], { duration: 620, easing: "cubic-bezier(.22,.8,.24,1)" });
  }

  /* ---------------- Burbuja de luz entre secciones ---------------- */
  function bubble(dir) {
    var orb = $(".wipe__orb");
    if (!orb || !orb.animate || reduceMotion.matches) return;
    var from = (dir > 0 ? 55 : -55) + "vw", to = (dir > 0 ? -55 : 55) + "vw";
    orb.animate([
      { transform: "translateX(" + from + ") scale(.25)", opacity: 0 },
      { transform: "translateX(0) scale(1)", opacity: 1, offset: .45 },
      { transform: "translateX(" + to + ") scale(.55)", opacity: 0 }
    ], { duration: 1150, easing: "cubic-bezier(.65,0,.35,1)" });
  }

  /* ---------------- Deck horizontal ---------------- */
  var panels = [], current = 0, lock = false, deckMQ = window.matchMedia("(min-width: 1024px) and (min-height: 600px)");
  function isDeck() { return d.classList.contains("is-deck"); }
  function indexOfId(id) { for (var i = 0; i < panels.length; i++) if (panels[i].id === id) return i; return -1; }
  function go(i, opts) {
    opts = opts || {};
    if (i < 0 || i >= panels.length) return;
    if (isDeck() && !opts.instant && i !== current) bubble(i > current ? 1 : -1);
    current = i;
    d.style.setProperty("--panel", String(i));
    panels.forEach(function (p, k) {
      var on = k === i;
      p.classList.toggle("is-current", on);
      if (isDeck()) { if (on) p.removeAttribute("inert"); else p.setAttribute("inert", ""); }
      else p.removeAttribute("inert");
    });
    setActive(panels[i].getAttribute("data-nav-key"));
    var count = $(".deckbar__now"); if (count) count.textContent = String(i + 1).padStart(2, "0");
    var name = $(".deckbar__name"); if (name) name.innerHTML = panels[i].getAttribute("data-title-html") || "";
    var fill = $(".deckbar__fill"); if (fill) fill.style.width = ((i + 1) / panels.length * 100) + "%";
    var prev = $("[data-deck-prev]"), next = $("[data-deck-next]");
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === panels.length - 1;
    if (!opts.keepHash) {
      try { var u = new URL(window.location.href); u.hash = i === 0 ? "" : panels[i].id; history.replaceState(null, "", u.toString()); } catch (e) { /* noop */ }
    }
    if (i === 0) replayHeadline();
    if (isDeck() && !opts.instant) { lock = true; setTimeout(function () { lock = false; }, 950); }
    if (isDeck()) panels[i].scrollTop = 0;
  }
  var deckInit = false;
  function enableDeck(on) {
    d.classList.add("no-anim");
    d.classList.toggle("is-deck", on);
    if (on) { window.scrollTo(0, 0); go(current, { instant: true, keepHash: true }); }
    else {
      panels.forEach(function (p) { p.removeAttribute("inert"); });
      if (deckInit) $$(".rv").forEach(function (el) { el.classList.add("is-in"); });
    }
    deckInit = true;
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.remove("no-anim"); movePill(false); }); });
  }
  function canScrollInside(el, dir) {
    if (el.scrollHeight <= el.clientHeight + 2) return false;
    if (dir > 0) return el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    return el.scrollTop > 2;
  }
  function initDeck() {
    panels = $$(".panel[id]");
    if (!panels.length) return;
    d.style.setProperty("--count", String(panels.length));
    var start = indexOfId((window.location.hash || "").slice(1));
    current = start > -1 ? start : 0;
    enableDeck(deckMQ.matches);
    observeMobile();
    var onMQ = function () { enableDeck(deckMQ.matches); };
    if (deckMQ.addEventListener) deckMQ.addEventListener("change", onMQ); else deckMQ.addListener(onMQ);

    // Rueda / trackpad
    var acc = 0, accTimer;
    window.addEventListener("wheel", function (e) {
      if (!isDeck()) return;
      var delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      var dir = delta > 0 ? 1 : -1;
      var inner = panels[current];
      if (e.target.closest && e.target.closest("textarea")) return;
      if (canScrollInside(inner, dir)) { return; }
      e.preventDefault();
      if (lock) { acc = 0; return; }
      acc += delta;
      clearTimeout(accTimer); accTimer = setTimeout(function () { acc = 0; }, 180);
      if (Math.abs(acc) > 45) { acc = 0; go(current + dir); }
    }, { passive: false });

    // Teclado
    document.addEventListener("keydown", function (e) {
      if (!isDeck()) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(current + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(current - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(panels.length - 1); }
    });

    // Gestos táctiles (tablets en horizontal)
    var sx = 0, sy = 0;
    window.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchend", function (e) {
      if (!isDeck()) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) go(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    var prev = $("[data-deck-prev]"), next = $("[data-deck-next]");
    if (prev) prev.addEventListener("click", function () { go(current - 1); });
    if (next) next.addEventListener("click", function () { go(current + 1); });

    window.addEventListener("hashchange", function () {
      var i = indexOfId(window.location.hash.slice(1)); if (i > -1 && isDeck()) go(i, { keepHash: true });
    });
  }
  function observeMobile() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !isDeck()) {
          setActive(en.target.getAttribute("data-nav-key"));
          if (en.target === panels[0]) replayHeadline();
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    panels.forEach(function (p) { io.observe(p); });
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting && !isDeck()) { en.target.classList.add("is-in"); io2.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    $$(".rv").forEach(function (el) { io2.observe(el); });
  }

  /* ---------------- Titular animado ---------------- */
  function splitHeadline() {
    $$("[data-split]").forEach(function (block) {
      if (block.getAttribute("data-split-done")) return;
      var idx = 0;
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var parts = child.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
              var w = document.createElement("span"); w.className = "w" + (node.classList && node.classList.contains("serif") ? " serif-w" : "");
              var inner = document.createElement("span"); inner.textContent = p; inner.style.setProperty("--i", String(idx++));
              w.appendChild(inner); frag.appendChild(w);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1 && child.tagName !== "BR") { walk(child); }
        });
      };
      walk(block);
      block.setAttribute("data-split-done", "1");
    });
  }
  var playTimer;
  function replayHeadline() {
    var els = $$("[data-split]");
    if (!els.length) return;
    els.forEach(function (el) { el.classList.remove("is-play"); });
    clearTimeout(playTimer);
    playTimer = setTimeout(function () { els.forEach(function (el) { void el.offsetWidth; el.classList.add("is-play"); }); }, 60);
  }

  /* ---------------- Datos en vivo: Open-Meteo (sin clave, CORS) ---------------- */
  var liveData = null;
  function fetchLive() {
    var el = $("[data-live]"); if (!el) return;
    var cached = cache.get("me-live", 15 * 60 * 1000);
    if (cached) { liveData = cached; renderLive(); return; }
    var url = "https://api.open-meteo.com/v1/forecast?latitude=-12.0464&longitude=-77.0428&current=temperature_2m,relative_humidity_2m&hourly=temperature_2m&past_hours=24&forecast_hours=1&timezone=America%2FLima";
    if (!window.fetch) return;
    fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      liveData = { temp: j.current.temperature_2m, rh: j.current.relative_humidity_2m, series: (j.hourly && j.hourly.temperature_2m || []).filter(function (v) { return typeof v === "number"; }) };
      cache.set("me-live", liveData); renderLive();
    }).catch(function () { /* sin conexión: el bloque permanece oculto */ });
  }
  function pathFrom(series, w, h, pad) {
    if (!series || series.length < 2) return null;
    var min = Math.min.apply(null, series), max = Math.max.apply(null, series), span = (max - min) || 1;
    var pts = series.map(function (v, i) { return [i / (series.length - 1) * w, h - pad - (v - min) / span * (h - pad * 2)]; });
    var dd = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i], cx = (p0[0] + p1[0]) / 2;
      dd += " C" + cx.toFixed(1) + " " + p0[1].toFixed(1) + " " + cx.toFixed(1) + " " + p1[1].toFixed(1) + " " + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
    }
    return dd;
  }
  function renderLive() {
    var el = $("[data-live]"); if (!el || !liveData) return;
    el.hidden = false;
    $("[data-live-label]").textContent = t("live");
    $("[data-live-val]").textContent = Math.round(liveData.temp * 10) / 10 + " °C · " + t("humidity") + " " + Math.round(liveData.rh) + " %";
    var line = pathFrom(liveData.series, 96, 26, 3);
    if (line) {
      $("[data-live-line]").setAttribute("d", line);
      $("[data-live-area]").setAttribute("d", line + " L96 26 L0 26 Z");
    }
    var wave = $("[data-wave]");
    if (wave) {
      var big = pathFrom(liveData.series, 1000, 200, 30);
      if (big) {
        $("[data-wave-line]").setAttribute("d", big);
        $("[data-wave-area]").setAttribute("d", big + " L1000 200 L0 200 Z");
        wave.removeAttribute("hidden");
      }
    }
  }

  /* ---------------- Datos en vivo: GitHub (API pública) ---------------- */
  var gh = null;
  function fetchGitHub() {
    var el = $("[data-gh]"); if (!el || !window.fetch) return;
    var cached = cache.get("me-gh", 60 * 60 * 1000);
    if (cached) { gh = cached; renderStats(); return; }
    fetch("https://api.github.com/users/MagnoEfren", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { gh = { repos: j.public_repos, followers: j.followers }; cache.set("me-gh", gh); renderStats(); })
      .catch(function () { /* oculto si falla */ });
  }
  function renderStats() {
    var el = $("[data-gh]"); if (!el || !gh) return;
    el.hidden = false;
    $("[data-gh-repos]").textContent = gh.repos; $("[data-gh-repos-l]").textContent = t("repos");
    $("[data-gh-fol]").textContent = gh.followers; $("[data-gh-fol-l]").textContent = t("followers");
  }

  /* ---------------- Tarjetas: brillo que sigue al cursor ---------------- */
  function initCards() {
    $$(".card, .skill, .social, .repo").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (e.clientX - r.left) + "px");
        c.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------------- Correo, copiar y toast ---------------- */
  function mailAddr() { var m = $("[data-mail]"); return m ? m.getAttribute("data-u") + "@" + m.getAttribute("data-d") : ""; }
  function toast(msg) {
    var el = $(".toast"); if (!el) return;
    el.textContent = msg; el.classList.add("is-on");
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("is-on"); }, 1800);
  }
  function initMail() {
    var addr = mailAddr();
    $$("[data-mail]").forEach(function (m) {
      if (m.tagName === "A") m.setAttribute("href", "mailto:" + addr);
      var slot = $("[data-mail-text]", m.parentNode) || $("[data-mail-text]", m);
      if (slot) slot.textContent = addr;
      if (m.hasAttribute("data-mail-text")) m.textContent = addr;
    });
    $$("[data-copy-mail]").forEach(function (b) {
      b.addEventListener("click", function () {
        var done = function () { toast(t("copied")); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(done, done);
        else { var ta = document.createElement("textarea"); ta.value = addr; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) { /* noop */ } ta.remove(); done(); }
      });
    });
  }

  /* ---------------- Formulario (abre el cliente de correo) ---------------- */
  function initForm() {
    var form = document.getElementById("contact-form"); if (!form) return;
    var status = $(".form__status", form);
    var rules = {
      name: function (v) { return v.trim().length >= 2 ? "" : t("errName"); },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : t("errEmail"); },
      message: function (v) { return v.trim().length >= 10 ? "" : t("errMsg"); }
    };
    var inputs = $$("input[name], textarea[name]", form);
    function check(input) {
      var field = input.closest(".field"), err = rules[input.name](input.value), out = $(".field__error", field);
      if (err) { field.setAttribute("data-invalid", ""); input.setAttribute("aria-invalid", "true"); }
      else { field.removeAttribute("data-invalid"); input.removeAttribute("aria-invalid"); }
      out.textContent = err; return !err;
    }
    inputs.forEach(function (i) {
      i.addEventListener("blur", function () { if (i.value) check(i); });
      i.addEventListener("input", function () { if (i.closest(".field").hasAttribute("data-invalid")) check(i); });
    });
    document.addEventListener("langchange", function () {
      inputs.forEach(function (i) { if (i.closest(".field").hasAttribute("data-invalid")) check(i); });
      if (status.textContent) status.textContent = status.classList.contains("is-ok") ? t("ok") : t("errForm");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, bad = null;
      inputs.forEach(function (i) { if (!check(i)) { ok = false; bad = bad || i; } });
      status.classList.remove("is-ok", "is-error");
      if (!ok) { status.textContent = t("errForm"); status.classList.add("is-error"); bad.focus(); return; }
      var name = form.elements.name.value.trim();
      var body = form.elements.message.value.trim() + "\n\n— " + name + " (" + form.elements.email.value.trim() + ")";
      window.location.href = "mailto:" + mailAddr() + "?subject=" + encodeURIComponent(t("subject") + name) + "&body=" + encodeURIComponent(body);
      status.textContent = t("ok"); status.classList.add("is-ok");
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    toggle = $(".nav-toggle"); menu = document.getElementById("nav-menu");
    splitHeadline();
    initDeck();
    applyLang(L(), false);
    applyTheme(currentTheme(), false);

    document.addEventListener("click", function (e) {
      var lb = e.target.closest("[data-set-lang]"); if (lb) { applyLang(lb.getAttribute("data-set-lang"), true); return; }
      var tb = e.target.closest("[data-theme-toggle]"); if (tb) { applyTheme(currentTheme() === "dark" ? "light" : "dark", true); return; }
      var a = e.target.closest("a[href]"); if (!a) return;
      var href = a.getAttribute("href");
      // Navegación entre paneles
      if (href.charAt(0) === "#" && href.length > 1) {
        var i = indexOfId(href.slice(1));
        if (i > -1 && isDeck()) { e.preventDefault(); go(i); setMenu(false, false); return; }
      }
      // Mantener ?lang=en entre páginas internas
      if (L() === "en") {
        try {
          var u = new URL(a.href, window.location.href);
          if (u.origin === window.location.origin && u.pathname !== window.location.pathname && !u.searchParams.has("lang")) { u.searchParams.set("lang", "en"); a.href = u.toString(); }
        } catch (err) { /* noop */ }
      }
    });

    var mq = window.matchMedia("(prefers-color-scheme: light)");
    var onScheme = function (ev) { if (!store.get("theme")) applyTheme(ev.matches ? "light" : "dark", false); };
    if (mq.addEventListener) mq.addEventListener("change", onScheme); else if (mq.addListener) mq.addListener(onScheme);

    if (toggle && menu) {
      toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true", false); });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false, false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true); });
      document.addEventListener("click", function (e) { if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".nav")) setMenu(false, false); });
    }
    window.addEventListener("resize", function () { movePill(false); if (window.innerWidth > 900) setMenu(false, false); });

    $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });

    // Páginas sin paneles (casos de estudio): aparición al hacer scroll
    if (!panels.length) {
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }); }, { threshold: .06 });
        $$(".rv").forEach(function (el) { io.observe(el); });
      } else { $$(".rv").forEach(function (el) { el.classList.add("is-in"); }); }
      setActive(d.getAttribute("data-page-nav") || null);
    }

    initCards(); initMail(); initForm();
    fetchLive(); fetchGitHub();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(false); replayHeadline(); });
    else replayHeadline();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
