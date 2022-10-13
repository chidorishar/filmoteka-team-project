import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';

import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { LDStorageAPI } from './utils/LibraryDataStorageAPI';
import { MovieModalHandler } from './components/MovieModalHandler';
import { PaginationAPI } from './components/pagination';
import { readFromLocalStorage } from './utils/WebStorageMethods';

const GENRES_DATA_LS_KEY = 'genres-data';

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
    await BackendConfigStorage.init();
    const genresDataFromLS = readFromLocalStorage(GENRES_DATA_LS_KEY);

    const { results: moviesData, total_pages: totalPages } =
      await tmdbAPI.getTopMovies();
    PaginationAPI.totalPages = totalPages;

    //movie search form
    unsuccessfulSearchEl = document.querySelector('#no-movies-found-message');
    const searchFormEl = document.querySelector('#movie-search-form');
    searchFormEl.addEventListener('submit', onFormSubmit);
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
  } catch (error) {
    document.querySelector('.loader').style.display = 'none';
    console.log(error.message);
  }
})();

function onGalleryLoadedCriticalImages() {
  document.querySelector('.loader').style.display = 'none';
}

async function onFormSubmit(ev) {
  ev.preventDefault();

  const searchingMovieName = ev.currentTarget.elements.query.value;
  const lastSearchedName = tmdbAPI.lastSearchedName;

  if (searchingMovieName === lastSearchedName) return;

  try {
    if (!unsuccessfulSearchEl.hasAttribute('style')) {
      unsuccessfulSearchEl.setAttribute('style', 'display: none');
    }

    if (!searchingMovieName) {
      const { results: moviesData, total_pages: totalPages } =
        await tmdbAPI.getTopMovies();

      PaginationAPI.totalPages = totalPages;
      PaginationAPI.currentPage = 1;
      PaginationAPI.moviesName = null;

      galleryAPI.renderMoviesCards(moviesData);
      PaginationAPI.renderPagination();
      return;
    }

    const { results: moviesData, total_pages: totalPages } =
      await tmdbAPI.getMoviesByName(searchingMovieName);

    PaginationAPI.totalPages = totalPages;
    PaginationAPI.currentPage = 1;

    if (!moviesData.length) {
      unsuccessfulSearchEl.removeAttribute('style');
      return;
    }

    PaginationAPI.moviesName = searchingMovieName;

    galleryAPI.renderMoviesCards(moviesData);
    PaginationAPI.renderPagination();
  } catch (error) {
    console.log(error.message);
  }
}

async function renderGalleryByPage() {
  if (PaginationAPI.moviesName) {
    try {
      moviesData = (
        await tmdbAPI.getMoviesByNameFromPage(
          PaginationAPI.currentPage,
          PaginationAPI.moviesName
        )
      ).results;

      galleryAPI.renderMoviesCards(moviesData);
    } catch (error) {
      console.log(error.message);
    }
    return;
  }
  try {
    moviesData = (await tmdbAPI.getTopMoviesFromPage(PaginationAPI.currentPage))
      .results;

    galleryAPI.renderMoviesCards(moviesData);
  } catch (error) {
    console.log(error.message);
  }
}

async function onPaginationBtnChangeClick(e) {
  if (e.currentTarget.id === 'pagination-button-next') {
    PaginationAPI.currentPageIncreaseByOne();
  } else {
    PaginationAPI.currentPageReduceByOne();
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
