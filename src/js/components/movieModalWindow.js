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
  modalBackdrop.removeAttribute('style');
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
    name: movieName,
    poster_path: pathToPoster,
    vote_average: vote,
    vote_count: votes,
    popularity,
    overview,
  } = movieData;

  const fixedAverageRating = vote.toFixed(1);
  const fixedPopularity = popularity.toFixed(1);

  window.addEventListener('keydown', onEscKeyPress);
  modalBackdrop.addEventListener('click', onBackdropClick);
  document.body.classList.add('js-modal-is-hidden');
  closeModalButton.addEventListener('click', closeModal);

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
  refs.movieTitle.textContent = `${movieTitle}`;
  refs.movieGenre.textContent = `${movieGenresString}`;
  refs.movieAbout.textContent = `${overview}`;

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
