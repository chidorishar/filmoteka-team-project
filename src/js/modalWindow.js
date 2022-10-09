import {moviesData} from "./mainPage.js";

const list = document.querySelector("#movies-wrapper");
// const closeModalButton = document.querySelector();
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const body = document.querySelector("body");
const closeModalButton = document.querySelector(".modal-close");

// console.log(backdrop);

list.addEventListener("click", onOpenModal);
backdrop.addEventListener("click", onBackdropClick);

function onOpenModal(event) {
    event.preventDefault();
   if (event.target.nodeName !== "A") {
    return;
  }
    console.log(event.target.dataset.movieId
    );
    console.log(moviesData);
    console.log("qwe",event.target);
    console.log(event.currentTarget);
    window.addEventListener("keydown", onEscKeyPress);
    document.body.classList.add("show-modal");
    closeModalButton.addEventListener("click", onCloseModal);
}

function onCloseModal() {
    window.removeEventListener("keydown", onEscKeyPress);
    document.body.classList.remove("show-modal");
}

function onBackdropClick(event) {
    if (event.target === backdrop) {
        console.log(event.target);
        console.log(event.currentTurget);
        onCloseModal();
    }
}
function onEscKeyPress(event) {
    if (event.code === "Escape") {
        console.log(event.code);
        onCloseModal();
    }
}



// onOpenModal();
// onCloseModal();

// function renderCard(info) {
//     const markup = `<p>${info}</p>`;
//     modal.insertAdjacentHTML('beforeend', markup);
// }
// function fetchFilms() {
//   return fetch("https://api.themoviedb.org/3/movie/894205?api_key=a7cdca3ac9a73d688c9dec2c3c2e067b&language=en-US")
//     .then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }
// fetchFilms().then(films => {
//     console.log(films.overview);
//     onOpenModal();
//     renderCard(films.overview);
// });