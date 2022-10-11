import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';

import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { MovieModalHandler } from './components/MovieModalHandler';
import { readFromLocalStorage } from './utils/WebStorageMethods';
import {
  renderPagination,
  paginationNextBtn,
  paginationPreviousBtn,
  paginationPagesList,
  pagination,
  onWindowResize,
} from './components/pagination';

paginationNextBtn.addEventListener('click', onPaginationBtnChangeClick);
paginationPreviousBtn.addEventListener('click', onPaginationBtnChangeClick);
paginationPagesList.addEventListener('click', onPaginationListBtnNumberClick);
window.addEventListener('resize', onWindowResize);

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

    if (!searchingMovieName) {
      const { results: moviesData, total_pages: totalPages } =
        await tmdbAPI.getTopMovies();

      pagination.totalPages = totalPages;
      pagination.currentPage = 1;
      pagination.moviesName = null;

      galleryAPI.renderMoviesCards(moviesData);
      renderPagination();
      return;
    }

    const { results: moviesData, total_pages: totalPages } =
      await tmdbAPI.getMoviesByName(searchingMovieName);

    pagination.totalPages = totalPages;
    pagination.currentPage = 1;

    if (!moviesData.length) {
      unsuccessfulSearchEl.removeAttribute('style');
      return;
    }

    pagination.moviesName = searchingMovieName;

    galleryAPI.renderMoviesCards(moviesData);
    renderPagination();
  } catch (error) {
    console.log(error.message);
  }
}

async function renderGalleryByPage() {
  if (pagination.moviesName) {
    try {
      moviesData = (
        await tmdbAPI.getMoviesByNameFromPage(
          pagination.currentPage,
          pagination.moviesName
        )
      ).results;

      galleryAPI.renderMoviesCards(moviesData);
    } catch (error) {
      console.log(error.message);
    }
    return;
  }
  try {
    moviesData = (await tmdbAPI.getTopMoviesFromPage(pagination.currentPage))
      .results;

    galleryAPI.renderMoviesCards(moviesData);
  } catch (error) {
    console.log(error.message);
  }
}

async function onPaginationBtnChangeClick(e) {
  if (e.currentTarget.id === 'pagination-button-next') {
    pagination.currentPageIncreaseByOne();
  } else {
    pagination.currentPageReduceByOne();
  }

  await renderGalleryByPage();

  renderPagination();
}

async function onPaginationListBtnNumberClick(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  if (parseInt(e.target.textContent) === pagination.currentPage) return;

  pagination.updateCurrentPage(parseInt(e.target.textContent));

  await renderGalleryByPage();

  renderPagination();
}

// MAIN
(async () => {
  try {
    tmdbAPI = new TMDBAPI();
    await BackendConfigStorage.init();
    const genresDataFromLS = readFromLocalStorage(GENRES_DATA_LS_KEY);
    const { results: moviesData, total_pages: totalPages } =
      await tmdbAPI.getTopMovies();
    pagination.totalPages = totalPages;

    //movie search form
    unsuccessfulSearchEl = document.querySelector('#no-movies-found-message');
    const searchFormEl = document.querySelector('#movie-search-form');
    searchFormEl.addEventListener('submit', onFormSubmit);
    //get array of IDs and genres
    galleryAPI = new GalleryAPI('#movies-wrapper');

    //render movies and pagination as well
    galleryAPI.renderMoviesCards(moviesData);
    console.log(moviesData);
    renderPagination();
    const mmh = new MovieModalHandler(
      '#watched-btn',
      '#queue-btn',
      '#movies-modal-window',
      '.modal-close',
      '#movie-modal-buttons-wrapper',
      galleryAPI
    );
  } catch (error) {
    console.log(error.message);
  }
})();
