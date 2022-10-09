import { GalleryAPI } from './galleryAPI';
import { TMDBAPI } from './theMovieAPI';

const GENRES_DATA_LS_KEY = 'genres-data';

let moviesData = null;
let tmdbAPI = null;
let galleryAPI = null;

const searchForm = document.querySelector('#movie-search-form');

searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(ev) {
  ev.preventDefault();

  const searchingMovieName = ev.currentTarget.elements.query.value;

  const lastSearchedName = tmdbAPI.lastSearchedName;

  if (searchingMovieName === lastSearchedName) return;

  try {
    if (searchingMovieName === '') {
      moviesData = (await tmdbAPI.getTopMovies()).results;

      galleryAPI.renderMoviesCards(moviesData);

      return;
    }

    moviesData = (await tmdbAPI.getMoviesByName(searchingMovieName)).results;

    if (moviesData.length === 0) return;

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
