// import { galleryAPI } from '../mainPage.js';
import { IDsParser } from '../utils/IDsToGenresParser.js';
import { BackendConfigStorage } from '../libs/BackendConfigStorage';
import {
  MOVIE_INFO,
  getMovieLSInfo,
  saveToLS,
  removeFromLS,
} from '../utils/testLSSaver.js';

export class MovieModalHandler {
  #modalWindowEls = {
    closeBtn: null,
    queueBtn: null,
    watchedBtn: null,
    modalBackdrop: null,
    libActionsBtnsWrapper: null,
  };

  #movieLibData = null;
  #movieId = null;
  #clickedMovieData = null;
  #galleryAPI = null;

  constructor(
    watchedBtnSelector,
    queueBtnSelector,
    backdropSelector,
    closeBtnSelector,
    libActionsBtnsWrapperSelector,
    galleryAPI
  ) {
    this.#modalWindowEls.watchedBtn =
      document.querySelector(watchedBtnSelector);
    this.#modalWindowEls.queueBtn = document.querySelector(queueBtnSelector);
    this.#modalWindowEls.modalBackdrop =
      document.querySelector(backdropSelector);
    this.#modalWindowEls.closeBtn = document.querySelector(closeBtnSelector);
    this.#modalWindowEls.libActionsBtnsWrapper = document.querySelector(
      libActionsBtnsWrapperSelector
    );

    this.#galleryAPI = galleryAPI;

    galleryAPI.addOnCardClickCallback(this.#onGalleryClick);
    this.#modalWindowEls.libActionsBtnsWrapper.addEventListener(
      'click',
      this.#onLibraryButtonsClick
    );

    //removes display: none from element, which comes with html
    this.#modalWindowEls.modalBackdrop.removeAttribute('style');
  }

  #onGalleryClick = event => {
    const movieCardLink = event.target.closest('a');

    if (!movieCardLink) {
      return;
    }

    event.preventDefault();

    window.addEventListener('keydown', this.#onEscKeyPress);
    this.#modalWindowEls.modalBackdrop.addEventListener(
      'click',
      this.#onBackdropClick
    );
    this.#modalWindowEls.closeBtn.addEventListener('click', this.#closeModal);
    //cut body content by viewport sizes ti prevent from scrolling
    document.body.classList.add('js-modal-is-hidden');

    this.#movieId = movieCardLink.dataset.movieId;
    this.#movieLibData = getMovieLSInfo(this.#movieId);
    this.#clickedMovieData = this.#getMovieDataByID(this.#movieId);

    this.#renderModal(this.#clickedMovieData);
  };

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

    const fixedAverageRating = vote.toFixed(1);
    const fixedPopularity = popularity.toFixed(1);
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

    refs.moviePoster.src = `${posterFullPath}`;
    refs.modalTitle.textContent = `${movieTitle ?? movieName}`;
    refs.movieAverageRating.textContent = `${fixedAverageRating}`;
    refs.movieRating.textContent = `${votes}`;
    refs.moviePopularity.textContent = `${fixedPopularity}`;
    refs.movieTitle.textContent = `${movieTitle ?? movieName}`;
    refs.movieGenre.textContent = `${movieGenresString}`;
    refs.movieAbout.textContent = `${overview}`;
    //update text in library-related buttons according to movie's persistance in a library
    this.#updateControlButtons(this.#movieLibData);

    //show whole modal window
    this.#modalWindowEls.modalBackdrop.classList.remove('is-hidden');
  }

  #updateControlButtons({ watched, queued }) {
    this.#modalWindowEls.watchedBtn.textContent = `
  ${watched ? 'REMOVE FROM' : 'ADD TO'} WATCHED`;
    this.#modalWindowEls.queueBtn.textContent = `
  ${queued ? 'REMOVE FROM' : 'ADD TO'} QUEUE`;
  }

  #onLibraryButtonsClick = e => {
    const movieNewLibData = this.#updateLSData(e.target.id);

    this.#updateControlButtons(movieNewLibData);
  };

  #updateLSData(btnID) {
    const movieNewLibData = { ...getMovieLSInfo(this.#movieId) };

    if (btnID === 'queue-btn') {
      movieNewLibData.queued
        ? removeFromLS(this.#movieId, MOVIE_INFO.QUEUED)
        : saveToLS(this.#movieId, this.#clickedMovieData, MOVIE_INFO.QUEUED);
      movieNewLibData.queued = !movieNewLibData.queued;
    } else {
      movieNewLibData.watched
        ? removeFromLS(this.#movieId, MOVIE_INFO.WATCHED)
        : saveToLS(this.#movieId, this.#clickedMovieData, MOVIE_INFO.WATCHED);
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

  #onEscKeyPress = event => {
    if (event.code === 'Escape') {
      this.#closeModal();
    }
  };

  #getMovieDataByID(ID) {
    const moviesData = this.#galleryAPI.currentRenderedMoviesData;

    return moviesData.find(({ id }) => id === +ID);
  }
}
