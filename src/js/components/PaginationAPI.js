class PaginationAPI {
  static #MOBILE_MAX_WIDTH = 767;
  static #MOBILE_MIN_WIDTH = 479;
  static #firstPageMarkup = `<li class="pagination__item" id="pagination-number-1"><button class="pagination__btn">1</button></li>`;
  static #dotsLeftMarkup = `<li class="pagination__item pagination__item-dots" id="pagination-dots-left">&#183;&#183;&#183;</li>`;
  static #dotsRightMarkup = `<li class="pagination__item pagination__item-dots" id="pagination-dots-right">&#183;&#183;&#183;</li>`;

  static #paginationWrapperDiv = document.getElementById('pagination-wrapper');

  static #totalMarkup = '';

  static currentPage = 1;
  static totalPages = null;

  static paginationPagesList = document.getElementById('pagination-pages');
  static paginationNextBtn = document.getElementById('pagination-button-next');
  static paginationPreviousBtn = document.getElementById(
    'pagination-button-previous'
  );

  static changePageByOne(isIncrementing) {
    const deltaPage = isIncrementing ? 1 : -1;
    this.currentPage += deltaPage;
  }

  static updateCurrentPage(newCurrentPage) {
    this.currentPage = newCurrentPage;
  }

  static renderPagination() {
    this.#renderPaginationMarkup();
    this.paginationPagesList.innerHTML = this.#totalMarkup;
    this.#afterRendering();
  }

  static onWindowResize() {
    PaginationAPI.renderPagination();
  }

  static #renderPaginationMarkup() {
    this.#totalMarkup = '';

    // if our active page is the last one of the whole pagination, then we disable it.
    // otherwise, we enable it.
    if (this.currentPage === this.totalPages) {
      this.paginationNextBtn.disabled = true;
      this.paginationPreviousBtn.disabled = false;
    } else {
      this.paginationPreviousBtn.disabled = false;
    }

    // if our active page is equal to 1, then we disable our previous value button of pagination.
    // otherwise we show the next button
    if (this.currentPage === 1) {
      this.paginationPreviousBtn.disabled = true;
      this.paginationNextBtn.disabled = false;
    } else if (this.currentPage !== this.totalPages) {
      this.paginationNextBtn.disabled = false;
    }

    // if our total pages value is 1, then we need to hide buttons, but if we update our total pages value, we need to the pagination buttons again in the pagination bar
    if (this.totalPages === 1) {
      this.#paginationWrapperDiv.classList.add('pagination--width-S');
      this.paginationNextBtn.classList.add('pagination__btn--hidden');
      this.paginationPreviousBtn.classList.add('pagination__btn--hidden');

      this.#totalMarkup += this.#firstPageMarkup;
      return;
    } else {
      this.#paginationWrapperDiv.classList.remove('pagination--width-S');
      this.paginationNextBtn.classList.remove('pagination__btn--hidden');
      this.paginationPreviousBtn.classList.remove('pagination__btn--hidden');
    }

    if (this.totalPages <= 2 && !(this.totalPages === 1)) {
      this.#paginationWrapperDiv.classList.add('pagination--width-M');
    } else {
      this.#paginationWrapperDiv.classList.remove('pagination--width-M');
    }

    if (window.innerWidth <= this.#MOBILE_MIN_WIDTH) {
      this.#createSmallMobileMarkup();
      return;
    }

    if (window.innerWidth <= this.#MOBILE_MAX_WIDTH) {
      this.#createMobileMarkup();
      return;
    }

    if (this.totalPages <= 7) {
      this.#totalMarkup += this.#firstPageMarkup;
      for (let i = 2; i <= this.totalPages - 1; i++) {
        this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
      }
      this.#totalMarkup += this.#getLastPageMarkup();
      return;
    }

    // If our active page is less or equal than 5,
    // then we create mark up with 5 first elements in the pagination bar
    if (this.currentPage <= 4) {
      this.#createStartingMarkup();
      return;
    }

    if (this.currentPage === 5) {
      this.#createMiddleActivePagesMarkup();
      return;
    }

    // if our active page is equal to the last five elements of total pagination pages,
    // then we create markup for the last five elements of the pagination bar
    if (this.totalPages - 3 <= this.currentPage && !(this.currentPage <= 5)) {
      this.#createEndingMarkup();
      return;
    }

    if (this.currentPage === this.totalPages - 4) {
      this.#createMiddleActivePagesMarkup();
      return;
    }

    // if our active page is in the middle of pagination (after 5 and before the last five elements),
    // then we create markup of 5 elements with the active in the middle
    if (this.currentPage >= 6 && this.currentPage <= this.totalPages - 4) {
      this.#createMiddleActivePagesMarkup();
      return;
    }
  }

  static #createStartingMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;

    const maxRenderPagesNum = this.totalPages >= 6 ? 5 : this.totalPages;

    for (let i = 2; i <= maxRenderPagesNum; i++) {
      this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
    }

    if (this.totalPages >= 2 && this.totalPages <= 4) {
      this.#paginationWrapperDiv.classList.add('pagination--width-L');
    } else {
      this.#paginationWrapperDiv.classList.remove('pagination--width-L');
    }
    if (this.totalPages >= 6) {
      this.#totalMarkup += this.#dotsRightMarkup;
      this.#totalMarkup += this.#getLastPageMarkup();
    }
  }

  static #createMiddleActivePagesMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;
    this.#totalMarkup += this.#dotsLeftMarkup;

    if (this.currentPage === 5 && this.currentPage + 2 >= this.totalPages) {
      const maxRenderPagesNum =
        this.currentPage + 1 >= this.totalPages
          ? this.currentPage
          : this.currentPage - 1;

      for (let i = this.currentPage - 2; i <= maxRenderPagesNum; i++) {
        this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
      }

      return;
    }

    for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
      this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
    }

    this.#totalMarkup += this.#dotsRightMarkup;
    this.#totalMarkup += this.#getLastPageMarkup();
  }

  static #createEndingMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;
    this.#totalMarkup += this.#dotsLeftMarkup;

    for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
      this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
    }
  }

  static #createMobileMarkup() {
    if (this.totalPages <= 4) {
      this.#totalMarkup += this.#firstPageMarkup;

      for (let i = 2; i <= this.totalPages; i++) {
        this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
      }
      return;
    }

    if (this.currentPage <= 2) {
      this.#createMobileStartingMarkup();
      return;
    }

    if (this.currentPage === 3) {
      this.#createMobileMiddleActivePageMarkup();
      return;
    }

    if (this.totalPages - 1 <= this.currentPage && !(this.currentPage <= 3)) {
      this.#createMobileEndingMarkup();
      return;
    }

    if (this.currentPage === this.totalPages - 2) {
      this.#createMobileMiddleActivePageMarkup();
      return;
    }

    if (this.currentPage >= 4 && this.currentPage <= this.totalPages - 2) {
      this.#createMobileMiddleActivePageMarkup();
      return;
    }
  }

  static #createMobileStartingMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;

    const maxRenderPagesNum = this.totalPages >= 4 ? 3 : this.totalPages;

    for (i = 2; i <= maxRenderPagesNum; i++) {
      this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
    }

    if (this.totalPages >= 4) {
      this.#totalMarkup += this.#dotsRightMarkup;
      this.#totalMarkup += this.#getLastPageMarkup();
    }
  }

  static #createMobileMiddleActivePageMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;
    this.#totalMarkup += this.#dotsLeftMarkup;
    this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(this.currentPage);
    this.#totalMarkup += this.#dotsRightMarkup;
    this.#totalMarkup += this.#getLastPageMarkup();
  }

  static #createMobileEndingMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;
    this.#totalMarkup += this.#dotsLeftMarkup;

    for (let i = this.totalPages - 2; i <= this.totalPages; i++) {
      this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
    }
  }

  static #createSmallMobileMarkup() {
    if (this.totalPages <= 3) {
      this.#totalMarkup += this.#firstPageMarkup;

      for (let i = 2; i <= this.totalPages; i++) {
        this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
      }
      return;
    }

    if (this.currentPage <= 2) {
      this.#createSmallMobileStartingMarkup();
      return;
    }

    if (this.totalPages - 1 <= this.currentPage && !(this.currentPage <= 2)) {
      this.#createSmallMobileEndingMarkup();
      return;
    }

    if (this.currentPage >= 3 && this.currentPage <= this.totalPages - 2) {
      this.#createMobileMiddleActivePageMarkup();
      return;
    }
  }

  static #createSmallMobileStartingMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;

    const maxRenderPagesNum = this.totalPages >= 3 ? 2 : this.totalPages;

    for (i = 2; i <= maxRenderPagesNum; i++) {
      this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
    }

    if (this.totalPages >= 3) {
      this.#totalMarkup += this.#dotsRightMarkup;
      this.#totalMarkup += this.#getLastPageMarkup();
    }
  }

  static #createSmallMobileEndingMarkup() {
    this.#totalMarkup += this.#firstPageMarkup;
    this.#totalMarkup += this.#dotsLeftMarkup;

    for (let i = this.totalPages - 1; i <= this.totalPages; i++) {
      this.#totalMarkup += this.#getPageBtnMarkupWithIdInsered(i);
    }
  }

  static #afterRendering() {
    this.#activateCurrentPageBtn();
    this.#correctPaginationBarSize();
  }

  static #activateCurrentPageBtn() {
    const activePageItem = document.getElementById(
      `pagination-number-${this.currentPage}`
    );
    const activePageBtn = activePageItem.firstElementChild;
    activePageBtn.classList.add('pagination__btn--active');
  }

  static #correctPaginationBarSize() {
    // For better experience, we lock the size of the bar if we have a lot of pages. So it is comfortable to switch between the pages by pressing the arrows buttons.
    if (this.totalPages >= 10) {
      this.paginationPagesList.classList.add('pagination__list--width-L');
    } else {
      this.paginationPagesList.classList.remove('pagination__list--width-L');
    }
  }

  static #getPageBtnMarkupWithIdInsered(id) {
    return `<li class="pagination__item" id="pagination-number-${id}"><button class="pagination__btn">${id}</button></li>`;
  }

  static #getLastPageMarkup() {
    return `<li class="pagination__item" id="pagination-number-${this.totalPages}"><button class="pagination__btn">${this.totalPages}</button></li>`;
  }
}

export { PaginationAPI };
