import { IDsParser } from '../utils/IDsToGenresParser';
import { BackendConfigStorage } from '../libs/BackendConfigStorage.js';
import { Spinner } from '../components/Spinner';

export class GalleryAPI {
  #loadedImages = 0;
  #totalImages = 0;
  #pathToPoster = '';
  #rootEl = null;
  #onCriticalImagesLoadedCallbacks = [];
  #onDeleteButtonClickedCB = null;
  #onMovieCardClickedCB = null;
  #currentMoviesData = null;
  #spinner = null;
  #posterImageCSSClass = 'movie-card__img';

  #renderCloseButton = null;

  #MAX_NUM_OF_CRIT_IMAGES = 3;
  #NUMB_OF_IMAGES_TO_LOAD_AT_ONCE = 3;
  #numberOfCriticalImages = null;
  #imagesElsToLoad = null;

  constructor(
    rootElementSelector,
    renderCloseButton = false,
    onMovieCardClickedCB = () => {},
    onDeleteButtonClickedCB = () => {}
  ) {
    this.#rootEl = document.querySelector(rootElementSelector);
    this.#renderCloseButton = renderCloseButton;
    this.#onMovieCardClickedCB = onMovieCardClickedCB;
    this.#onDeleteButtonClickedCB = onDeleteButtonClickedCB;
    this.#pathToPoster = BackendConfigStorage.pathToPoster;
    this.#spinner = new Spinner('.gallery', 'loader-gallery');
    this.#rootEl.addEventListener('click', this.#onCardClicked);
  }

  addOnCardClickCallback(cb) {
    this.#rootEl.addEventListener('click', cb);
  }

  removeOnCardClickCallback(cb) {
    this.#rootEl.removeEventListener('click', cb);
  }

  /**
   * It routs click events
   * @returns nothing
   */
  #onCardClicked = e => {
    const movieCardLink = e.target.closest('a');
    const clickedElNodeName = e.target.nodeName;
    e.preventDefault();

    if (!movieCardLink) {
      return;
    }

    const movieId = movieCardLink.dataset.movieId;
    //if we clicked remove button - call specific callback asynchronously and exit from function
    if (clickedElNodeName === 'BUTTON') {
      Promise.resolve(
        (() => {
          this.#onDeleteButtonClickedCB(movieId);
        })()
      );

      return;
    }

