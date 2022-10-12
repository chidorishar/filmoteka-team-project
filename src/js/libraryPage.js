import './components/teamModalWindow.js';
import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';
import { LDStorageAPI } from './utils/LibraryDataStorageAPI';
import { readFromLocalStorage } from './utils/WebStorageMethods';
import {
  renderPagination,
  paginationNextBtn,
  paginationPreviousBtn,
  paginationPagesList,
  pagination,
  onWindowResize,
} from './components/pagination';

const GENRES_DATA_LS_KEY = 'genres-data';
const MOVIE_INFO = {
  WATCHED: 'watched',
  QUEUED: 'queued',
};

let galleryAPI = null;

// MAIN
(async () => {
  try {
    // All Storage API methods
    LDStorageAPI.init();
    LDStorageAPI.setActiveStorage(MOVIE_INFO.WATCHED);
    LDStorageAPI.getTotalPages();
    LDStorageAPI.getMoviesByPage(1);
    console.log(1);

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
