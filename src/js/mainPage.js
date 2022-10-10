import { GalleryAPI } from './galleryAPI';
import { TMDBAPI } from './theMovieAPI';

const GENRES_DATA_LS_KEY = 'genres-data';

let moviesData = null;
let tmdbAPI = null;
let galleryAPI = null;

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
    const pathToPosterImg = (await tmdbAPI.getConfiguration()).images
      .secure_base_url;
    const genresDataFromLS = readFromLocalStorage(GENRES_DATA_LS_KEY);
    moviesData = (await tmdbAPI.getTopMovies()).results;
    //movie search form
    unsuccessfulSearchEl = document.querySelector('#no-movies-found-message');
    const searchFormEl = document.querySelector('#movie-search-form');
    searchFormEl.addEventListener('submit', onFormSubmit);
    //get array of IDs and genres
    let genresAndIDs = null;
    if (!genresDataFromLS) {
      const genresDataFromBackend = (await tmdbAPI.getGenresData()).genres;

      genresAndIDs = genresDataFromBackend;
      localStorage.setItem(
        GENRES_DATA_LS_KEY,
        JSON.stringify(genresDataFromBackend)
      );
    } else {
      genresAndIDs = genresDataFromLS;
    }
    galleryAPI = new GalleryAPI(
      '#movies-wrapper',
      pathToPosterImg,
      genresAndIDs
    );

    //render movies
    galleryAPI.renderMoviesCards(moviesData);
  } catch (error) {
    console.log(error.message);
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
