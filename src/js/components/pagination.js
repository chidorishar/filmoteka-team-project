const pagination = {
  currentPage: 1,
  totalPages: null,
  moviesName: null,

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

const paginationPagesList = document.getElementById('pagination-pages');
const paginationNextBtn = document.getElementById('pagination-button-next');
const paginationPreviousBtn = document.getElementById(
  'pagination-button-previous'
);

// window.addEventListener('resize', onWindowResize);

function renderPagination() {
  renderPaginationMarkup();
  correctPaginationMarkup();
}

// if we change screen size on our mobile phone, then we just rerender our pagination list.
function onWindowResize() {
  if (window.matchMedia('(max-width: 767px)').matches) {
    renderPagination();
  } else {
    renderPagination();
  }
}

function renderPaginationMarkup() {
  let totalMarkup = '';

  if (pagination.totalPages === 0) {
    paginationNextBtn.classList.add('pagination__btn--hidden');
    paginationPreviousBtn.classList.add('pagination__btn--hidden');
    return;
  } else {
    paginationNextBtn.classList.remove('pagination__btn--hidden');
    paginationPreviousBtn.classList.remove('pagination__btn--hidden');
  }

  // Buttons disabling and enabling
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

  if (pagination.totalPages === 0) {
    return;
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

  // For single-paged markup and for more than one paged
  if (pagination.totalPages !== 1) {
    totalMarkup += `
      <li class="pagination__item pagination__item--margin-right" id="pagination-dots-right">&#183;&#183;&#183;</li>
      <li class="pagination__item pagination__item--margin-right" id="pagination-number-${pagination.totalPages}"><button class="pagination__btn">${pagination.totalPages}</button></li>
  `;
    paginationNextBtn.classList.remove('pagination__btn--hidden');
    paginationPreviousBtn.classList.remove('pagination__btn--hidden');
  } else {
    totalMarkup += `
        <li class="pagination__item pagination__item--margin-right" id="pagination-dots-right">&#183;&#183;&#183;</li>      
      `;
    paginationNextBtn.classList.add('pagination__btn--hidden');
    paginationPreviousBtn.classList.add('pagination__btn--hidden');
  }

  // creating markup
  paginationPagesList.innerHTML = totalMarkup;
}

function correctPaginationMarkup() {
  if (pagination.totalPages === 0) {
    paginationPagesList.setAttribute('style', 'display: none');
    return;
  } else {
    paginationPagesList.removeAttribute('style');
  }

  const dotsLeft = document.getElementById('pagination-dots-left');
  const dotsRight = document.getElementById('pagination-dots-right');

  // Adding background for our currentPage
  for (let i = 1; i <= pagination.totalPages; i++) {
    if (i === pagination.currentPage) {
      const activePageItem = document.getElementById(`pagination-number-${i}`);
      const activePageBtn = activePageItem.firstElementChild;
      activePageBtn.classList.add('pagination__btn--active');
      break;
    }
  }

  // If we don't have many pages, hide all the dots (on the left and on the right)
  if (pagination.totalPages <= 7) {
    dotsLeft.classList.add('pagination__item--hidden');
    dotsRight.classList.add('pagination__item--hidden');
    return;
  } else {
    // for mobiles we disable fixed width which was created to comfort nextPage clicking
    if (window.matchMedia('(max-width: 767px)').matches) {
      paginationPagesList.classList.remove('pagination__list--width-L');
    } else {
      paginationPagesList.classList.add('pagination__list--width-L');
    }
  }

  // If our active page is from 1 to 5, we hide all other buttons
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

  // if our active page is close to the end, then we hide all buttons except for those which are close.
  if (pagination.totalPages - pagination.currentPage <= 4) {
    // for mobiles we hide dots from both sides as well
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
  // if we are in the middle. Nor the beginning, nor the end, then we hide all the buttons except for active and near active ones.
  if (
    pagination.currentPage >= 5 &&
    pagination.currentPage <= pagination.totalPages - 5
  ) {
    // if we are using a mobile phone, then hide all dots and first-last pages. Leave just the active page and +-2 next to it.
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

export {
  renderPagination,
  paginationNextBtn,
  paginationPreviousBtn,
  paginationPagesList,
  pagination,
  onWindowResize,
};
