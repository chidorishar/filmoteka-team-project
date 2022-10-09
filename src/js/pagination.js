const paginationPagesList = document.getElementById('pagination-pages');
const paginationNextBtn = document.getElementById('pagination-button-next');
const paginationPreviousBtn = document.getElementById(
  'pagination-button-previous'
);

window.addEventListener('resize', onWindowResize);
paginationNextBtn.addEventListener('click', onNextBtnClick);
paginationPreviousBtn.addEventListener('click', onPreviousBtnClick);
paginationPagesList.addEventListener('click', onPaginationPagesListClick);

const pagination = {
  currentPage: 1,
  totalPages: 9,

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

  updateCurrentPage(newCurrentPage) {
    this.currentPage = newCurrentPage;
  },
};

renderPagination();

function onWindowResize() {
  if (window.matchMedia('(max-width: 767px)').matches) {
    renderPagination();
  } else {
    renderPagination();
  }
}

function onPaginationPagesListClick(e) {
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }

  if (parseInt(e.target.textContent) === pagination.currentPage) {
    return;
  }
  pagination.updateCurrentPage(parseInt(e.target.textContent));

  renderPagination();
}

function onNextBtnClick() {
  pagination.currentPageIncreaseByOne();
  renderPagination();
}

function onPreviousBtnClick() {
  pagination.currentPageReduceByOne();
  renderPagination();
}

function renderPagination() {
  renderPaginationMarkup();

  correctPaginationMarkup();
}

function renderPaginationMarkup() {
  let totalMarkup = '';

  if (pagination.currentPage === pagination.totalPages) {
    paginationNextBtn.disabled = true;
    paginationPreviousBtn.disabled = false;
  } else {
    paginationPreviousBtn.disabled = false;
  }

  if (pagination.currentPage === 1) {
    paginationPreviousBtn.disabled = true;
    paginationNextBtn.disabled = false;
  } else if (pagination.currentPage !== pagination.totalPages) {
    paginationNextBtn.disabled = false;
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
    paginationNextBtn.classList.add('pagination__btn--hidden');
    paginationPreviousBtn.classList.add('pagination__btn--hidden');
  }

  paginationPagesList.innerHTML = totalMarkup;
}

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
  } else {
    if (!window.matchMedia('(max-width: 767px)').matches) {
      paginationPagesList.classList.add('pagination__list--width-L');
    } else {
      paginationPagesList.classList.remove('pagination__list--width-L');
    }
  }

  if (pagination.currentPage <= 5) {
    if (window.matchMedia('(max-width: 767px)').matches) {
      dotsRight.classList.add('pagination__item--hidden');

      const lastPageItem = document.getElementById(
        `pagination-number-${pagination.totalPages}`
      );

      lastPageItem.classList.add('pagination__item--hidden');
    }
    dotsLeft.classList.add('pagination__item--hidden');
    for (let i = 6; i <= pagination.totalPages - 1; i++) {
      const pagItem = document.getElementById(`pagination-number-${i}`);
      pagItem.classList.add('pagination__item--hidden');
    }

    return;
  }

  if (pagination.totalPages - pagination.currentPage <= 4) {
    if (window.matchMedia('(max-width: 767px)').matches) {
      dotsLeft.classList.add('pagination__item--hidden');

      const firstPageItem = document.getElementById('pagination-number-1');
      firstPageItem.classList.add('pagination__item--hidden');
    }

    dotsRight.classList.add('pagination__item--hidden');
    for (let i = 2; i <= pagination.totalPages - 5; i++) {
      const pagItem = document.getElementById(`pagination-number-${i}`);
      pagItem.classList.add('pagination__item--hidden');
    }

    return;
  }

  if (
    pagination.currentPage >= 5 &&
    pagination.currentPage <= pagination.totalPages - 5
  ) {
    if (window.matchMedia('(max-width: 767px)').matches) {
      dotsLeft.classList.add('pagination__item--hidden');
      dotsRight.classList.add('pagination__item--hidden');

      for (
        let i = 1;
        i <= pagination.totalPages;
        i += pagination.totalPages - 1
      ) {
        const pagItem = document.getElementById(`pagination-number-${i}`);
        pagItem.classList.add('pagination__item--hidden');
      }
    }

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
