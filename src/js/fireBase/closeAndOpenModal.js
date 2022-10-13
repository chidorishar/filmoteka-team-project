const refs = {
  btnOpenModal: document.querySelector('.btn-open-modal'),
  btnCloseModal: document.querySelector('.btn-close-modal'),
  modalAuth: document.querySelector('.overlay-modal'),
};

refs.btnOpenModal.addEventListener('click', () => {
  refs.modalAuth.style.display = 'flex';
})

refs.btnCloseModal.addEventListener('click', () => {
  refs.modalAuth.style.display = 'none';
});