import './components/teamModalWindow.js';
import { GalleryAPI } from './components/GalleryAPI';
import { LDStorageAPI } from './utils/LibraryDataStorageAPI';
import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { MovieModalHandler } from './components/MovieModalHandler';
import {
  renderPagination,
  paginationNextBtn,
  paginationPreviousBtn,
  paginationPagesList,
  pagination,
  onWindowResize,
} from './components/pagination';
let galleryAPI = null;

// MAIN
(async () => {
  try {
    //init
    LDStorageAPI.init();
    await BackendConfigStorage.init();
    galleryAPI = new GalleryAPI('#movies-wrapper');
    const mmh = new MovieModalHandler(
      '#watched-btn',
      '#queue-btn',
      '#movies-modal-window',
      '.modal-close',
      '#movie-modal-buttons-wrapper',
      galleryAPI
    );

    LDStorageAPI.setActiveStorage(LDStorageAPI.MOVIE_INFO.WATCHED);
    // LDStorageAPI.getTotalPages();
    LDStorageAPI.getMoviesByPage(1);

    //render movies
    galleryAPI.renderMoviesCards(LDStorageAPI.getMoviesByPage(1));
  } catch (error) {
    console.log(error);
  }
})();
