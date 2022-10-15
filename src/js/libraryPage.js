import { GalleryAPI } from './components/GalleryAPI';
import { PaginationAPI } from './components/PaginationAPI';
import { NotificationAPI } from './components/NotificationAPI';
import { LDStorageAPI } from './utils/LibraryDataStorageAPI';
import { TMDBAPI } from './libs/TMDBAPI';
import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { MovieModalHandler } from './components/MovieModalHandler';

import { readFromLocalStorage } from './utils/WebStorageMethods';

const GENRES_DATA_LS_KEY = 'genres-data';
const MOVIE_INFO = {
  WATCHED: 'watched',
  QUEUED: 'queued',
};
let galleryAPI = null;
let activeLibMode = null;
let moviesData = null;

// MAIN
(async () => {
  try {
    LDStorageAPI.init();
    NotificationAPI.init('body');
    await BackendConfigStorage.init();

    LDStorageAPI.setActiveStorage(MOVIE_INFO.WATCHED);
    activeLibMode = MOVIE_INFO.WATCHED;

    moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
    PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

    const tmdbAPI = new TMDBAPI();
    const pathToPosterImg = (await tmdbAPI.getConfiguration()).images
      .secure_base_url;

    const genresAndIDs = readFromLocalStorage(GENRES_DATA_LS_KEY);
    galleryAPI = new GalleryAPI(
      '#movies-wrapper',
      pathToPosterImg,
      genresAndIDs
    );

    galleryAPI.addOnCriticalImagesLoadedCallback(onGalleryLoadedCriticalImages);
    galleryAPI.renderMoviesCards(moviesData);
    PaginationAPI.renderPagination();
    const mmh = new MovieModalHandler(
      '#watched-btn',
      '#queue-btn',
      '#movies-modal-window',
      '.modal-close',
      '#movie-modal-buttons-wrapper',
      galleryAPI
    );

    // Added event listeners
    PaginationAPI.paginationNextBtn.addEventListener(
      'click',
      onPaginationBtnChangeClick
    );
    PaginationAPI.paginationPreviousBtn.addEventListener(
      'click',
      onPaginationBtnChangeClick
    );
    PaginationAPI.paginationPagesList.addEventListener(
      'click',
      onPaginationListBtnNumberClick
    );
    const libButtonsWrapper = document.querySelector(
      '.header-library__buttons'
    );
    libButtonsWrapper.addEventListener('click', onLibraryBtnsClick);
    const libraryMoviesSearchForm = document.getElementById(
      'library-movies-search-form'
    );
    libraryMoviesSearchForm.addEventListener(
      'click',
      onlibraryMoviesSearchFormSubmit
    );
    const resizeObserver = new ResizeObserver(PaginationAPI.onWindowResize);
    resizeObserver.observe(document.body);

    NotificationAPI.addNotification('Showing your watched movies', false, 3000);
  } catch (error) {
    console.log(error.message);
    document.querySelector('.loader--critical').style.display = 'none';
    NotificationAPI.addNotification(
      'Something went wrong! Here is the log: ' + error.message,
      true
    );
  }
})();

function onGalleryLoadedCriticalImages() {
  document.querySelector('.loader--critical').style.display = 'none';
  document.body.classList.remove('body-clip-overflow');
}

function onPaginationListBtnNumberClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  if (parseInt(e.target.textContent) === PaginationAPI.currentPage) return;

  PaginationAPI.updateCurrentPage(parseInt(e.target.textContent));

  try {
    renderGalleryByPage();
  } catch (error) {
    NotificationAPI.addNotification(
      'Something went wrong! Here is the log: ' + error.message,
      true
    );
    console.log(error.message);
  }
  PaginationAPI.renderPagination();
}

function onPaginationBtnChangeClick(e) {
  if (e.currentTarget.id === 'pagination-button-next') {
    PaginationAPI.changePageByOne(true);
  } else {
    PaginationAPI.changePageByOne(false);
  }

  renderGalleryByPage();

  PaginationAPI.renderPagination();
}

function renderGalleryByPage() {
  moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

  galleryAPI.renderMoviesCards(moviesData);
  return;
}

function onLibraryBtnsClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;

  const clickedLibMode =
    e.target.id === 'library-watched' ? MOVIE_INFO.WATCHED : MOVIE_INFO.QUEUED;
  if (clickedLibMode === activeLibMode) return;

  activeLibMode = clickedLibMode;
  PaginationAPI.currentPage = 1;

  switch (activeLibMode) {
    case MOVIE_INFO.WATCHED:
      NotificationAPI.addNotification(
        'Showing your watched movies',
        false,
        3000
      );
      LDStorageAPI.setActiveStorage(MOVIE_INFO.WATCHED);
      break;
    case MOVIE_INFO.QUEUED:
      NotificationAPI.addNotification('Showing your movies queue', false, 3000);
      LDStorageAPI.setActiveStorage(MOVIE_INFO.QUEUED);
      break;
  }

  moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

  galleryAPI.renderMoviesCards(moviesData);
  PaginationAPI.renderPagination();
}

function onlibraryMoviesSearchFormSubmit(e) {
  e.preventDefault();

  const moviesSearchRequest = e.currentTarget.elements.query.value;

  if (moviesSearchRequest === '') return;

  moviesData = LDStorageAPI.searchInActiveStorageMovies(moviesSearchRequest);
  galleryAPI.renderMoviesCards(moviesData);
}
