import './components/teamModalWindow.js';
import { GalleryAPI } from './components/GalleryAPI';
import { LDStorageAPI } from './utils/LibraryDataStorageAPI';
import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { MovieModalHandler } from './components/MovieModalHandler';
import {
  renderPagination,
  paginationNextBtn,
  paginationPreviousBtn,
  paginationPagesList,
  pagination,
  onWindowResize,
} from './components/pagination';
let galleryAPI = null;
// const libraryWatchedBtn = document.getElementById('library-watched');
// const libraryQueueBtn = document.getElementById('library-queue');

// MAIN
(async () => {
  try {
    //init
    LDStorageAPI.init();
    await BackendConfigStorage.init();
    galleryAPI = new GalleryAPI('#movies-wrapper');
    const mmh = new MovieModalHandler(
      '#watched-btn',
      '#queue-btn',
      '#movies-modal-window',
      '.modal-close',
      '#movie-modal-buttons-wrapper',
      galleryAPI
    );

    pagination.totalPages = LDStorageAPI.getTotalPages();

    //render movies
    galleryAPI.renderMoviesCards(LDStorageAPI.getMoviesByPage(1));
    renderPagination();

    // Event listeners
    paginationNextBtn.addEventListener('click', onPaginationBtnChangeClick);
    paginationPreviousBtn.addEventListener('click', onPaginationBtnChangeClick);
    paginationPagesList.addEventListener(
      'click',
      onPaginationListBtnNumberClick
    );
    window.addEventListener('resize', onWindowResize);
    // libraryWatchedBtn.addEventListener('click', onLibraryMainBtnClick);
    // libraryQueueBtn.addEventListener('click', onLibraryMainBtnClick);
  } catch (error) {
    console.log(error);
  }
})();

function onPaginationBtnChangeClick(e) {
  if (e.currentTarget.id === 'pagination-button-next') {
    pagination.currentPageIncreaseByOne();
  } else {
    pagination.currentPageReduceByOne();
  }

  renderMovieGalleryByPagePagination();

  renderPagination();
}

function onPaginationListBtnNumberClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  if (parseInt(e.target.textContent) === pagination.currentPage) return;

  pagination.updateCurrentPage(parseInt(e.target.textContent));

  renderMovieGalleryByPagePagination();

  renderPagination();
}

function renderMovieGalleryByPagePagination() {
  // In case of removing movies from our Local Storage
  pagination.totalPages = LDStorageAPI.getTotalPages();

  galleryAPI.renderMoviesCards(
    LDStorageAPI.getMoviesByPage(pagination.currentPage)
  );
}

// function onLibraryMainBtnClick(e) {
//   if (e.target.id === 'library-watched') {
//     LDStorageAPI.setActiveStorage = LDStorageAPI.MOVIE_INFO.WATCHED;
//   } else {
//     LDStorageAPI.setActiveStorage = LDStorageAPI.MOVIE_INFO.QUEUED;
//   }
//   pagination.currentPage = 1;

//   renderMovieGalleryByPagePagination();
//   renderPagination();
// }
