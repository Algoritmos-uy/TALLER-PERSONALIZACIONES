/**
 * courseCard.js
 * Genera y renderiza cards de cursos — preparado para render dinámico
 */

/**
 * Genera el HTML de una card de curso
 * @param {Object} course
 */
export function renderCourseCard(course) {
  // Soporte para campo `image` en course.json. Si existe, lo usamos tal cual
  // (acepta 'cur-001.png' o 'assets/courses/cur-001.png' o una ruta absoluta/URL).
  // Si no existe, construimos rutas por convención usando el `id`.
  const { id, title, icon, duration, modality, description, image } = course;

  // Determinar base y si incluye extensión
  let baseNoExt; // ruta sin extensión (ej: assets/courses/cur-001)
  let explicitWithExt = null; // si image ya trae extensión y queremos usarla tal cual
  if (image) {
    // image puede contener extensión o no
    const hasExt = /\.[a-z0-9]+$/i.test(image);
    if (hasExt) {
      // Si es una ruta relativa que no comienza con assets/, normalizamos prefix
      if (/^(assets\/|\/.+|https?:)/.test(image)) {
        explicitWithExt = image.replace(/^\//, '');
      } else {
        explicitWithExt = `assets/courses/${image}`;
      }
    } else {
      // sin extensión -> tratar como base sin extensión
      if (/^(assets\/|\/.+|https?:)/.test(image)) {
        baseNoExt = image.replace(/^\//, '');
      } else {
        baseNoExt = `assets/courses/${image}`;
      }
    }
  } else {
    baseNoExt = `assets/courses/${id}`;
  }

  // Si explicitWithExt está presente usaremos solo <img src="explicitWithExt">;
  // en caso contrario construiremos sources para avif/webp/png a partir de baseNoExt
  // Construir HTML del <picture> según lo que tengamos
  let pictureHtml = '';
  const onerror = `this.style.display='none'; const f=this.closest('.c-course-card__icon').querySelector('.c-course-card__icon-emoji'); if(f) f.style.display='inline-block';`;
  if (explicitWithExt) {
    const imgSrc = explicitWithExt;
    pictureHtml = `<img src="${imgSrc}" alt="${title}" loading="lazy" onerror="${onerror}">`;
  } else {
    const avif = `${baseNoExt}.avif`;
    const webp = `${baseNoExt}.webp`;
    const png  = `${baseNoExt}.png`;
    pictureHtml = `
      <source srcset="${avif}" type="image/avif">
      <source srcset="${webp}" type="image/webp">
      <img src="${png}" alt="${title}" loading="lazy" onerror="${onerror}">
    `;
  }

  return `
    <article class="c-course-card js-reveal">
      <div class="c-course-card__icon" aria-hidden="true">
        <picture>
          ${pictureHtml}
        </picture>
        <span class="c-course-card__icon-emoji" style="display:none">${icon}</span>
      </div>
      <h3 class="c-course-card__title">${title}</h3>
      <div class="c-course-card__meta">
        <span class="c-course-card__meta-item">⏱ ${duration}</span>
        <span class="c-course-card__meta-item">📍 ${modality}</span>
      </div>
      <p class="c-course-card__description">${description}</p>
      <span class="c-course-card__coming-soon">✦ Próximamente</span>
    </article>
  `;
}

/**
 * Renderiza el grid de cursos
 * @param {Array} courses - array de cursos (puede estar vacío)
 */
export function renderCourseGrid(courses) {
  const grid = document.querySelector('#courses-grid');
  if (!grid) return;

  if (!courses?.length) {
    grid.innerHTML = `
      <div class="c-courses-placeholder">
        <div class="c-courses-placeholder__icon" aria-hidden="true">📚</div>
        <p class="c-courses-placeholder__text">Cursos en preparación</p>
        <p class="c-courses-placeholder__sub">Próximamente disponibles</p>
      </div>`;
    return;
  }

  grid.innerHTML = courses.map(renderCourseCard).join('');
}
