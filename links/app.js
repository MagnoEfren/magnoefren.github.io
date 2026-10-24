/* Página de enlaces — renderiza todo a partir de config.js */
(function () {
  "use strict";
  var C = window.LINKS_CONFIG || {};
  var P = C.profile || {}, TH = C.theme || {}, TX = C.texts || {};
  var d = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Iconos de trazo fino (24×24) */
  var I = {
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    youtube: '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12" rx=".5"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.4 4.6 5.5 5"/>',
    x: '<path d="M4 4l16 16M20 4 4 20"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    whatsapp: '<path d="M3 21l1.7-4.6A9 9 0 1 1 8 20z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-.9-.4-1.9-1.4-2.3-2.3l.8-1-1-2z"/>',
    telegram: '<path d="m22 3-20 8 7 2 2 7 4-5 5 4z"/><path d="m9 13 9-7"/>',
    discord: '<path d="M8 17c-3 0-5-1.5-5-1.5 0-5 2-10 2-10S7 4 9 4l1 2h4l1-2c2 0 4 1.5 4 1.5s2 5 2 10c0 0-2 1.5-5 1.5l-1-2"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>',
    patreon: '<circle cx="14.5" cy="9.5" r="6.5"/><path d="M3.5 3v18"/>',
    kofi: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M10.5 15.2s-2.7-1.6-2.7-3.3a1.4 1.4 0 0 1 2.7-.6 1.4 1.4 0 0 1 2.7.6c0 1.7-2.7 3.3-2.7 3.3z"/>',
    paypal: '<path d="M7 21 9.5 4h6.5a4 4 0 0 1 0 8H11l-1.2 9z"/><path d="M5 18 7.5 1"/>'.replace('<path d="M5 18 7.5 1"/>', ""),
    mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    pin: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
  };
  function icon(n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (I[n] || I.link) + "</svg>"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function ext(url) { return /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : ""; }

  /* ---------- Tema y apariencia ---------- */
  if (TH.accent) d.style.setProperty("--accent", TH.accent);
  if (TH.accent2) d.style.setProperty("--accent-2", TH.accent2);
  if (typeof TH.glass === "number") d.style.setProperty("--glass-a", String(TH.glass));
  if (TH.backgroundBlur) d.style.setProperty("--bg-blur", TH.backgroundBlur + "px");
  if (TH.background) document.querySelector(".scene__img").style.backgroundImage = 'url("' + TH.background + '")';
  if (TX.pageTitle) document.title = TX.pageTitle;
  if (TX.pageDescription) document.querySelector('meta[name="description"]').setAttribute("content", TX.pageDescription);

  function setThemeIcon() { $("theme").innerHTML = icon(d.getAttribute("data-theme") === "dark" ? "sun" : "moon"); }
  $("theme").addEventListener("click", function () {
    var next = d.getAttribute("data-theme") === "dark" ? "light" : "dark";
    d.classList.add("theme-anim"); setTimeout(function () { d.classList.remove("theme-anim"); }, 500);
    d.setAttribute("data-theme", next);
    try { localStorage.setItem("links-theme", next); } catch (e) { /* noop */ }
    setThemeIcon();
  });
  setThemeIcon();

  /* ---------- Perfil ---------- */
  var av = $("p-avatar");
  av.src = P.avatar || P.fallbackAvatar || "";
  av.alt = P.name ? "Foto de " + P.name : "";
  av.onerror = function () { if (P.fallbackAvatar && av.src.indexOf(P.fallbackAvatar.replace("../", "")) === -1) av.src = P.fallbackAvatar; };
  var parts = String(P.name || "").trim().split(/\s+/);
  var last = parts.length > 1 ? parts.pop() : "";
  $("p-name").innerHTML = esc(parts.join(" ")) + (last ? " <em>" + esc(last) + "</em>" : "");
  $("p-role").textContent = P.role || "";
  $("p-bio").textContent = P.bio || "";
  if (P.location) $("p-loc").innerHTML = icon("pin") + esc(P.location);
  if (P.timezone) {
    $("p-sep").hidden = !P.location;
    var tick = function () {
      try {
        var t = new Intl.DateTimeFormat("es", { hour: "2-digit", minute: "2-digit", timeZone: P.timezone }).format(new Date());
        $("p-time").innerHTML = icon("clock") + "<b>" + t + "</b>";
      } catch (e) { $("p-time").textContent = ""; }
    };
    tick(); setInterval(tick, 30000);
  }

  $("share").innerHTML = icon("share") + "<span>" + esc(TX.share || "Compartir") + "</span>";
  $("share").addEventListener("click", function () {
    var data = { title: TX.pageTitle || document.title, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { toast(TX.copied || "Enlace copiado"); };
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
  });

  $("socials").innerHTML = (C.socials || []).map(function (s) {
    return '<a href="' + esc(s.url) + '"' + ext(s.url) + ' aria-label="' + esc(s.label || s.icon) + '" title="' + esc(s.label || s.icon) + '">' + icon(s.icon) + "</a>";
  }).join("");

  /* ---------- Destacado ---------- */
  var F = C.featured || {};
  if (F.show !== false && F.url) {
    var fe = $("featured");
    fe.href = F.url; if (ext(F.url)) { fe.target = "_blank"; fe.rel = "noopener"; }
    fe.innerHTML = (F.image ? '<div class="featured__img"><img src="' + esc(F.image) + '" alt="" loading="eager"></div>' : "") +
      '<div class="featured__body"><div><span class="featured__tag">' + esc(F.label || "") + '</span><h2 class="featured__title">' + esc(F.title || "") +
      '</h2><span class="featured__sub">' + esc(F.subtitle || "") + '</span></div><span class="featured__go">' + esc(TX.visit || "Visitar") + icon("arrow") + "</span></div>";
    fe.hidden = false;
  }

  /* ---------- Grupos ---------- */
  var n = 0;
  var wave = '<svg class="tile__wave" viewBox="0 0 400 18" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12 C25 2 50 2 75 12 S125 22 150 12 S200 2 225 12 S275 22 300 12 S350 2 375 12 S400 16 400 12"/></svg>';
  $("groups").innerHTML = (C.groups || []).map(function (g) {
    var items = (g.links || []).map(function (l) {
      n++;
      return '<a class="tile glass" href="' + esc(l.url) + '"' + ext(l.url) + ">" +
        '<span class="tile__ico">' + icon(l.icon) + "</span>" +
        '<span class="tile__txt"><span class="tile__label">' + esc(l.label) + '</span><span class="tile__sub">' + esc(l.sub || "") + "</span></span>" +
        '<span class="tile__go">' + icon("arrow") + "</span>" +
        '<span class="tile__n">' + (n < 10 ? "0" : "") + n + "</span>" + wave + "</a>";
    }).join("");
    return '<section class="group"><h2 class="group__title">' + esc(g.title || "") + '</h2><div class="list">' + items + "</div></section>";
  }).join("");
  $("foot").innerHTML = "© " + new Date().getFullYear() + " · " + esc(TX.footer || "");

  /* ---------- Entrada escalonada ---------- */
  var seq = [".profile", ".featured:not([hidden])", ".group__title", ".tile", ".foot"];
  var i = 0;
  seq.forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) { el.classList.add("in"); el.style.setProperty("--i", String(i++)); });
  });

  /* ---------- Brillo y efecto magnético en los enlaces ---------- */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    Array.prototype.forEach.call(document.querySelectorAll(".tile"), function (t) {
      t.addEventListener("pointermove", function (e) {
        var r = t.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        t.style.setProperty("--mx", x + "px"); t.style.setProperty("--my", y + "px");
        t.style.setProperty("--tx", ((x / r.width - .5) * 6).toFixed(1) + "px");
        t.style.setProperty("--ty", ((y / r.height - .5) * 4).toFixed(1) + "px");
      });
      t.addEventListener("pointerleave", function () { t.style.setProperty("--tx", "0px"); t.style.setProperty("--ty", "0px"); });
    });
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    var el = document.querySelector(".toast"); el.textContent = msg; el.classList.add("on");
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, 1800);
  }
})();
