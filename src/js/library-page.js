// import './js/***.js';

import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';
import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
const GENRES_DATA_LS_KEY = 'genres-data';

let galleryAPI = null;

refs = {
  btnWatched: document.querySelector('#watched'),
  btnQueue: document.querySelector('#queue'),
};

refs.btnWatched.addEventListener('click', onclickBtnWatched);
refs.btnQueue.addEventListener('click', onclickBtnQueue);

function onclickBtnWatched(e) {
  // MAIN
  (async () => {
    try {
      tmdbAPI = new TMDBAPI();
      await BackendConfigStorage.init();

      galleryAPI = new GalleryAPI('#movies-wrapper');

      let stringFromLocalStorage = localStorage.getItem('watched');
      let filmsFromLocalStorage = JSON.parse(stringFromLocalStorage);

      galleryAPI.renderMoviesCards(filmsFromLocalStorage);
    } catch (error) {
      console.log(error.message);
    }
  })();
}

function onclickBtnQueue(e) {
  // MAIN
  (async () => {
    try {
      tmdbAPI = new TMDBAPI();
      await BackendConfigStorage.init();

      galleryAPI = new GalleryAPI('#movies-wrapper');

      let stringFromLocalStorage = localStorage.getItem('queue');
      let filmsFromLocalStorage = JSON.parse(stringFromLocalStorage);

      galleryAPI.renderMoviesCards(filmsFromLocalStorage);
    } catch (error) {
      console.log(error.message);
    }
  })();
}

function readFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);

    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}
