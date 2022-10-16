import { GalleryAPI } from './components/GalleryAPI';
import { PaginationAPI } from './components/PaginationAPI';
import { NotificationAPI } from './components/NotificationAPI';
import { LDStorageAPI } from './utils/LibraryDataStorageAPI';
import { TMDBAPI } from './libs/TMDBAPI';
import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { MovieModalHandler } from './components/MovieModalHandler';

// const MOVIE_INFO = {
//   WATCHED: 'watched',
//   QUEUED: 'queued',
//   SEARCHED: 'searched',
// };
let activeLibMode = null;
let galleryAPI = null;
let moviesData = null;
let libraryMoviesSearchForm = null;
let noFoundWarningMessage = null;
let librarySearchFieldInput = null;
let isSearchActive = false;

// MAIN
(async () => {
  try {
    LDStorageAPI.init(true);
    NotificationAPI.init('body', 178);
    await BackendConfigStorage.init();

    LDStorageAPI.updateActiveStorage(LDStorageAPI.MOVIE_INFO.WATCHED);
    activeLibMode = LDStorageAPI.MOVIE_INFO.WATCHED;

    moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
    PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

    const tmdbAPI = new TMDBAPI();
    galleryAPI = new GalleryAPI(
      '#movies-wrapper',
      BackendConfigStorage.pathToPoster,
      BackendConfigStorage.genresAndIDs
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

    //DOM things
    noFoundWarningMessage = document.getElementById('library-no-movies');
    librarySearchFieldInput = document.getElementById('library-search-input');
    // Added event listeners
    PaginationAPI.paginationWrapperDiv.addEventListener(
      'click',
      onPaginationWrapperBtnClick
    );
    const libButtonsWrapper = document.querySelector(
      '.header-library__buttons'
    );
    libButtonsWrapper.addEventListener('click', onLibraryBtnsClick);
    libraryMoviesSearchForm = document.getElementById(
      'library-movies-search-form'
    );
    libraryMoviesSearchForm.addEventListener('submit', searchMovies);

    const resizeObserver = new ResizeObserver(PaginationAPI.onWindowResize);
    resizeObserver.observe(document.body);

    //show placeholder if there are no movies
    if (PaginationAPI.totalPages) {
      NotificationAPI.addNotification(
        'Showing your watched movies',
        false,
        3000
      );
      enableSearch();
    } else disableSearch();
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

function onPaginationWrapperBtnClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;

  const clickedButtonEl = e.target;
  const buttonId = clickedButtonEl.id;

  switch (buttonId) {
    case 'pagination-button-next':
      PaginationAPI.changePageByOne(true);
      break;
    case 'pagination-button-previous':
      PaginationAPI.changePageByOne(false);
      break;
    case 'pagination-number-btn':
      const desiredPageNumber = parseInt(clickedButtonEl.textContent);
      if (desiredPageNumber === PaginationAPI.currentPage) return;
      PaginationAPI.updateCurrentPage(desiredPageNumber);
      break;
    default:
      return;
  }

  renderGalleryByPage();
  PaginationAPI.renderPagination();
}

function renderGalleryByPage() {
  moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
  //if there isn't movies on current page - decrease page, and try again
  if (!moviesData.length) {
    PaginationAPI.changePageByOne(false);

    //there isn't movies at all
    if (PaginationAPI.currentPage < 1) {
      //currently we navigate through search's results, so switch to watched/queued movies and try to show movies again
      if (isSearchActive) {
        isSearchActive = false;
        PaginationAPI.currentPage = 1;
        LDStorageAPI.updateActiveStorage(activeLibMode);
        librarySearchFieldInput.value = '';
        renderGalleryByPage();

        return;
      }

      librarySearchFieldInput.value = '';
      PaginationAPI.updateCurrentPage(1);
      // galleryAPI.renderMoviesCards(moviesData);
      PaginationAPI.totalPages = 0;

      disableSearch();
      galleryAPI.renderMoviesCards(moviesData);
      return;
    }

    renderGalleryByPage();
  }

  if (!noFoundWarningMessage.hasAttribute('style')) {
    enableSearch();
  }
  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

  galleryAPI.renderMoviesCards(moviesData);
  return;
}

function onLibraryBtnsClick(e) {
  const clickedEl = e.target;
  if (clickedEl.nodeName !== 'BUTTON') return;

  // resetting search field input if there is anything written in there
  librarySearchFieldInput.value = '';
  LDStorageAPI.lastSearchRequest = null;
  isSearchActive = false;

  const clickedLibMode =
    clickedEl.id === 'library-watched'
      ? LDStorageAPI.MOVIE_INFO.WATCHED
      : LDStorageAPI.MOVIE_INFO.QUEUED;
  if (clickedLibMode === activeLibMode) return;

  const prevButtonEl = e.currentTarget.querySelector(
    `button:not(#${clickedEl.id})`
  );
  prevButtonEl.classList.remove('btn-active');
  clickedEl.classList.add('btn-active');

  activeLibMode = clickedLibMode;
  PaginationAPI.currentPage = 1;
  LDStorageAPI.updateActiveStorage(activeLibMode);

  moviesData = LDStorageAPI.getMoviesByPage(PaginationAPI.currentPage);
  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();

  if (PaginationAPI.totalPages) {
    NotificationAPI.addNotification(
      `Showing your ${activeLibMode} movies`,
      false,
      3000
    );
    enableSearch();
  } else disableSearch();

  galleryAPI.renderMoviesCards(moviesData);
  PaginationAPI.renderPagination();
}

function searchMovies(e) {
  e.preventDefault();
  const moviesSearchRequest = e.currentTarget.elements.query.value;

  if (moviesSearchRequest === LDStorageAPI.lastSearchRequest && isSearchActive)
    return;

  //abort search status and render movies from current lib page
  if (moviesSearchRequest === '') {
    //current mode isn't searching - do nothing
    if (!isSearchActive) return;

    LDStorageAPI.lastSearchRequest = '';
    isSearchActive = false;

    LDStorageAPI.updateActiveStorage(activeLibMode);
    PaginationAPI.totalPages = LDStorageAPI.getTotalPages();
    PaginationAPI.updateCurrentPage(1);

    renderGalleryByPage();
    PaginationAPI.renderPagination();
    return;
  }

  const foundedMovies = LDStorageAPI.searchMoviesByName(
    moviesSearchRequest,
    activeLibMode
  );

  if (!foundedMovies.length) {
    NotificationAPI.addNotification(
      `Oops, there are no results matching your search request...`,
      true,
      3000
    );
    return;
  }

  isSearchActive = true;
  moviesData = foundedMovies;
  NotificationAPI.addNotification(
    `Here are the movies matching '${moviesSearchRequest}' request`,
    false,
    3000
  );

  LDStorageAPI.updateActiveStorage(LDStorageAPI.MOVIE_INFO.SEARCHED);

  PaginationAPI.totalPages = LDStorageAPI.getTotalPages();
  PaginationAPI.updateCurrentPage(1);

  galleryAPI.renderMoviesCards(moviesData);
  PaginationAPI.renderPagination();
}

function onMovieStatusChanged(action) {
  let needRerender = false;
  if (
    (action === MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_WATCHED ||
      action === MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_WATCHED) &&
    activeLibMode === LDStorageAPI.MOVIE_INFO.WATCHED
  ) {
    // LDStorageAPI.setActiveStorage(MOVIE_INFO.WATCHED);
    needRerender = true;
  }
  if (
    (action === MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_QUEUED ||
      action === MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_QUEUED) &&
    activeLibMode === LDStorageAPI.MOVIE_INFO.QUEUED
  ) {
    // LDStorageAPI.setActiveStorage(MOVIE_INFO.QUEUED);
    needRerender = true;
  }

  if (
    (action === MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_QUEUED ||
      action === MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_QUEUED ||
      action === MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_WATCHED ||
      action === MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_WATCHED) &&
    isSearchActive
  ) {
    LDStorageAPI.searchMoviesByName(
      LDStorageAPI.lastSearchRequest,
      activeLibMode
    );
    // LDStorageAPI.setActiveStorage(MOVIE_INFO.SEARCHED);
    needRerender = true;
  }

  if (needRerender) {
    renderGalleryByPage();
    PaginationAPI.renderPagination();
  }
}

function enableSearch() {
  noFoundWarningMessage.setAttribute('style', 'display: none;');
  librarySearchFieldInput.removeAttribute('disabled');
}

function disableSearch() {
  noFoundWarningMessage.removeAttribute('style');
  librarySearchFieldInput.setAttribute('disabled', 'true');
}
