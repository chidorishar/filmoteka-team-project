import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

//Инициализация FireBase
const firebaseConfig = {
  apiKey: 'AIzaSyCrmZQN_HzgF2oazPo7DibtRq3f0gth7Qg',
  authDomain: 'authorization-filmoteka.firebaseapp.com',
  projectId: 'authorization-filmoteka',
  storageBucket: 'authorization-filmoteka.appspot.com',
  messagingSenderId: '127184676871',
  appId: '1:127184676871:web:345e00f6fc1764a14c22a2',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const refs = {
  formSingIn: document.querySelector('.form__singin'),
  btnOpenModal: document.querySelector('.btn-open-modal'),
  btnCloseProfile: document.querySelector('.btn-close-profile'),
  myLibraryPage: document.querySelector('#library'),
  modalAuth: document.querySelector('.overlay-modal'),
  btnGoOut: document.querySelector('.btn-close-profile'),
};

//Слушатель собития на форме Входа
refs.formSingIn.addEventListener('submit', userLogin);

//Функция регистрации пользователя
function userLogin(e) {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;

  const UserEmail = email.value;
  const UserPassword = password.value;
  console.log(UserEmail, UserPassword);

  //Валидация контента полей формы
  if (UserEmail === '' || UserPassword === '') {
    Notify.warning(`Введите данные`);
    return;
  }

  //Регистрация по email and login

  signInWithEmailAndPassword(auth, UserEmail, UserPassword)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      Notify.info('You have been login', {
        timeout: 1000,
        clickToClose: true,
      });
    })
    .catch(error => {
      Notify.warning('This user does not exist', {
        timeout: 1000,
        clickToClose: true,
      });
    });

  // //Регистрация по Google
  // const provider = new GoogleAuthProvider(app);
  // signInWithPopup(auth, provider)
  //   .then(result => {
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential.accessToken;

  //     const user = result.user;
  //     console.log(user);
  //   })
  //   .catch(error => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;

  //     const credential = GoogleAuthProvider.credentialFromError(error);
  //   });

  e.currentTarget.reset();
}

//Наблюдателm состояния аутентификации
onAuthStateChanged(auth, user => {
  if (user) {
    refs.btnOpenModal.style.display = 'none';
    refs.myLibraryPage.style.display = 'flex';
    refs.modalAuth.style.display = 'none';
    refs.btnGoOut.style.display = 'flex';
  } else {
    refs.btnOpenModal.style.display = 'flex';
    refs.myLibraryPage.style.display = 'none';
    refs.btnGoOut.style.display = 'none';
  }
});

//Выход пользователя с профиля
refs.btnCloseProfile.addEventListener('click', e => {
  signOut(auth);
  Notify.info('You have been logged out', {
    timeout: 1000,
    clickToClose: true,
  });
});
