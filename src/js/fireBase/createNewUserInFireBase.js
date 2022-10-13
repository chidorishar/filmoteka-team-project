import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCrmZQN_HzgF2oazPo7DibtRq3f0gth7Qg',
  authDomain: 'authorization-filmoteka.firebaseapp.com',
  projectId: 'authorization-filmoteka',
  storageBucket: 'authorization-filmoteka.appspot.com',
  messagingSenderId: '127184676871',
  appId: '1:127184676871:web:345e00f6fc1764a14c22a2',
};

const app = initializeApp(firebaseConfig);

const refs = {
  formSingUp: document.querySelector('.form__singup'),
};

refs.formSingUp.addEventListener('submit', e => {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;

  const newUserEmail = email.value;
  const newUserPassword = password.value;
  console.log(newUserEmail, newUserPassword);

  //Валидация контента полей формы
  //  if (newUserEmail === '' || newUserPassword === '') {
  //    Notiflix.Notify.success(`Введите данные`);

  //  }

  const auth = getAuth(app);
  createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

  e.currentTarget.reset();
});
