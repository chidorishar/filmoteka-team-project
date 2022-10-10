import { galleryAPI } from '../mainPage.js';
import { IDsParser } from '../utils/IDsToGenresParser.js';
import { BackendConfigStorage } from '../libs/BackendConfigStorage';

const galleryWrapper = document.querySelector('#movies-wrapper');
const modalBackdrop = document.querySelector('#movies-modal-window');
const closeModalButton = document.querySelector('.modal-close');
const modalButtonsWrapper = document.querySelector(
  '#movie-modal-buttons-wrapper'
);

//MAIN
(() => {
  galleryWrapper.addEventListener('click', onGalleryClick);
  modalButtonsWrapper.addEventListener('click', onGalleryClick);
})();

function onGalleryClick(event) {
  const movieCardLink = event.target.closest('a');

  if (!movieCardLink) {
    return;
  }

  event.preventDefault();

  const movieId = movieCardLink.dataset.movieId;
  const libData = {
    watched: movieCardLink.dataset.isMovieWatched,
    queued: movieCardLink.dataset.isMovieQueued,
  };
  const clickedMovieData = getMovieDataByID(movieId);

  console.log(clickedMovieData);
  renderModal(clickedMovieData, libData);
}

function renderModal(movieData, { watched, queued }) {
  const {
    genre_ids: genreIDs,
    original_title: movieTitle,
    poster_path: pathToPoster,
    vote_average: vote,
    vote_count: votes,
    overview,
  } = movieData;

  window.addEventListener('keydown', onEscKeyPress);
  modalBackdrop.addEventListener('click', onBackdropClick);
  document.body.classList.add('js-modal-is-hidden');
  closeModalButton.addEventListener('click', closeModal);

  const movieGenresString = IDsParser.idsToGenres(genreIDs);
  const posterFullPath =
    BackendConfigStorage.pathToPoster + 'w500' + pathToPoster;

  //здесь подменить данные в модалке
  modalBackdrop.classList.remove('is-hidden');
}

function onLibraryButtonsClick() {}

function closeModal() {
  window.removeEventListener('keydown', onEscKeyPress);
  modalBackdrop.removeEventListener('click', onBackdropClick);
  modalBackdrop.classList.add('is-hidden');
  document.body.classList.remove('js-modal-is-hidden');
}

function onBackdropClick(event) {
  if (event.target === modalBackdrop) {
    closeModal();
  }
}
function onEscKeyPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

function getMovieDataByID(ID) {
  const moviesData = galleryAPI.currentRenderedMoviesData;

  return moviesData.find(({ id }) => id === +ID);
}

// function on
