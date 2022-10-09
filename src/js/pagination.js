const paginationPages = document.getElementById('pagination-pages');
const nextBtn = document.getElementById('pagination-button-next');
const previousBtn = document.getElementById('pagination-button-previous');

const pagination = {
  currentPage: 1,
  totalPages: 7,

  currentPageIncreaseByOne() {
    if (this.currentPage === this.totalPages) {
      return;
    }

    this.currentPage += 1;
  },

  currentPageReduceByOne() {
    if (this.currentPage === 1) {
      return;
    }

    this.currentPage -= 1;
  },
};

function renderPaginationMarkup() {
  let totalMarkup = '';

  if (pagination.currentPage === pagination.totalPages) {
    nextBtn.disabled = true;
    previousBtn.disabled = false;
  } else {
    previousBtn.disabled = false;
  }

  if (pagination.currentPage === 1) {
    previousBtn.disabled = true;
    nextBtn.disabled = false;
  } else if (pagination.currentPage !== pagination.totalPages) {
    nextBtn.disabled = false;
  }

  totalMarkup += `
        <li class="pagination__item pagination__item--margin-right" id="pagination-number-1"><button class="pagination__btn">1</button></li>
        <li class="pagination__item pagination__item--margin-right" id="pagination-dots-left">&#183;&#183;&#183;</li>
    `;

  for (let i = 2; i <= pagination.totalPages - 1; i++) {
    totalMarkup += `
        <li class="pagination__item pagination__item--margin-right" id="pagination-number-${i}"><button class="pagination__btn">${i}</button></li>
        `;
  }

  if (pagination.totalPages !== 1) {
    totalMarkup += `
      <li class="pagination__item pagination__item--margin-right" id="pagination-dots-right">&#183;&#183;&#183;</li>
      <li class="pagination__item pagination__item--margin-right" id="pagination-number-${pagination.totalPages}"><button class="pagination__btn">${pagination.totalPages}</button></li>
  `;
  } else {
    totalMarkup += `
        <li class="pagination__item pagination__item--margin-right" id="pagination-dots-right">&#183;&#183;&#183;</li>      
      `;
    nextBtn.classList.add('pagination__btn--hidden');
    previousBtn.classList.add('pagination__btn--hidden');
  }

  paginationPages.innerHTML = totalMarkup;
}

function renderPagination() {
  renderPaginationMarkup();

  correctPaginationMarkup();
}

renderPagination();

function correctPaginationMarkup() {
  const dotsLeft = document.getElementById('pagination-dots-left');
  const dotsRight = document.getElementById('pagination-dots-right');

  for (let i = 1; i <= pagination.totalPages; i++) {
    if (i === pagination.currentPage) {
      const activePageItem = document.getElementById(`pagination-number-${i}`);
      const activePageBtn = activePageItem.firstElementChild;
      activePageBtn.classList.add('pagination__btn--active');
      break;
    }
  }

  if (pagination.totalPages <= 7) {
    dotsLeft.classList.add('pagination__item--hidden');
    dotsRight.classList.add('pagination__item--hidden');
    return;
  }

  if (pagination.currentPage <= 5) {
    dotsLeft.classList.add('pagination__item--hidden');
    for (let i = 6; i <= pagination.totalPages - 1; i++) {
      const pagItem = document.getElementById(`pagination-number-${i}`);
      pagItem.classList.add('pagination__item--hidden');
    }

    return;
  }

  if (pagination.totalPages - pagination.currentPage <= 4) {
    dotsRight.classList.add('pagination__item--hidden');
    for (let i = 2; i <= pagination.totalPages - 5; i++) {
      const pagItem = document.getElementById(`pagination-number-${i}`);
      pagItem.classList.add('pagination__item--hidden');
    }

    return;
  }

  if (
    pagination.currentPage >= 6 &&
    pagination.currentPage <= pagination.totalPages - 5
  ) {
    paginationPages.classList.add('pagination__list--width-L');

    for (let i = 2; i <= pagination.totalPages - 1; i++) {
      if (i === pagination.currentPage - 2) {
        i = pagination.currentPage + 2;
        continue;
      }

      const pagItem = document.getElementById(`pagination-number-${i}`);
      pagItem.classList.add('pagination__item--hidden');
    }
  }
}

nextBtn.addEventListener('click', onNextBtnClick);
previousBtn.addEventListener('click', onPreviousBtnClick);

function onNextBtnClick() {
  pagination.currentPageIncreaseByOne();
  renderPagination();
}

function onPreviousBtnClick() {
  pagination.currentPageReduceByOne();
  renderPagination();
}