    //we clicked to movie card - call specific callback asynchronously
    Promise.resolve(
      (() => {
        this.#onMovieCardClickedCB(movieId);
      })()
    );
  };

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

    this.#spinner.show();

    //set constants according to device
    if (window.matchMedia('(max-width: 1280px)').matches)
      this.#MAX_NUM_OF_CRIT_IMAGES = 2;
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.#MAX_NUM_OF_CRIT_IMAGES = 1;
      this.#NUMB_OF_IMAGES_TO_LOAD_AT_ONCE = 2;
    }
    //reset Gallery state
    this.#numberOfCriticalImages = this.#MAX_NUM_OF_CRIT_IMAGES;
    let imgsWithPoster = 0;
    let isAllCriticalAdded = false;
    this.#untrackImagesLoadingEnd();
    //create markup
    const cardsMarkup = moviesData.reduce((acc, movieData, indx, arr) => {
      const { markup, hasPoster } = this.#createMovieCardMarkup(
        movieData,
        arr[indx - 1]?.id,
        arr[indx + 1]?.id,
        !isAllCriticalAdded
      );

      if (hasPoster) imgsWithPoster++;
      if (
        imgsWithPoster === this.#numberOfCriticalImages &&
        !isAllCriticalAdded
      )
        isAllCriticalAdded = true;

      return (acc += markup);
    }, '');
    //actual created images number is lesser than wanted tracked one, so must set it to real one
    if (imgsWithPoster < this.#numberOfCriticalImages)
      this.#numberOfCriticalImages = imgsWithPoster;
    this.#totalImages = imgsWithPoster;

    //render images to gallery
    this.#rootEl.innerHTML = cardsMarkup;
    //if there is posters with images then load them in batches (progressive) else hide spinner
    if (imgsWithPoster) {
      this.#trackImagesLoadingEnd();
      this.#imagesElsToLoad = [
        ...document.querySelectorAll(`.${this.#posterImageCSSClass}[data-src]`),
      ];
    } else this.#spinner.hide();
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
    const hasPoster = !!poster_path;
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
          `src="#" data-src="${this.#pathToPoster}w500${poster_path}"`
          }
        alt="Poster of the ${movieName} movie"
      />`
      : 
      `<span class="movie-card__poster-placeholder">
        <span class="movie-card__placeholder-title-wrapper">
          <span class="movie-card__poster-placeholder--title">
           ${movieName}
          </span>
        </span>
      has no poster
      </span>`;
    // prettier-ignore
    const closeButtonEl = this.#renderCloseButton
      ? `<button
          aria-label="Delete movie from library"
          class="movie-card__delete-button"
          data-modal-close
        >
          <svg class="movie-card__icon" viewBox="0 0 32 32" width="10" height="10">
            <path d="M31.439 3.166l-3.166-3.166-12.554 12.552-12.552-12.552-3.166 3.166 12.552 12.552-12.552 12.554 3.166 3.166 12.552-12.554 12.554 12.554 3.166-3.166-12.554-12.554 12.554-12.552z"></path>          </svg>
        </button>`
      : '';

    const imgThumbAdditionalClasses =
      (hasPoster ? '' : 'movie-card__img-thumb--no-poster') +
      ' ' +
      (hasPoster && !mustBeCritical
        ? 'movie-card__img-thumb--img-loading'
        : '');

    // prettier-ignore
    const markup =
      `<li class="movie-card">
        <a class="movie-card__link" href="/" data-movie-id="${id}" 
          data-prev-movie-id="${prevMovieID ?? '' }" data-next-movie-id="${ nextMovieID ?? '' }">
          <div class="movie-card__img-thumb ${imgThumbAdditionalClasses}"
            >
            ${closeButtonEl}
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
    const currentImageEl = e.target;

    //accept events only from images with correct "src" attribute value
    if (currentImageEl.getAttribute('src') === '#') return;

    this.#loadedImages++;
    const numbOfImgsToLoadAtOnce = this.#NUMB_OF_IMAGES_TO_LOAD_AT_ONCE;
    const numberOfCriticalImages = this.#numberOfCriticalImages;
    currentImageEl.removeEventListener('load', this.#onImageLoaded);
    //load next bunch of images if there any or it's a last bunch of images
    //it just works
    if (
      !(this.#loadedImages < numberOfCriticalImages) &&
      (this.#loadedImages === numberOfCriticalImages ||
        !(
          (this.#loadedImages - numberOfCriticalImages) %
          numbOfImgsToLoadAtOnce
        ) ||
        this.#totalImages - this.#loadedImages < numbOfImgsToLoadAtOnce)
    ) {
      let counter = 0;
      while (
        counter < numbOfImgsToLoadAtOnce &&
        this.#imagesElsToLoad?.length
      ) {
        const imageToLoadEl = this.#imagesElsToLoad.shift();
        const imgToLoadThumbEl = imageToLoadEl.closest(
          '.movie-card__img-thumb'
        );
        const pathToPoster = imageToLoadEl.dataset.src;
        imageToLoadEl.removeAttribute('data-src');
        imageToLoadEl.src = pathToPoster;
        //remove placeholder, which showed while image loading
        imgToLoadThumbEl.classList.remove('movie-card__img-thumb--img-loading');
        counter++;
      }
    }

    if (this.#loadedImages === numberOfCriticalImages && this.#totalImages) {
      this.#spinner.hide();
      this.#onCriticalImagesLoadedCallbacks.forEach(cb => cb());
    }

    //image loading failed, show fallback instead
    const currImgThumbEl = currentImageEl.closest('.movie-card__img-thumb');
    if (e.type === 'error') {
      //it checks for image loaded flag after some timeout, because sometimes we get events with "error" type for loaded images
      setTimeout(() => {
        if (!currentImageEl.complete)
          currImgThumbEl?.classList.add('movie-card__img-thumb--img-fallback');
      }, 250);
    }
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
