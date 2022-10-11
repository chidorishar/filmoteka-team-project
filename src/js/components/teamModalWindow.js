const refs = {
  openModalLink: document.querySelector('#open-team-modal'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
};

let isShow = false;

//MAIN
(() => {
  refs.openModalLink.addEventListener('click', onOpenModalLinkClick);
  refs.closeModalBtn.addEventListener('click', toggleModal);
  refs.modal.addEventListener('click', onBackdropClick);
  refs.modal.removeAttribute('style');
})();

function onOpenModalLinkClick(event) {
  event.preventDefault();

  toggleModal();
}

function toggleModal() {
  refs.modal.classList.toggle('is-hidden');
  document.body.classList.toggle('js-modal-is-hidden');
  isShow
    ? document.body.removeEventListener('keydown', onKeyDown)
    : document.body.addEventListener('keydown', onKeyDown);
  isShow = !isShow;
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
