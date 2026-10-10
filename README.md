# magnoefren.github.io

Portafolio personal de **Magno Efren Araujo Rodriguez**: Ingeniero Mecatrónico y Técnico en Electrónica Industrial (automatización industrial, IIoT y software en Python).

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni compilación), listo para GitHub Pages.

- En PC las secciones se recorren de forma horizontal (rueda del mouse, flechas ← →, botones o el menú).
- En móvil y tablet vertical se desplazan de forma normal.
- Datos en vivo sin claves: temperatura de Lima (Open-Meteo) y estadísticas públicas de GitHub. Si una API no responde, ese bloque simplemente no se muestra.

## Estructura

```
index.html                 Página principal (ES/EN)
proyectos/*.html           Casos de estudio
404.html                   Página de error personalizada
assets/css/styles.css      Estilos, temas claro/oscuro
assets/js/main.js          Idioma, tema, menú, animaciones, formulario
assets/fonts/              Outfit + Instrument Serif (licencia OFL, alojadas localmente)
assets/img/projects/       Capturas reales de proyectos (WebP)
assets/img/og-cover.png    Imagen al compartir el enlace
favicon.ico                Favicon
robots.txt, sitemap.xml    SEO
.nojekyll                  Publica los archivos tal cual (sin Jekyll)
```

## Publicar

1. En el repositorio `magnoefren.github.io`, elimina los archivos antiguos (`css/`, `js/`, `images/`, `index.py`, `links.html`, `_config.yml`).
2. Copia el contenido de esta carpeta en la raíz del repositorio y haz commit + push a `main`.
3. En **Settings → Pages**, la fuente debe ser *Deploy from a branch* → `main` / `(root)`.

## Idiomas

Cada texto tiene sus dos versiones juntas:

```html
<span data-l="es">Proyectos</span><span data-l="en" lang="en">Projects</span>
```

Para atributos (alt, aria-label, placeholder) se usa `data-es-alt` / `data-en-alt` junto con `data-i18n-attr="alt"`.
El idioma se guarda en el navegador y se puede compartir con `?lang=en`.

## Añadir contenido

- **Foto de perfil:** guarda `assets/img/perfil.webp` (cuadrada, mínimo 400×400 px) y cambia la imagen dentro de `profile__avatar` en `index.html`.
- **Nuevo proyecto:** duplica un `<article class="card …">` en la sección Proyectos y, si quieres un caso de estudio, duplica una página de `proyectos/`. Agrega la nueva URL a `sitemap.xml`.
- **Nuevo video:** duplica un `<a class="card vcard …">` y cambia el ID de YouTube en el enlace y en la miniatura (`i.ytimg.com/vi/ID/mqdefault.jpg`).
