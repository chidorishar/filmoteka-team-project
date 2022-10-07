import { TMDBAPI } from './TMDB';
('./TMDB');

//! change
const searchInput = document.querySelector('.header_search');
//! change
const searchBtn = document.querySelector('.header_search-button');
//! change
const container = document.querySelector('.container');

searchBtn.addEventListener('click', findMovies);

function findMovies(event) {
  console.log(getMovies());
}

async function getMovies(movieName) {
  moviesAPI = new TMDBAPI();

  const arrOfFindedMovies = await moviesAPI.getMoviesByName(searchInput.value);

  const finded = arrOfFindedMovies.results;

  const makrup = makeMoviesMarkup(finded);
  console.log(finded);
  console.log(makrup);
}

/**
 * Description of the makeMoviesMarkup.
 * @param {Array} movies - array of getting movies
 * @returns {string} - the markup of movies
 */
function makeMoviesMarkup(movies) {
  const markupped = movies

    .map(el => {
      const movieOutputs = {
        image: el.poster_path,
        title: el.title,
        //.slice(0, 4)
        date: el.release_date,
        //! genre doesn't work
        genre: el.genre_ids,
      };

      // console.log(movieOutputs.genre);

      const { image, title, date } = movieOutputs;

      return `<img src="https://image.tmdb.org/t/p/w500${image}" alt="${title}"/><div><p>${title}</p><span>${date} | ${date}</span></div`;
    })
    .join(',');

  container.innerHTML = markupped;
}
