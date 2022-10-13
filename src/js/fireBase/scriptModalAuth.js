const signInBtn = document.querySelector('.signin-btn');
const signUpBtn = document.querySelector('.signup-btn');
const formBox = document.querySelector('.form-box');
const overlayModal = document.querySelector('.overlay-modal');

signUpBtn.addEventListener('click', function () {
  formBox.classList.add('active');
  overlayModal.classList.add('active');
});

signInBtn.addEventListener('click', function () {
  formBox.classList.remove('active');
   overlayModal.classList.remove('active');
});
