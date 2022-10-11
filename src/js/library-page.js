// import './js/***.js';

import { GalleryAPI } from './components/GalleryAPI';
import { TMDBAPI } from './libs/TMDBAPI';
import { BackendConfigStorage } from './libs/BackendConfigStorage.js';

let galleryAPI = null;

refs = {
  btnWatched: document.querySelector('#watched'),
  btnQueue: document.querySelector('#queue'),
  galleryContainer: document.querySelector('#gallery-container'),
};

const defaultRenderLibraryPage = onclickBtnWatched();

refs.btnWatched.addEventListener('click', onclickBtnWatched);
refs.btnQueue.addEventListener('click', onclickBtnQueue);

//Дефолтный текст в контейнере галереи если нет в локал сторедже ключа Watched
const contentEmptyLocalStorageWatched = document.createElement('p');
contentEmptyLocalStorageWatched.style.fontSize = '24px';
contentEmptyLocalStorageWatched.style.textAlign = 'center';
contentEmptyLocalStorageWatched.innerHTML =
  '"Вы не посмотрели ни одного фильма"';
refs.galleryContainer.prepend(contentEmptyLocalStorageWatched);

//Функция на клик по кнопке Watched
function onclickBtnWatched(e) {
  // MAIN
  (async () => {
    try {
      tmdbAPI = new TMDBAPI();
      await BackendConfigStorage.init();

      galleryAPI = new GalleryAPI('#movies-wrapper');

      let stringFromLocalStorage = localStorage.getItem('watched');

      let objFromLocalStorage = JSON.parse(stringFromLocalStorage);
      let filmsFromLocalStorage = Object.values(objFromLocalStorage);

      refs.btnQueue.removeAttribute('disabled');
      refs.btnWatched.setAttribute('disabled', true);

      refs.btnWatched.classList.add('btn-active');
      refs.btnQueue.classList.remove('btn-active');

      if (contentEmptyLocalStorageQueue) {
        contentEmptyLocalStorageQueue.remove();
      }

      refs.galleryContainer.prepend(contentEmptyLocalStorageWatched);
      if (filmsFromLocalStorage.length !== 0) {
        contentEmptyLocalStorageWatched.remove();
      }
      galleryAPI.renderMoviesCards(filmsFromLocalStorage);
    } catch (error) {
      console.log(error.message);
    }
  })();
}

//Дефолтный текст в контейнере галереи если нет в локал сторедже ключа Queue
const contentEmptyLocalStorageQueue = document.createElement('p');
contentEmptyLocalStorageQueue.style.fontSize = '24px';
contentEmptyLocalStorageQueue.style.textAlign = 'center';
contentEmptyLocalStorageQueue.innerHTML =
  '"Вы еще не добавили ни одного фильма к просмотру"';
refs.galleryContainer.prepend(contentEmptyLocalStorageQueue);

//Функция на клик по кнопке Queue
function onclickBtnQueue(e) {
  // MAIN
  (async () => {
    try {
      tmdbAPI = new TMDBAPI();
      await BackendConfigStorage.init();

      galleryAPI = new GalleryAPI('#movies-wrapper');

      let stringFromLocalStorage = localStorage.getItem('queued');
      let objFromLocalStorage = JSON.parse(stringFromLocalStorage);
      let filmsFromLocalStorage = Object.values(objFromLocalStorage);

      refs.btnWatched.removeAttribute('disabled');
      refs.btnQueue.setAttribute('disabled', true);

      refs.btnQueue.classList.add('btn-active');
      refs.btnWatched.classList.remove('btn-active');

      if (contentEmptyLocalStorageWatched) {
        contentEmptyLocalStorageWatched.remove();
      }

      refs.galleryContainer.prepend(contentEmptyLocalStorageQueue);
      if (filmsFromLocalStorage.length !== 0) {
        contentEmptyLocalStorageQueue.remove();
      }
      galleryAPI.renderMoviesCards(filmsFromLocalStorage);
    } catch (error) {
      console.log(error.message);
    }
  })();
}
