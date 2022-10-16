const refs = {
  signInBtn: document.querySelector('.signin-btn'),
  signUpBtn: document.querySelector('.signup-btn'),
  formBox: document.querySelector('.form-box'),
  overlayModal: document.querySelector('.overlay-modal'),
  btnCloseModal: document.querySelector('.btn-close-modal'),
};
refs.signUpBtn.addEventListener('click', function () {
  refs.formBox.classList.add('active');
  refs.overlayModal.classList.add('active');
  refs.btnCloseModal.style.transform = 'translateY(0px)';
});
refs.signInBtn.addEventListener('click', function () {
  refs.formBox.classList.remove('active');
  refs.overlayModal.classList.remove('active');
  refs.btnCloseModal.style.transform = 'translateY(50px)';
});