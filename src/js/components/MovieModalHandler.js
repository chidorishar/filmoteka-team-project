import { IDsParser } from '../utils/IDsToGenresParser.js';
import { BackendConfigStorage } from '../libs/BackendConfigStorage';
import { LDStorageAPI } from '../utils/LibraryDataStorageAPI.js';

export class MovieModalHandler {
  #modalWindowEls = {
    closeBtn: document.querySelector('.modal-close'),
    queueBtn: document.querySelector('#queue-btn'),
    watchedBtn: document.querySelector('#watched-btn'),
    moviesNavBtnsWrapper: document.querySelector('#movies-nav-btns-wrapper'),
    prevMovieBtn: document.querySelector('#prev-movie-btn'),
    nextMovieBtn: document.querySelector('#next-movie-btn'),
    modalBackdrop: document.querySelector('#movies-modal-window'),
    libActionsBtnsWrapper: document.querySelector(
      '#movie-modal-buttons-wrapper'
    ),
  };

  #movieLibData = null;
  #movieId = null;
  #clickedMovieData = null;
  #galleryAPI = null;

  #nextMovieId = null;
  #prevMovieId = null;

  static MODE = {
    HOME: 'home',
    LIBRARY_WATCHED: 'lib-watch',
    LIBRARY_QUEUED: 'lib-queue',
  };
  mode = null;

  static MOVIE_ACTIONS = {
    ADDED_TO_WATCHED: 'add_wchd',
    REMOVED_FROM_WATCHED: 'rem_wchd',
    ADDED_TO_QUEUED: 'add_queue',
    REMOVED_FROM_QUEUED: 'rem_queue',
  };

  #onMoveStatusChangedCB = null;

  constructor(galleryAPI, mode, onMoveStatusChangedCB) {
    this.#galleryAPI = galleryAPI;
    this.mode = mode;
    this.#onMoveStatusChangedCB = onMoveStatusChangedCB;

    this.#modalWindowEls.libActionsBtnsWrapper.addEventListener(
      'click',
      this.#onLibraryButtonsClick
    );

    //removes display: none from element, which comes with html
    this.#modalWindowEls.modalBackdrop.removeAttribute('style');
  }

  /**
   *
   * @param {number} movieId
   */
  onGalleryCardClicked = movieId => {
    //listener bindings
    window.addEventListener('keydown', this.#onEscKeyPress);
    this.#modalWindowEls.modalBackdrop.addEventListener(
      'click',
      this.#onBackdropClick
    );
    this.#modalWindowEls.closeBtn.addEventListener('click', this.#closeModal);
    this.#modalWindowEls.moviesNavBtnsWrapper.addEventListener(
      'click',
      this.#onNavThroughMoviesBtnClick
    );
    //cut body content by viewport sizes to prevent from scrolling
    document.body.classList.add('js-modal-is-hidden');

    this.#movieId = movieId;
    this.#setMovieData();

    this.#renderModal(this.#clickedMovieData);
  };

  #setMovieData(movieCardLink = null) {
    movieCardLink ??= document.querySelector(
      `a[data-movie-id="${this.#movieId}"]`
    );

    this.#prevMovieId = movieCardLink.dataset.prevMovieId;
    this.#nextMovieId = movieCardLink.dataset.nextMovieId;
    this.#movieLibData = LDStorageAPI.findInLocalStorage(this.#movieId);
    this.#clickedMovieData = this.#getMovieDataByID(this.#movieId);
  }

  #renderModal(movieData) {
    const {
      genre_ids: genreIDs,
      original_title: movieTitle,
      name: movieName,
      poster_path: pathToPoster,
      vote_average: vote,
      vote_count: votes,
      popularity,
      overview,
    } = movieData;

    const fixedAverageRating = vote ? vote.toFixed(1) : 'N/D';
    const fixedPopularity = popularity ? popularity.toFixed(1) : 'N/D';
    const movieGenresString = IDsParser.idsToGenres(genreIDs);
    const posterFullPath =
      BackendConfigStorage.pathToPoster + 'w500' + pathToPoster;

    const refs = {
      moviePoster: document.getElementById('poster'),
      modalTitle: document.getElementById('modalTitle'),
      movieAverageRating: document.getElementById('averageRating'),
      movieRating: document.getElementById('rating'),
      moviePopularity: document.getElementById('popularity'),
      movieTitle: document.getElementById('title'),
      movieGenre: document.getElementById('genre'),
      movieAbout: document.getElementById('aboutMovie'),
    };

    if (pathToPoster) refs.moviePoster.src = `${posterFullPath}`;
    refs.modalTitle.textContent = `${movieTitle ?? movieName}`;
    refs.movieAverageRating.textContent = `${fixedAverageRating}`;
    refs.movieRating.textContent = `${votes ? votes : 'N/D'}`;
    refs.moviePopularity.textContent = `${fixedPopularity}`;
    refs.movieTitle.textContent = `${movieTitle ?? movieName}`;
    refs.movieGenre.textContent = `${
      movieGenresString ? movieGenresString : 'N/D'
    }`;

    function addPosterPlaceholder() {
      const modalPosterPlaceholder =
        document.getElementById('modal-placeholder');
      const textInPlaceholder = document.querySelector(
        '.modal-poster__placeholder-title'
      );
      const hiddenPoster = document.querySelector('.poster');

      if (!pathToPoster) {
        modalPosterPlaceholder.classList.remove('is-hidden');
        textInPlaceholder.textContent = `${movieTitle ?? movieName}`;
        hiddenPoster.classList.add('is-hidden');
      } else {
        modalPosterPlaceholder.classList.add('is-hidden');
        hiddenPoster.classList.remove('is-hidden');
      }
    }

    addPosterPlaceholder();

    refs.movieAbout.textContent = `${overview ? overview : 'Sorry, no data'}`;
    //update text in library-related buttons according to movie's persistance in a library
    this.#updateControlButtons(this.#movieLibData);
    this.#updateMoviesNavButtons();

    //show whole modal window
    this.#modalWindowEls.modalBackdrop.classList.remove('is-hidden');
  }

  #updateControlButtons({ watched, queued }) {
    this.#modalWindowEls.watchedBtn.textContent = `
  ${watched ? 'REMOVE FROM' : 'ADD TO'} WATCHED`;
    this.#modalWindowEls.queueBtn.textContent = `
  ${queued ? 'REMOVE FROM' : 'ADD TO'} QUEUE`;
  }

  #updateMoviesNavButtons() {
    this.#prevMovieId
      ? this.#modalWindowEls.prevMovieBtn.removeAttribute('disabled')
      : this.#modalWindowEls.prevMovieBtn.setAttribute('disabled', '');
    this.#nextMovieId
      ? this.#modalWindowEls.nextMovieBtn.removeAttribute('disabled')
      : this.#modalWindowEls.nextMovieBtn.setAttribute('disabled', '');
  }

  #onLibraryButtonsClick = e => {
    const oldMovieLibData = this.#movieLibData;
    const movieNewLibData = this.#updateLSData(e.target.id);

    const movieLibDelta = {
      watchedChanged: oldMovieLibData.watched !== movieNewLibData.watched,
      queuedChanged: oldMovieLibData.queued === movieNewLibData.queued,
    };
    let movieAction;
    if (movieLibDelta.watchedChanged) {
      movieAction = oldMovieLibData.watched
        ? MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_WATCHED
        : MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_WATCHED;
    } else {
      movieAction = oldMovieLibData.queued
        ? MovieModalHandler.MOVIE_ACTIONS.REMOVED_FROM_QUEUED
        : MovieModalHandler.MOVIE_ACTIONS.ADDED_TO_QUEUED;
    }

    this.#updateControlButtons(movieNewLibData);
    this.#movieLibData = movieNewLibData;

    this.#onMoveStatusChangedCB?.(movieAction);
  };

  #updateLSData(btnID) {
    const movieNewLibData = {
      ...LDStorageAPI.findInLocalStorage(this.#movieId),
    };

    if (btnID === 'queue-btn') {
      movieNewLibData.queued
        ? LDStorageAPI.removeFromLocalStorage(
            this.#movieId,
            LDStorageAPI.MOVIE_INFO.QUEUED
          )
        : LDStorageAPI.addToLocalStorage({
            id: this.#movieId,
            movieData: this.#clickedMovieData,
            storageKey: LDStorageAPI.MOVIE_INFO.QUEUED,
          });
      movieNewLibData.queued = !movieNewLibData.queued;
    } else {
      movieNewLibData.watched
        ? LDStorageAPI.removeFromLocalStorage(
            this.#movieId,
            LDStorageAPI.MOVIE_INFO.WATCHED
          )
        : LDStorageAPI.addToLocalStorage({
            id: this.#movieId,
            movieData: this.#clickedMovieData,
            storageKey: LDStorageAPI.MOVIE_INFO.WATCHED,
          });
      movieNewLibData.watched = !movieNewLibData.watched;
    }

    return movieNewLibData;
  }

  #closeModal = () => {
    window.removeEventListener('keydown', this.#onEscKeyPress);
    this.#modalWindowEls.modalBackdrop.removeEventListener(
      'click',
      this.#onBackdropClick
    );

    //hide whole modal
    this.#modalWindowEls.modalBackdrop.classList.add('is-hidden');
    //let body content scroll freely
    document.body.classList.remove('js-modal-is-hidden');
  };

  #onBackdropClick = event => {
    if (event.target === this.#modalWindowEls.modalBackdrop) {
      this.#closeModal();
    }
  };

  #onNavThroughMoviesBtnClick = e => {
    if (e.target.nodeName !== 'BUTTON') return;

    const nextMovieId =
      e.target.id === 'prev-movie-btn' ? this.#prevMovieId : this.#nextMovieId;
    if (!nextMovieId) {
      return;
    }

    this.#movieId = nextMovieId;
    this.#setMovieData();
    this.#updateMoviesNavButtons();
    this.#renderModal(this.#clickedMovieData);
  };

  #onEscKeyPress = event => {
    let nextMovieId = null;
    let switchMovie = false;

    switch (event.code) {
      case 'Escape':
        this.#closeModal();
        break;
      case 'ArrowLeft':
        nextMovieId = this.#prevMovieId;
        switchMovie = true;
        break;
      case 'ArrowRight':
        nextMovieId = this.#nextMovieId;
        switchMovie = true;
        break;
    }

    //render next/previous movie data
    if (switchMovie && nextMovieId) {
      this.#movieId = nextMovieId;
      this.#setMovieData();
      this.#updateMoviesNavButtons();
      this.#renderModal(this.#clickedMovieData);
    }
  };

  #getMovieDataByID(ID) {
    const moviesData = this.#galleryAPI.currentRenderedMoviesData;

    return moviesData.find(({ id }) => id === +ID);
  }
}
