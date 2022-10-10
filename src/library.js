import './js/components/teamModalWindow.js';

import { GalleryAPI } from './js/components/GalleryAPI';
import { TMDBAPI } from './js/libs/TMDBAPI';
const GENRES_DATA_LS_KEY = 'genres-data';

let galleryAPI = null;


// записаный обьект в локал сторедж

localStorage.getItem('watched',JSON.stringify())


// MAIN
(async () => {
  try {
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
