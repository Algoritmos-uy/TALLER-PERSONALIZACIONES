/**
 * courseCard.js
 * Genera y renderiza cards de cursos — preparado para render dinámico
 */

/**
 * Genera el HTML de una card de curso
 * @param {Object} course
 */
export function renderCourseCard(course) {
  const { title, icon, duration, modality, description } = course;

  return `
    <article class="c-course-card js-reveal">
      <div class="c-course-card__icon" aria-hidden="true">${icon}</div>
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
