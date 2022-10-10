import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';

import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { readFromLocalStorage } from './utils/WebStorageMethods';
import {
  renderPagination,
  paginationNextBtn,
  paginationPreviousBtn,
  paginationPagesList,
} from './pagination';
import { pagination } from './utils/paginationInfo';

paginationNextBtn.addEventListener('click', onPaginationBtnChangeClick);
paginationPreviousBtn.addEventListener('click', onPaginationBtnChangeClick);
paginationPagesList.addEventListener('click', onPaginationListBtnPageClick);

const GENRES_DATA_LS_KEY = 'genres-data';

let moviesData = null;
let tmdbAPI = null;
export let galleryAPI = null;

let unsuccessfulSearchEl = null;

async function onFormSubmit(ev) {
  ev.preventDefault();

  const searchingMovieName = ev.currentTarget.elements.query.value;
  const lastSearchedName = tmdbAPI.lastSearchedName;

  if (searchingMovieName === lastSearchedName) return;

  try {
    if (!unsuccessfulSearchEl.hasAttribute('style')) {
      unsuccessfulSearchEl.setAttribute('style', 'display: none');
    }

    if (searchingMovieName === '') {
      moviesData = await tmdbAPI.getTopMoviesFromPage(1);
      pagination.totalPages = moviesData.total_pages;
      pagination.currentPage = 1;

      await galleryAPI.renderMoviesCards(moviesData.results);
      renderPagination();
      return;
    }

    moviesData = await tmdbAPI.getMoviesByNameFromPage(1, searchingMovieName);
    pagination.totalPages = moviesData.total_pages;
    pagination.currentPage = 1;

    if (moviesData.length === 0) {
      unsuccessfulSearchEl.removeAttribute('style');
      return;
    }
    await galleryAPI.renderMoviesCards(moviesData.results);
    renderPagination();
  } catch (error) {
    console.log(error.message);
  }
}

function onPaginationBtnChangeClick(e) {
  if (e.currentTarget.id === 'pagination-button-next') {
    pagination.currentPageIncreaseByOne();
    renderPagination();
    return;
  }
  pagination.currentPageReduceByOne();

  renderPagination();
}

function onPaginationListBtnPageClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  if (parseInt(e.target.textContent) === pagination.currentPage) return;

  pagination.updateCurrentPage(parseInt(e.target.textContent));
  renderPagination();
}

// MAIN
(async () => {
  try {
    tmdbAPI = new TMDBAPI();
    await BackendConfigStorage.init();
    const genresDataFromLS = readFromLocalStorage(GENRES_DATA_LS_KEY);
    moviesData = await tmdbAPI.getTopMoviesFromPage(1);
    pagination.totalPages = moviesData.total_pages;
    //movie search form
    unsuccessfulSearchEl = document.querySelector('#no-movies-found-message');
    const searchFormEl = document.querySelector('#movie-search-form');
    searchFormEl.addEventListener('submit', onFormSubmit);
    //get array of IDs and genres
    galleryAPI = new GalleryAPI('#movies-wrapper');

    //render movies
    galleryAPI.renderMoviesCards(moviesData.results);
    renderPagination();
  } catch (error) {
    console.log(error.message);
  }
})();
