import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

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

refs.formSingIn.addEventListener('submit', e => {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;

  const UserEmail = email.value;
  const UserPassword = password.value;
  console.log(UserEmail, UserPassword);

  signInWithEmailAndPassword(auth, UserEmail, UserPassword)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });

  e.currentTarget.reset();
});

onAuthStateChanged(auth, user => {
  console.log(user);
  if (user) {
    const uid = user.uid;
  }
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

refs.btnCloseProfile.addEventListener('click', e => {
  signOut(auth);
});
