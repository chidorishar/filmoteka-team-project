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
let activeMoviesType = null;
let moviesData = null;

const libraryWatchedBtn = document.getElementById('library-watched');
const libraryQueuedBtn = document.getElementById('library-queue');

// MAIN
(async () => {
  try {
    LDStorageAPI.init();
    NotificationAPI.init('body');
    await BackendConfigStorage.init();

    LDStorageAPI.setActiveStorage(MOVIE_INFO.WATCHED);
    activeMoviesType = MOVIE_INFO.WATCHED;

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
    libraryWatchedBtn.addEventListener('click', onLibraryWatchedBtnClick);
    libraryQueuedBtn.addEventListener('click', onLibraryQueueBtnClick);
    resizeObserver = new ResizeObserver(PaginationAPI.onWindowResize);
    resizeObserver.observe(document.body);

    NotificationAPI.addNotification('Showing your watched movies', false, 3000);

    // galleryAPI.addOnCriticalImagesLoadedCallback(onGalleryLoadedCriticalImages);
  } catch (error) {
    console.log(error.message);
  }
})();

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

function onLibraryWatchedBtnClick() {
  if (activeMoviesType === MOVIE_INFO.WATCHED) return;

  NotificationAPI.addNotification('Showing your watched movies', false, 3000);

  // setting data for switching between movie types
  PaginationAPI.currentPage = 1;
  activeMoviesType = MOVIE_INFO.WATCHED;
  LDStorageAPI.setActiveStorage(MOVIE_INFO.WATCHED);

  moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

  galleryAPI.renderMoviesCards(moviesData);
  PaginationAPI.renderPagination();
}

function onLibraryQueueBtnClick() {
  if (activeMoviesType === MOVIE_INFO.QUEUED) return;

  NotificationAPI.addNotification('Showing your movies queue', false, 3000);

  // setting data for switching between movie types
  PaginationAPI.currentPage = 1;
  activeMoviesType = MOVIE_INFO.QUEUED;
  LDStorageAPI.setActiveStorage(MOVIE_INFO.QUEUED);

  moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

  galleryAPI.renderMoviesCards(moviesData);
  PaginationAPI.renderPagination();
}
