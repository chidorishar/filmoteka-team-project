import { IDsParser } from '../utils/IDsToGenresParser';
import { BackendConfigStorage } from '../libs/BackendConfigStorage.js';
import { Spinner } from '../components/Spinner';

export class GalleryAPI {
  #loadedImages = 0;
  #totalImages = 0;
  #pathToPoster = '';
  #rootEl = null;
  #onCriticalImagesLoadedCallbacks = [];
  #currentMoviesData = null;
  #spinner = null;
  #posterImageCSSClass = 'movie-card__img';

  #numberOfCriticalImages = 3;

  constructor(rootElementSelector) {
    this.#rootEl = document.querySelector(rootElementSelector);
    this.#pathToPoster = BackendConfigStorage.pathToPoster;
    this.#spinner = new Spinner('.gallery', 'loader-gallery');
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

    // const this.#spinner = this.#this.#spinner;
    this.#spinner.show();
    this.#spinner.setDeltaY(150);

    let imgsWithPoster = 0;
    let isAllCriticalAdded = false;
    this.#untrackImagesLoadingEnd();
    const cardsMarkup = moviesData.reduce((acc, movieData, indx, arr) => {
      const { markup, hasPoster } = this.#createMovieCardMarkup(
        movieData,
        arr[indx - 1]?.id,
        arr[indx + 1]?.id,
        !isAllCriticalAdded
      );
      if (hasPoster) imgsWithPoster++;
      //render bunch of critical images to gallery
      if (
        imgsWithPoster === this.#numberOfCriticalImages &&
        !isAllCriticalAdded
      ) {
        isAllCriticalAdded = true;
      }
      return (acc += markup);
    }, '');
    //actual created images number is lesser than wanted tracked one, so must set it to real one
    if (imgsWithPoster < this.#numberOfCriticalImages)
      this.#numberOfCriticalImages = imgsWithPoster;
    this.#totalImages = imgsWithPoster;

    //render images to gallery
    this.#rootEl.innerHTML = cardsMarkup;
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
    nextMovieID,
    canBeCritical
  ) {
    const releaseDate = (release_date ?? first_air_date)?.slice(0, 4) ?? '';
    const rating = vote_average ? Number(vote_average).toFixed(1) : 'N/D';
    let genresStr = this.#parseIDsToGenresString(genre_ids);
    const movieName = title ?? name;
    const hasPoster = poster_path;
    const mustBeCritical = hasPoster && canBeCritical;

    // prettier-ignore
    const posterEl =
      poster_path ? 
      `<img
        class="${this.#posterImageCSSClass}"
        ${mustBeCritical
          ?
          `src="${this.#pathToPoster}w500${poster_path}"` 
          : 
          `src="/" true-src="${this.#pathToPoster}w500${poster_path}"`
          }
        alt="Poster of the ${movieName} movie"
      />`
      : 
      `<span class="movie-card__poster-placeholder">
        <span class="movie-card__poster-placeholder--title">
          ${movieName}
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
          <h3 class="movie-card__title">${movieName}</h3>
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
    const currentImageEl = e.currentTarget;

    if (currentImageEl.getAttribute('src') === '/') return;

    this.#loadedImages++;
    currentImageEl.removeEventListener('load', this.#onImageLoaded);
    console.log(this.#loadedImages);

    //load image for next image element with dummy src attribute
    const imageToLoadEl = document.querySelector(
      `.${this.#posterImageCSSClass}[true-src]`
    );
    if (imageToLoadEl) {
      console.log(imageToLoadEl);
      const pathToPoster = imageToLoadEl.getAttribute('true-src');
      imageToLoadEl.removeAttribute('true-src');
      imageToLoadEl.setAttribute('src', pathToPoster);
      console.log(pathToPoster);
    }

    if (
      this.#loadedImages === this.#numberOfCriticalImages &&
      this.#totalImages
    ) {
      this.#onCriticalImagesLoadedCallbacks.forEach(cb => cb());
    }

    if (this.#loadedImages === 3 && this.#totalImages) this.#spinner.hide();

    // if (this.#loadedImages === this.#totalImages) {
    //   this.#onImagesLoadedCallback();
    // }
  };

  #trackImagesLoadingEnd() {
    const allImagesEls = document.querySelectorAll(
      `.${this.#posterImageCSSClass}`
    );

    [...allImagesEls].forEach(el => {
      el.addEventListener('load', this.#onImageLoaded);
      el.addEventListener('error', this.#onImageLoaded);
    });
  }

  #untrackImagesLoadingEnd() {
    const allImagesEls = document.querySelectorAll(
      `.${this.#posterImageCSSClass}`
    );

    this.#loadedImages = 0;
    [...allImagesEls].forEach(el => {
      el.removeEventListener('load', this.#onImageLoaded);
      el.removeEventListener('error', this.#onImageLoaded);
    });
  }

  get currentRenderedMoviesData() {
    return this.#currentMoviesData;
  }
}
