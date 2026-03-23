/**
 * productCard.js
 * Genera y renderiza cards de producto en el grid
 */

/**
 * Genera el HTML de una card de producto
 * @param {Object} product
 */
export function renderProductCard(product) {
  const { title, description, icon, tag, price, image } = product;

  const mediaContent = image
    ? `<img src="${image}" alt="${title}" loading="lazy" />`
    : `<div class="c-product-card__media-placeholder" aria-hidden="true">${icon}</div>`;

  return `
    <article class="c-product-card js-reveal" data-category="${product.category}">
      <div class="c-product-card__media">
        ${mediaContent}
        <span class="c-product-card__tag">${tag}</span>
      </div>
      <div class="c-product-card__body">
        <h3 class="c-product-card__title">${title}</h3>
        <p class="c-product-card__description">${description}</p>
        <div class="c-product-card__footer">
          <span class="c-product-card__price">${price}</span>
          <span class="c-product-card__cta" aria-label="Ver más sobre ${title}">Ver más</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renderiza el grid completo aplicando el filtro de categoría
 * @param {Array}  products - array de productos
 * @param {string} filter   - 'all' | 'sublimacion' | 'impresion3d'
 */
export function renderProductGrid(products, filter = 'all') {
  const grid = document.querySelector('#products-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  if (!filtered.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:4rem 2rem; color:var(--color-text-faint);">
        No hay productos en esta categoría aún.
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(renderProductCard).join('');
}
