/* =====================================================================
   CONFIGURACIÓN DE LA PÁGINA DE ENLACES
   Edita solo este archivo. Guarda, haz commit y push: la página se actualiza sola.

   Iconos disponibles (campo "icon"):
   web, youtube, github, linkedin, instagram, tiktok, x, facebook, whatsapp,
   telegram, discord, patreon, kofi, paypal, mail, download, play, code,
   cpu, heart, star, link, calendar, file
   ===================================================================== */
window.LINKS_CONFIG = {

  /* ---------- Perfil ---------- */
  profile: {
    name: "Magno Efren",                 // la última palabra se muestra en letra cursiva
    role: "Ingeniero Mecatrónico",
    bio: "Automatización industrial, SCADA, IIoT y software en Python.",
    avatar: "../assets/img/foto.jpeg",   // si no existe, se muestra el logo
    fallbackAvatar: "../assets/img/favicon-100.png",
    location: "Perú",
    timezone: "America/Lima"             // muestra la hora local junto a la ubicación ("" para ocultar)
  },

  /* ---------- Apariencia ---------- */
  theme: {
    accent: "#27c9c5",                   // color principal
    accent2: "#6ea4ff",                  // color secundario (degradados)
    background: "bg.webp",               // imagen de fondo (ruta o URL)
    backgroundBlur: 0,                   // desenfoque extra de la imagen en px (0 = nítida)
    glass: 0.42,                         // opacidad del vidrio (0.2 muy transparente – 0.8 casi sólido)
    mode: "auto"                         // "auto" (según el sistema), "dark" o "light"
  },

  /* ---------- Enlace destacado (tarjeta grande) ---------- */
  featured: {
    show: true,
    label: "Destacado",
    title: "Portafolio web",
    subtitle: "Proyectos de automatización, IIoT y software",
    url: "https://magnoefren.github.io",
    image: "../assets/img/og-cover.png"
  },

  /* ---------- Grupos de enlaces ---------- */
  groups: [
    {
      title: "Contenido",
      links: [
        { label: "Canal de YouTube", sub: "Tutoriales de Python, Arduino y apps", url: "https://www.youtube.com/@MagnoEfren", icon: "youtube" },
        { label: "GitHub",           sub: "Código abierto de mis proyectos",     url: "https://github.com/MagnoEfren",       icon: "github" },
        { label: "LinkedIn",         sub: "Perfil profesional",                  url: "https://www.linkedin.com/in/magnoefren/", icon: "linkedin" }
      ]
    },
    {
      title: "Apoya el contenido",
      links: [
        { label: "Ko-fi",           sub: "Invítame un café",            url: "https://ko-fi.com/magnoefren",                           icon: "kofi" },
        { label: "Patreon",         sub: "Contenido exclusivo",         url: "https://www.patreon.com/c/magnoefren",                   icon: "patreon" },
        { label: "PayPal",          sub: "Aporte directo",              url: "https://www.paypal.com/paypalme/magnoefren",              icon: "paypal" },
        { label: "Unirse al canal", sub: "Membresía de YouTube",        url: "https://www.youtube.com/channel/UCBwN7Z5LWQAJ_6ueSEzDtGQ/join", icon: "star" }
      ]
    }
  ],

  /* ---------- Iconos pequeños de redes (fila inferior) ---------- */
  socials: [
    { icon: "instagram", url: "https://www.instagram.com/magnoefren/", label: "Instagram" },
    { icon: "youtube",   url: "https://www.youtube.com/@MagnoEfren",    label: "YouTube" },
    { icon: "github",    url: "https://github.com/MagnoEfren",          label: "GitHub" },
    { icon: "linkedin",  url: "https://www.linkedin.com/in/magnoefren/", label: "LinkedIn" },
    { icon: "mail",      url: "mailto:contacto.magnoefren@gmail.com",   label: "Correo" }
  ],

  /* ---------- Textos generales ---------- */
  texts: {
    pageTitle: "Magno Efren · Enlaces",
    pageDescription: "Todos los enlaces de Magno Efren: portafolio, YouTube, GitHub, LinkedIn y formas de apoyar el contenido.",
    share: "Compartir",
    copied: "Enlace copiado",
    visit: "Visitar",
    footer: "magnoefren.github.io"
  }
};
