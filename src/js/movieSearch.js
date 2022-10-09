import { TMDBAPI } from './theMovieAPI';

//! change
const searchInput = document.querySelector('.header_search');
//! change
const searchBtn = document.querySelector('.header_search-button');
const movieList = document.querySelector('.movie-card__list');
const moviesAPI = new TMDBAPI();

searchBtn.addEventListener('click', onSearch);

function onSearch() {
  getMovies(moviesAPI.getMoviesByName(searchInput.value));
}

async function getMovies(requestFn) {
  const fetchedData = await requestFn;
  return makeMoviesMarkup(fetchedData.results);
}

async function getGenres(id = []) {
  const fetchedData = await moviesAPI.getGenresData();

  res = [];
  id.forEach(idInstance => {
    res.push(getGenreById(fetchedData.genres, idInstance));
  });
}

function getGenreById(genres, id) {
  const genresEqualisation = genres.filter(el => {
    return el.id === id;
  });

  if (genresEqualisation) {
    // фильтрация повторяющихся значений
    //? это действие необходимо, тк в ответ на запрос массива жанров - приходит массив объекты которого дублирутся (только: id 16, 35, 80, 99, 18, 10751, 9648, 37)
    const unique = [
      ...new Map(genresEqualisation.map(el => [el[id], el])).values(),
    ];
    return unique[0].name;
  }
  return 0;
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
        genreIds: el.genre_ids,
        alt: el.overview,
      };

      const { image, title, date, genreIds, alt } = movieOutputs;


      //! выходит запросить изображение только с шириной 500px
      const imageLink = `https://image.tmdb.org/t/p/w500${image}`;

      return `<li class="movie-card__item grid-card__item">
        <a class="movie-card__link" href="">
        <!--//! указаны размеры-->
          <img width="395" height="594" class="movie-card__img" src="${imageLink}" loading="lazy" alt="${alt}">
          <ul class="movie-card__properties-list">
            <li class="movie-card__properties-item">
              <h3 class="movie-card__movie-title">${title}</h3>
            </li>
            <li class="movie-card__properties-item">
              <p class="movie-card__movie-category"> ... | ${date}</p>
            </li>
          </ul>
        </a>
      </li>`;
    })
    .join('');

  return (movieList.innerHTML = markupped);
}
