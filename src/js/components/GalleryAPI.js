import { IDsParser } from '../utils/IDsToGenresParser';
import { BackendConfigStorage } from '../libs/BackendConfigStorage.js';

export class GalleryAPI {
  #loadedImages = 0;
  #totalImages = 0;
  #pathToPoster = '';
  #rootEl = null;
  #onCriticalImagesLoadedCallbacks = [];
  #currentMoviesData = null;

  #numberOfCriticalImages = 3;

  constructor(rootElementSelector) {
    this.#rootEl = document.querySelector(rootElementSelector);
    this.#pathToPoster = BackendConfigStorage.pathToPoster;
  }

  addOnCardClickCallback(cb) {
    this.#rootEl.addEventListener('click', cb);
  }

  removeOnCardClickCallback(cb) {
    this.#rootEl.removeEventListener('click', cb);
  }

  addOnCriticalImagesLoadedCallback(cb) {
    this.#onCriticalImagesLoadedCallbacks.push(cb);
  }

  removeOnCriticalImagesLoadedCallback(cb) {
    this.#onCriticalImagesLoadedCallbacks =
      this.#onCriticalImagesLoadedCallbacks.filter(
        existCallback => existCallback !== cb
      );
  }

  renderMoviesCards(moviesData) {
    this.#currentMoviesData = moviesData;
    this.#rootEl.innerHTML = '';

    let createdImgsNumber = 0;
    let isCriticalRendered = false;
    const cardsMarkup = moviesData.reduce((acc, movieData, indx, arr) => {
      const { markup, hasPoster } = this.#createMovieCardMarkup(
        movieData,
        arr[indx - 1]?.id,
        arr[indx + 1]?.id
      );
      if (hasPoster) createdImgsNumber++;
      //render bunch of critical images to gallery
      if (
        createdImgsNumber === this.#numberOfCriticalImages + 1 &&
        !isCriticalRendered
      ) {
        isCriticalRendered = true;
        this.#rootEl.innerHTML = acc;
        acc = '';
      }
      return (acc += markup);
    }, '');
    //actual created images number is lesser than wanted tracked one, so must set it to real one
    if (createdImgsNumber < this.#numberOfCriticalImages)
      this.#numberOfCriticalImages = createdImgsNumber;
    this.#totalImages = createdImgsNumber;

    //render other (not critical) images to gallery
    this.#rootEl.insertAdjacentHTML('beforeend', cardsMarkup);
    this.#trackImagesLoadingEnd();
  }

  #createMovieCardMarkup(
    {
      poster_path,
      title,
      name,
      genre_ids,
      vote_average,
      release_date,
      first_air_date,
      id,
    },
    prevMovieID,
    nextMovieID
  ) {
    const releaseDate = (release_date ?? first_air_date)?.slice(0, 4) ?? '';
    const rating = vote_average ? Number(vote_average).toFixed(1) : 'N/D';
    let genresStr = this.#parseIDsToGenresString(genre_ids);
    const hasPoster = poster_path;

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
          ${title ?? name}
        </span>has no poster
      </span>`;

    // prettier-ignore
    const markup =
      `<li class="movie-card">
        <a class="movie-card__link" href="/" data-movie-id="${id}" 
          data-prev-movie-id="${prevMovieID ?? '' }" data-next-movie-id="${ nextMovieID ?? '' }">
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

    return { markup, hasPoster };
  }

  #parseIDsToGenresString(IDs) {
    if (!IDs?.length) return '';

    const isTooManyIDs = IDs.length > 2;
    const ids = isTooManyIDs ? IDs.slice(0, 2) : IDs;

    let parsedGenres = IDsParser.idsToGenres(ids);
    parsedGenres += isTooManyIDs ? ', Other' : '';

    return parsedGenres;
  }

  #onImageLoaded = e => {
    this.#loadedImages++;
    console.log(this.#loadedImages);
    e.currentTarget.removeEventListener('load', this.#onImageLoaded);

    if (this.#loadedImages === this.#numberOfCriticalImages) {
      this.#onCriticalImagesLoadedCallbacks.forEach(cb => cb());
    }

    // if (this.#loadedImages === this.#totalImages) {
    //   this.#onImagesLoadedCallback();
    // }
  };

  #trackImagesLoadingEnd() {
    const allImagesEls = document.querySelectorAll('.movie-card__img');

    this.#loadedImages = 0;
    [...allImagesEls].forEach(el => {
      el.addEventListener('load', this.#onImageLoaded);
      el.addEventListener('error', this.#onImageLoaded);
    });
  }

  get currentRenderedMoviesData() {
    return this.#currentMoviesData;
  }
}
