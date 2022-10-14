import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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
  formSingUp: document.querySelector('.form__singup'),
};

//Слушатель собития на форме Регистрации
refs.formSingUp.addEventListener('submit', userRegistration);

function userRegistration(e) {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;

  const newUserEmail = email.value;
  const newUserPassword = password.value;
  console.log(newUserEmail, newUserPassword);

  //Валидация контента полей формы
  if (newUserEmail === '' || newUserPassword === '') {
    Notify.warning(`Введите данные`);
    return;
  }

  //Создание нового пользователя
  createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      Notify.info('You have successfully registered', {
        timeout: 1000,
        clickToClose: true,
      });
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Notify.warning('Incorrect mail and password', {
        timeout: 1000,
        clickToClose: true,
      });
    });

  e.currentTarget.reset();
}
