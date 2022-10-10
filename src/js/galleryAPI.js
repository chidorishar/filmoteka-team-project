import { IDsParser } from './utils/idsToGenres';

export class GalleryAPI {
  #idsParser = null;
  #loadedImages = 0;
  #totalImages = 0;
  #pathToPoster = '';
  #rootEl = null;
  #onImagesLoadedCallback = null;

  constructor(
    rootElementSelector,
    pathToPosterImg,
    genresAndIDs,
    onAllImagesLoadedCallback = () => {}
  ) {
    this.#rootEl = document.querySelector(rootElementSelector);
    this.#pathToPoster = pathToPosterImg;
    this.#onImagesLoadedCallback = onAllImagesLoadedCallback;
    this.#idsParser = new IDsParser(genresAndIDs);
  }

  renderMoviesCards(moviesData) {
    this.#totalImages = moviesData.length;
    this.#rootEl.innerHTML = moviesData.reduce(
      (acc, movieData) => (acc += this.#createMovieCardMarkup(movieData)),
      ''
    );
    this.#trackImagesLoadingEnd();
  }

  #createMovieCardMarkup({
    poster_path,
    title,
    name,
    genre_ids,
    vote_average,
    release_date,
    first_air_date,
    id,
  }) {
    const releaseDate = (release_date ?? first_air_date)?.slice(0, 4) ?? '';
    const rating = Number(vote_average).toFixed(1);
    let genresStr = this.#parseIDsToGenresString(genre_ids);

    // prettier-ignore
    const posterEl = poster_path
      ? 
      `<img
        class="movie-card__img"
        src="${this.#pathToPoster}w500${poster_path}"
        alt=""
      />`
      : 
      `<span class="movie-card__poster-placeholder">
        <span class="movie-card__poster-placeholder--title">
          ${title}
        </span>has no poster
      </span>`;

    // prettier-ignore
    const resMarkup =
      `<li class="movie-card">
        <a class="movie-card__link" href="/" data-movie-id="${id}">
          <div class="movie-card__img-thumb ${poster_path ? '' : "movie-card__img-thumb--no-poster"}">
            ${posterEl}
          </div>
          <h3 class="movie-card__title">${title ?? name}</h3>
          <ul class="movie-card__movie-info-wrapper">
            <li class="movie-card__item movie-card__item--hidden-overflow">
              <p class="movie-card__genres">${genresStr}</p>
            </li>
            <li class="movie-card__item">
              <p class="movie-card__release-date">${genresStr ? '&nbsp;|&nbsp' : ""}${releaseDate}</p>
            </li>
            <li class="movie-card__item movie-card__item--accent">
              <p class="movie-card__rating">${rating}</p>
            </li>
          </ul>
        </a>
      </li>`;

    return resMarkup;
  }

  #parseIDsToGenresString(IDs) {
    if (!IDs.length) return '';

    const idsParser = this.#idsParser;
    const isTooManyIDs = IDs.length > 2;
    const ids = isTooManyIDs ? IDs.slice(0, 2) : IDs;

    let parsedGenres = idsParser.idsToGenres(ids);
    parsedGenres += isTooManyIDs ? ', Other' : '';

    return parsedGenres;
  }

  #onImageLoaded = e => {
    this.#loadedImages++;
    e.currentTarget.removeEventListener('load', this.#onImageLoaded);

    if (this.#loadedImages === this.#totalImages) {
      this.#onImagesLoadedCallback();
    }
  };

  #trackImagesLoadingEnd() {
    const allImagesEls = document.querySelectorAll('.movie-card__img');

    this.#loadedImages = 0;
    [...allImagesEls].forEach(el => {
      el.addEventListener('load', this.#onImageLoaded);
      el.addEventListener('error', this.#onImageLoaded);
    });
  }
}
