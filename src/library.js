import './js/components/teamModalWindow.js';

import { GalleryAPI } from './js/components/GalleryAPI';
import { TMDBAPI } from './js/libs/TMDBAPI';
import { LDStorageAPI } from './js/utils/LibraryDataStorageAPI';
const GENRES_DATA_LS_KEY = 'genres-data';
import {
  renderPagination,
  paginationNextBtn,
  paginationPreviousBtn,
  paginationPagesList,
  pagination,
  onWindowResize,
} from './js/components/pagination';

let galleryAPI = null;

// MAIN
(async () => {
  try {
    LDStorageAPI.init();
    moviesData = LDStorageAPI.getMovies();

    pagination.totalPages = LDStorageAPI.getTotalPages();

    const tmdbAPI = new TMDBAPI();
    const pathToPosterImg = (await tmdbAPI.getConfiguration()).images
      .secure_base_url;
    const genresAndIDs = readFromLocalStorage(GENRES_DATA_LS_KEY);

    galleryAPI = new GalleryAPI(
      '#movies-wrapper',
      pathToPosterImg,
      genresAndIDs
    );

    //render movies
    // galleryAPI.renderMoviesCards(moviesData);
  } catch (error) {
    console.log(error);
  }
})();

function readFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);

    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}
