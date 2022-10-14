import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';
import { LDStorageAPI } from './utils/LibraryDataStorageAPI';
import { PaginationAPI } from './components/PaginationAPI';
import { NotificationAPI } from './components/NotificationAPI';

import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { MovieModalHandler } from './components/MovieModalHandler';

const MODE = { TOP: 'top', NAME: 'name' };
let currentMode = MODE.TOP;

let resizeObserver = null;
let moviesData = null;
let tmdbAPI = null;
export let galleryAPI = null;

let unsuccessfulSearchEl = null;

// MAIN
(async () => {
  try {
    tmdbAPI = new TMDBAPI();
    LDStorageAPI.init();
    NotificationAPI.init('body');
    await BackendConfigStorage.init();

    const { results: moviesData, total_pages: totalPages } =
      await tmdbAPI.getTopMovies();
    PaginationAPI.totalPages = totalPages;

    //movie search form
    unsuccessfulSearchEl = document.querySelector('#no-movies-found-message');
    const searchFormEl = document.querySelector('#movie-search-form');
    searchFormEl.addEventListener('submit', onMoviesSearchSubmit);
    //get array of IDs and genres
    galleryAPI = new GalleryAPI('#movies-wrapper');

    //init pagination variables
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

    resizeObserver = new ResizeObserver(PaginationAPI.onWindowResize);
    resizeObserver.observe(document.body);

    galleryAPI.addOnCriticalImagesLoadedCallback(onGalleryLoadedCriticalImages);

    //render movies and pagination as well
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

    // Added size listener for body element
    resizeObserver = new ResizeObserver(PaginationAPI.onWindowResize);
    resizeObserver.observe(document.body);
    NotificationAPI.addNotification(
      "Showing week's top movies...",
      false,
      3000
    );
  } catch (error) {
    console.log(error);
    document.querySelector('.loader').style.display = 'none';
    NotificationAPI.addNotification(
      'Something went wrong! Here is the log: ' + error.message,
      true
    );
  }
})();

function onGalleryLoadedCriticalImages() {
  document.querySelector('.loader').style.display = 'none';
}

async function onMoviesSearchSubmit(ev) {
  ev.preventDefault();

  const searchingMovieName = ev.currentTarget.elements.query.value;
  const lastSearchedName = tmdbAPI.lastSearchedName;

  if (searchingMovieName === lastSearchedName) return;

  try {
    if (!unsuccessfulSearchEl.hasAttribute('style')) {
      unsuccessfulSearchEl.setAttribute('style', 'display: none');
    }

    //user's input is empty string and user's last search was successful, then we show week's top movies
    if (!searchingMovieName) {
      const { results: moviesData, total_pages: totalPages } =
        await tmdbAPI.getTopMovies();

      PaginationAPI.totalPages = totalPages;
      PaginationAPI.currentPage = 1;
      currentMode = MODE.TOP;

      NotificationAPI.addNotification(
        "Showing week's top movies...",
        false,
        3000
      );
      galleryAPI.renderMoviesCards(moviesData);
      PaginationAPI.renderPagination();
      return;
    }

    currentMode = MODE.NAME;

    const {
      results: moviesData,
      total_pages: totalPages,
      total_results: totalResults,
    } = await tmdbAPI.getMoviesByName(searchingMovieName);

    PaginationAPI.totalPages = totalPages;
    PaginationAPI.currentPage = 1;

    if (!moviesData.length) {
      unsuccessfulSearchEl.removeAttribute('style');
      return;
    }

    NotificationAPI.addNotification(
      `We found ${totalResults} movies from your query`,
      false,
      3000
    );

    galleryAPI.renderMoviesCards(moviesData);
    PaginationAPI.renderPagination();
  } catch (error) {
    NotificationAPI.addNotification(
      'Something went wrong! Here is the log: ' + error.message,
      true
    );
  }
}

async function renderGalleryByPage() {
  if (currentMode === MODE.NAME) {
    try {
      moviesData = (
        await tmdbAPI.getMoviesByNameFromPage(PaginationAPI.currentPage)
      ).results;

      galleryAPI.renderMoviesCards(moviesData);
    } catch (error) {
      NotificationAPI.addNotification(
        'Something went wrong! Here is the log: ' + error.message,
        true
      );
    }
    return;
  }
  try {
    moviesData = (await tmdbAPI.getTopMoviesFromPage(PaginationAPI.currentPage))
      .results;

    galleryAPI.renderMoviesCards(moviesData);
  } catch (error) {
    NotificationAPI.addNotification(
      'Something went wrong! Here is the log: ' + error.message,
      true
    );
  }
}

async function onPaginationBtnChangeClick(e) {
  if (e.currentTarget.id === 'pagination-button-next') {
    PaginationAPI.changePageByOne(true);
  } else {
    PaginationAPI.changePageByOne(false);
  }

  await renderGalleryByPage();

  PaginationAPI.renderPagination();
}

async function onPaginationListBtnNumberClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  if (parseInt(e.target.textContent) === PaginationAPI.currentPage) return;

  PaginationAPI.updateCurrentPage(parseInt(e.target.textContent));

  await renderGalleryByPage();

  PaginationAPI.renderPagination();
}
