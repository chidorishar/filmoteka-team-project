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
    //hide spinner if there aren't movies else add listener for images loading
    moviesData?.length
      ? galleryAPI.addOnCriticalImagesLoadedCallback(
          onGalleryLoadedCriticalImages
        )
      : (document.querySelector('.loader--critical').style.display = 'none');
    galleryAPI.renderMoviesCards(moviesData);
    PaginationAPI.renderPagination();
    const mmh = new MovieModalHandler(
      galleryAPI,
      MovieModalHandler.MODE.LIBRARY_WATCHED,
      onMovieStatusChanged
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
  //if there isn't movies on current page - decrease page, and try again
  if (!moviesData.length) {
    PaginationAPI.changePageByOne(false);
    if (PaginationAPI.currentPage < 1) {
      PaginationAPI.updateCurrentPage(1);
      galleryAPI.renderMoviesCards(moviesData);
      PaginationAPI.totalPages = 0;
      return;
    }
    renderGalleryByPage();
  }
  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

  galleryAPI.renderMoviesCards(moviesData);
  return;
}

function onLibraryBtnsClick(e) {
  const clickedEl = e.target;
  if (clickedEl.nodeName !== 'BUTTON') return;

  const clickedLibMode =
    clickedEl.id === 'library-watched' ? MOVIE_INFO.WATCHED : MOVIE_INFO.QUEUED;
  if (clickedLibMode === activeLibMode) return;

  const prevButtonEl = e.currentTarget.querySelector(
    `button:not(#${clickedEl.id})`
  );
  prevButtonEl.classList.remove('btn-active');
  clickedEl.classList.add('btn-active');
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

function onMovieStatusChanged(action) {
  let needRerender = false;
  if (
    (action === MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_WATCHED ||
      action === MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_WATCHED) &&
    activeLibMode === MOVIE_INFO.WATCHED
  )
    needRerender = true;
  if (
    (action === MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_QUEUED ||
      action === MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_QUEUED) &&
    activeLibMode === MOVIE_INFO.QUEUED
  )
    needRerender = true;

  if (needRerender) {
    renderGalleryByPage();
    PaginationAPI.renderPagination();
  }
}
