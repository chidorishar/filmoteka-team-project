import { TMDBAPI } from './TMBD';
('./TMDB');

//! change
const searchInput = document.querySelector('.header_search');
//! change
const searchBtn = document.querySelector('.header_search-button');
//! change
const container = document.querySelector('.container');

searchBtn.addEventListener('click', getMovies);

async function getMovies() {
  moviesAPI = new TMDBAPI();

  const arrOfFindedMovies = await moviesAPI.getMoviesByName(searchInput.value);
  const finded = arrOfFindedMovies.results;

  makeMoviesMarkup(finded);
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

      const { image, title, date, genre } = movieOutputs;

      console.log(genre);

      // console.log(`https://image.tmdb.org/t/p/w500${image}`);
      return `<img src="https://image.tmdb.org/t/p/w395{image}" alt="${title}"/><div><p>${title}</p><span>${date} | ${genre.join(
        ', '
      )}</span></div`;
    })
    .join(',');

  container.innerHTML = markupped;
}
