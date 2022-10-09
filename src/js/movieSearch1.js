import { GalleryAPI } from './galleryAPI';
import { TMDBAPI } from './theMovieAPI';

const GENRES_DATA_LS_KEY = 'genres-data';

//! change
const searchInput = document.querySelector('.header_search');
//! change
const searchBtn = document.querySelector('.header_search-button');

let moviesData = null;
let tmdbAPI = null;

// MAIN
searchBtn.addEventListener('click', onSearch);

async function onSearch() {
  try {
    tmdbAPI = new TMDBAPI();

    // const pathToPosterImg = `https://image.tmdb.org/t/p/`;
    const pathToPosterImg = (await tmdbAPI.getConfiguration()).images
      .secure_base_url;

    //geting stored genres
    const genresDataFromLS = readFromLocalStorage(GENRES_DATA_LS_KEY);

    //getting movies data from fetch
    moviesData = (await tmdbAPI.getMoviesByName(searchInput.value)).results;

    //getting array of IDs and genres
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
