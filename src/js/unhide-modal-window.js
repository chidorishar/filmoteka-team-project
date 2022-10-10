const refs = {
  modalMovie: document.getElementById('movieModal'),
  modalTeam: document.getElementById('backdrop'),
  linkModalTeam: document.getElementById('open-team-modal'),
};

refs.modalMovie.addEventListener('click', unhideModalWindowFilm);
refs.linkModalTeam.addEventListener('click', unhideModalWindowTeam);

function unhideModalWindowFilm() {
  refs.modalMovie.removeAttribute('style');
}

function unhideModalWindowTeam() {
  refs.modalTeam.removeAttribute('style');
}
