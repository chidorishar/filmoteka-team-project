const refs = {
  btnOpenModal: document.querySelector('.btn-open-modal'),
  btnCloseModal: document.querySelector('.btn-close-modal'),
  modalAuth: document.querySelector('.overlay-modal'),
};

export let isVisible = false;

refs.btnOpenModal.addEventListener('click', toggleModal);
refs.btnCloseModal.addEventListener('click', toggleModal);
refs.modalAuth.addEventListener('click', onBackdropClick);
refs.modalAuth.style.display = 'flex';

export function toggleModal() {
  document.body.classList.toggle('js-modal-is-hidden');
  refs.modalAuth.classList.toggle('is-hidden');
  isVisible
    ? document.body.removeEventListener('keydown', onKeyDown)
    : document.body.addEventListener('keydown', onKeyDown);
  // refs.modalAuth.style.display = 'none';
  isVisible = !isVisible;
}

function onBackdropClick(event) {
  if (event.target != event.currentTarget) {
    return;
  }
  toggleModal();
}

function onKeyDown(event) {
  event.code === 'Escape' ? toggleModal() : null;
}
