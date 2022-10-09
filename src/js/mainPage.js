import { GalleryAPI } from './galleryAPI';
import { TMDBAPI } from './theMovieAPI';

const GENRES_DATA_LS_KEY = 'genres-data';

let moviesData = null;
let tmdbAPI = null;

// for search
//! change
const searchInput = document.querySelector('.header_search');
//! change
const searchBtn = document.querySelector('.header_search-button');

//* on submit by button with empty input we'll get also top movies
searchBtn.addEventListener('click', loadMovies);

//loading top movies on first login
loadMovies();

// MAIN
async function loadMovies() {
  try {
    tmdbAPI = new TMDBAPI();
    const pathToPosterImg = (await tmdbAPI.getConfiguration()).images
      .secure_base_url;

    const genresDataFromLS = readFromLocalStorage(GENRES_DATA_LS_KEY);

    // detection if the input is empty or page was loaded for the first time (one out of the other)
    moviesData = !searchInput.value
      ? (await tmdbAPI.getTopMovies()).results
      : (await tmdbAPI.getMoviesByName(searchInput.value)).results;

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
    const galleryAPI = new GalleryAPI(
      '#movies-wrapper',
      pathToPosterImg,
      genresAndIDs
    );

    //render images
    galleryAPI.renderMoviesCards(moviesData);
  } catch (error) {
    console.log(error.message);
  }
}

function readFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);

    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}
