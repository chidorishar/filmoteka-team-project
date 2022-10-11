import './js/components/teamModalWindow.js';
import { GalleryAPI } from './js/components/GalleryAPI';
import { TMDBAPI } from './js/libs/TMDBAPI';
import { LDStorageAPI } from './js/utils/LibraryDataStorageAPI';
import { readFromLocalStorage } from './js/utils/WebStorageMethods';
const GENRES_DATA_LS_KEY = 'genres-data';
const MOVIE_INFO = {
  WATCHED: 'watched',
  QUEUED: 'queued',
};
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
    // All Storage API methods
    LDStorageAPI.init();
    LDStorageAPI.setActiveStorage('watched');
    LDStorageAPI.getTotalPages();
    LDStorageAPI.getMovies();
    LDStorageAPI.getMoviesByPage(2);

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
