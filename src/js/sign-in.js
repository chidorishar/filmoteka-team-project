import 'firebase/auth';
import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const firebaseConfig = {
  apiKey: "AIzaSyCUNUISB4BvcdddHlHx25A-P_y0LZzRomY",
  authDomain: "filmoteka-auth-a4ede.firebaseapp.com",
  projectId: "filmoteka-auth-a4ede",
  storageBucket: "filmoteka-auth-a4ede.appspot.com",
  messagingSenderId: "560359018182",
  appId: "1:560359018182:web:a6a1195c4f88a57c7011c7"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const refs = {
  signInBtn: document.querySelector('.signin-btn'),
  signOutBtn: document.querySelector('.signout-btn'),
  googleUser: document.querySelector('.googleUser'),
};

refs.signInBtn.addEventListener('click', googleLogin);
refs.signOutBtn.addEventListener('click', signoutUser);

function googleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    refs.signInBtn.classList.add('btn__is-hidden');
    refs.signOutBtn.classList.remove('btn__is-hidden');
    // renderGoogleUser(user);
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    Notify.success('You have successfully signed in.', {
      timeout: 1000,
      clickToClose: true,
    });

    refs.signInBtn.classList.add('btn__is-hidden');
    refs.signOutBtn.classList.remove('btn__is-hidden');
    const uid = user.uid;
  } else {
    // User is signed out
    refs.signInBtn.classList.remove('btn__is-hidden');
    refs.signOutBtn.classList.add('btn__is-hidden');
  }
});

function signoutUser() {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("Sign - out successful.");
    refs.googleUser.style.display = "none";
    Notify.info('You have been logged out',{
      timeout: 1000,
      clickToClose: true,
    })
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });
}

// function renderGoogleUser(data){
//   refs.googleUser.innerHTML = `
//           <img class="user-img" src="${data.user.photoURL}" alt='userphoto'>
//         `
// }