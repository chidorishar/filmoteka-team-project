// const signInBtn = document.querySelector('.signin-btn');
// const signUpBtn = document.querySelector('.signup-btn');
// const formBox = document.querySelector('.form-box');
// const overlayModal = document.querySelector('.overlay-modal');
//
// signUpBtn.addEventListener('click', function () {
//   formBox.classList.add('active');
//   overlayModal.classList.add('active');
// });
//
// signInBtn.addEventListener('click', function () {
//   formBox.classList.remove('active');
//    overlayModal.classList.remove('active');
// });

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