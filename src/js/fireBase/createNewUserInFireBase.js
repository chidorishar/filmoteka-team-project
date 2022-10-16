import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

  //Валидация контента полей формы
  if (newUserEmail === '' || newUserPassword === '') {
    return;
  }

  //Создание нового пользователя
  createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      NotificationAPI.addNotification(
        'user successfully logged in...',
        false,
        3000
      );
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      NotificationAPI.addNotification(
        'Incorrect mail and password',
        false,
        3000
      );
    });

  e.currentTarget.reset();
}
