function createPaginationMarkup(page, totalPages) {
  lettotalMark = '';
  if (page === 1) {
    totalMarkup = `
          <li class="pagination__item pagination__item--margin-right">
              <button type="button" class="pagination__btn pagination__btn-arrow pagination__btn--disabled" disabled id="pagination-previous-page">
                  <svg class="pagination_svg" width="16" height="16">
                      <use href="./images/decorative/sprite.svg#icon-arrow-left"></use>
                  </svg>
              </button>
          </li > `;
  } else {
    totalMarkup = `
          <li class="pagination__item pagination__item--margin-right">
              <button type="button" class="pagination__btn pagination__btn-arrow pagination__btn--disabled" id="pagination-previous-page">
                  <svg class="pagination_svg" width="16" height="16">
                      <use href="./images/decorative/sprite.svg#icon-arrow-left"></use>
                  </svg>
              </button>
          </li > `;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      totalMarkup += `<li class="pagination__item pagination__item--margin-right"><button type="button" class="pagination__btn pagination__btn--active" id="pagination-page-number pagination-page-${i}">${i}</button></li>`;
    } else {
      totalMarkup += `<li class="pagination__item pagination__item--margin-right"><button type="button" class="pagination__btn" id="pagination-page-number pagination-page-${i}">${i}</button></li>`;
    }
  }

  if (page === totalPages) {
    totalMarkup += `            
          <li class="pagination__item">
              <button type="button" class="pagination__btn pagination__btn-arrow" disabled id="pagination-next-page">
                  <svg class="pagination_svg" width="16" height="16">
                      <use href="./images/decorative/sprite.svg#icon-arrow-right"></use>
                  </svg>
              </button>
          </li>
        `;
  } else {
    totalMarkup += `            
          <li class="pagination__item">
              <button type="button" class="pagination__btn pagination__btn-arrow" id="pagination-next-page">
                  <svg class="pagination_svg" width="16" height="16">
                      <use href="./images/decorative/sprite.svg#icon-arrow-right"></use>
                  </svg>
              </button>
          </li>
        `;
  }
  return totalMarkup;
}

export { createPaginationMarkup };
