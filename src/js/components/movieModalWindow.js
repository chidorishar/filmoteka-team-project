import { galleryAPI } from '../mainPage.js';
import { IDsParser } from '../utils/IDsToGenresParser.js';

const galleryWrapper = document.querySelector('#movies-wrapper');
const modal = document.querySelector('.modal');
const backdrop = document.querySelector('.backdrop');
const body = document.querySelector('body');
const closeModalButton = document.querySelector('.modal-close');

//MAIN
(() => {
  galleryWrapper.addEventListener('click', onGalleryClick);
})();

function onGalleryClick(event) {
  const movieCardLink = event.target.closest('a');

  if (!movieCardLink) {
    return;
  }

  event.preventDefault();

  const movieId = movieCardLink.dataset.movieId;
  const clickedMovieData = getMovieDataByID(movieId);

  console.log(clickedMovieData);
  renderModal(clickedMovieData);
}

function renderModal(movieData) {
  const {
    genre_ids: genreIDs,
    original_title: movieTitle,
    poster_path: pathToPoster,
    vote_average: vote,
    vote_count: votes,
    overview,
  } = movieData;

  window.addEventListener('keydown', onEscKeyPress);
  backdrop.addEventListener('click', onBackdropClick);
  document.body.classList.add('js-modal-is-hidden');
  closeModalButton.addEventListener('click', closeModal);

  const movieGenresString = IDsParser.idsToGenres(genreIDs);
  // const posterImgPath = ;

  //здесь подменить данные в модалке
}

function closeModal() {
  window.removeEventListener('keydown', onEscKeyPress);
  backdrop.removeEventListener('click', onBackdropClick);
  document.body.classList.remove('js-modal-is-hidden');
}

function onBackdropClick(event) {
  if (event.target === backdrop) {
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
