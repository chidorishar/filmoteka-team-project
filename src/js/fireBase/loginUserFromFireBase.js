import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';

import { NotificationAPI } from '../../js/components/NotificationAPI';

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
  btnGoogleSignIn: document.querySelector('.form__btn--google'),
  btnOpenModal: document.querySelector('.btn-open-modal'),
  btnCloseProfile: document.querySelector('.btn-close-profile'),
  myLibraryPage: document.querySelector('#library'),
  modalAuth: document.querySelector('.overlay-modal'),
  btnGoOut: document.querySelector('.btn-close-profile'),
};

//Слушатель собития на форме Входа
refs.formSingIn.addEventListener('submit', userLogin);
refs.btnGoogleSignIn.addEventListener('click', googleLogin);

//Функция регистрации пользователя
function userLogin(e) {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;

  const UserEmail = email.value;
  const UserPassword = password.value;
  // console.log(UserEmail, UserPassword);

  //Валидация контента полей формы
  if (UserEmail === '' || UserPassword === '') {
    return;
  }

  //Регистрация по email and login

  signInWithEmailAndPassword(auth, UserEmail, UserPassword)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      NotificationAPI.addNotification(
        'Incorrect mail and password',
        true,
        3000
      );
    })
    .catch(error => {
      NotificationAPI.addNotification(
        'Incorrect mail and password',
        true,
        3000
      );
    });

  e.currentTarget.reset();
}

//Наблюдателm состояния аутентификации
onAuthStateChanged(auth, user => {
  if (user) {
    refs.btnOpenModal.style.display = 'none';
    refs.myLibraryPage.style.display = 'flex';
    refs.modalAuth.classList.add('is-hidden');
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
  NotificationAPI.addNotification('You have been logged out', false, 3000);
});

function googleLogin() {
  const provider = new GoogleAuthProvider(app);
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}
