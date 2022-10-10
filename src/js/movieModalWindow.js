import { moviesData } from './mainPage.js';

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
  console.log(movieCardLink.dataset.movieId);
  console.log(moviesData);
  console.log('qwe', event.target);
  renderModal();
}

function renderModal(movieData) {
  window.addEventListener('keydown', onEscKeyPress);
  backdrop.addEventListener('click', onBackdropClick);
  document.body.classList.add('modal-is-');
  closeModalButton.addEventListener('click', closeModal);
}

function closeModal() {
  window.removeEventListener('keydown', onEscKeyPress);
  backdrop.removeEventListener('click', onBackdropClick);
  document.body.classList.remove('show-modal');
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
  return moviesData.find(({ id }) => {
    id === ID;
  });
}

// function on
