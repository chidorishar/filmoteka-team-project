import { fetchByName } from './fetchMovies';

const searchInput = document.querySelector('.header_search');
const searchBtn = document.querySelector('.header_search-button');

const movieParams = {};

searchBtn.addEventListener('click', findMovies);

function findMovies(event) {
  getMovies(event);
}

async function getMovies(movieName) {
  console.log('searchInput.value :', searchInput.value);
  try {
    const response = await fetchByName(searchInput.value);
    const films = await response.results;

    console.log(films);
  } catch (error) {
    console.log(error);
  }
}
