import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';
import { BackendConfigStorage } from './libs/BackendConfigStorage.js';
import { readFromLocalStorage } from './utils/WebStorageMethods';

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
      moviesData = (await tmdbAPI.getTopMovies()).results;

      galleryAPI.renderMoviesCards(moviesData);
      return;
    }

    moviesData = (await tmdbAPI.getMoviesByName(searchingMovieName)).results;

    if (moviesData.length === 0) {
      unsuccessfulSearchEl.removeAttribute('style');
      return;
    }

    galleryAPI.renderMoviesCards(moviesData);
  } catch (error) {
    console.log(error.message);
  }
}

// MAIN
(async () => {
  try {
    tmdbAPI = new TMDBAPI();
    await BackendConfigStorage.init();
    const genresDataFromLS = readFromLocalStorage(GENRES_DATA_LS_KEY);
    moviesData = (await tmdbAPI.getTopMovies()).results;
    //movie search form
    unsuccessfulSearchEl = document.querySelector('#no-movies-found-message');
    const searchFormEl = document.querySelector('#movie-search-form');
    searchFormEl.addEventListener('submit', onFormSubmit);
    //get array of IDs and genres
    galleryAPI = new GalleryAPI('#movies-wrapper');

    //render movies
    galleryAPI.renderMoviesCards(moviesData);

    //Строка ниже создана для проверки работы рендера карточек с локалСтореджа,так как метода для записи фильмов в ЛС еще не сделан
    console.log(moviesData)
    // localStorage.setItem('queue', JSON.stringify(moviesData));
    localStorage.setItem('watched', JSON.stringify(moviesData));


  } catch (error) {
    console.log(error.message);
  }
})();
