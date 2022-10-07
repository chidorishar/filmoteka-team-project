import { TMDBAPI } from './theMovieAPI';
('./TMDB');

//! change
const searchInput = document.querySelector('.header_search');
//! change
const searchBtn = document.querySelector('.header_search-button');
const movieList = document.querySelector('.movie-card__list');
moviesAPI = new TMDBAPI();

searchBtn.addEventListener('click', onSearch);

function onSearch() {
  getMovies(moviesAPI.getMoviesByName(searchInput.value));
}
function getMovies(requestFn) {
  return requestFn.then(res => makeMoviesMarkup(res.results));
}

/**
 * Description of the makeMoviesMarkup.
 * @param {Array} movies - array of getting movies
 * @returns {string} - the markup of movies
 */
function makeMoviesMarkup(movies) {
  console.log(movies);
  const markupped = movies
    .map(el => {
      const movieOutputs = {
        image: el.poster_path,
        title: el.title,
        date: el.release_date.slice(0, 4),
        //! just id
        genre: el.genre_ids,
        alt: el.overview,
      };

      const { image, title, date, genre, alt } = movieOutputs;
      //!выходит запросить изображение только с шириной 500px
      const imageLink = `https://image.tmdb.org/t/p/w500${image}`;

      console.log(imageLink);

      return `<li class="movie-card__item grid-card__item">
        <a class="movie-card__link" href="">
        //! указаны размеры
          <img width="395" height="594" class="movie-card__img" src="${imageLink}" loading="lazy" alt="${alt}">
          <ul class="movie-card__properties-list">
            <li class="movie-card__properties-item">
              <h3 class="movie-card__movie-title">${title}</h3>
            </li>
            <li class="movie-card__properties-item">
              <p class="movie-card__movie-category">${genre.join(
                ', '
              )} | ${date}</p>
            </li>
          </ul>
        </a>
      </li>`;
    })
    .join('');

  return (movieList.innerHTML = markupped);
}
