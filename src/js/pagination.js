import { createPaginationMarkup } from './templates';

const paginationInfo = {
  activePage: 1,
  totalPages: 6,

  currentPagePlusOne() {
    if (this.currentPage <= this.totalPages - 1) {
      this.currentPage += 1;
      return;
    }
  },

  currentPageMinusOne() {
    if (this.currentPage !== 1) {
      this.currentPage -= 1;
      return;
    }
  },

  changeCurrentPage(newCurrentPageValue) {
    this.currentPage = newCurrentPageValue;
  },
};

const ref = {
  // Это убрать куда-то в общий файл с ref, потом заимпортировать.
  paginationList: document.getElementById('pagination-list'),
  paginationNextBtn: document.getElementById('pagination-next-page'),
  paginationPreviousBtn: document.getElementById('pagination-previous-page'),
  //   paginationPageNumberBtns: document.querySelectorAll(
  //     '#pagination-page-number'
  //   ),
};

const {
  paginationList,
  paginationNextBtn,
  paginationPreviousBtn,
  //   paginationPageNumberBtns,
} = ref;

renderPagination();
addListeners();
function addListeners() {
  paginationNextBtn.addEventListener('click', onPaginationNextBtnClick);
  paginationPreviousBtn.addEventListener('click', onPaginationPreviousBtnClick);
  paginationList.addEventListener('click', onPaginationListClick);
}

function onPaginationPreviousBtnClick() {
  paginationInfo.currentPageMinusOne();
}

function onPaginationNextBtnClick() {
  paginationInfo.currentPagePlusOne();
}

function onPaginationListClick(e) {
  if (e.target.id !== 'pagination-page-number') {
    return;
  }

  onPaginationPageBtnClick(e.target.textContent);
}

function onPaginationPageBtnClick(pageNumber) {
  pageNumber = parseInt(pageNumber);
  paginationInfo.changeCurrentPage(pageNumber);
}

// function updateActiveBtnStyling() {
//   const currentActiveBtn = paginationList.querySelector(
//     '.pagination__btn--active'
//   );
//   const newActiveBtn = paginationList.querySelector(
//     `#pagination-page-${String(paginationInfo.currentPage)}`
//   );

//   currentActiveBtn.classList.remove('pagination__btn--active');
//   newActiveBtn.classList.add('pagination__btn--active');
// }

function renderPagination() {
  const { activePage, totalPages } = paginationInfo;

  if (totalPages <= 6) {
    const paginationMarkup = createPaginationMarkup(activePage, totalPages);
    paginationList.innerHTML = paginationMarkup;

    return;
  }
}

function btnDisabler(btn) {
  btn.disabled = true;
}

function btnUndisabler(btn) {
  btn.disabled = false;
}
