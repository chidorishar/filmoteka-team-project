// (() => {
//     const refs = {
//       openModalBtn: document.querySelector("[data-modal-open]"),
//       closeModalBtn: document.querySelector("[data-modal-close]"),
//       modal: document.querySelector("[data-modal]"),
//     };
  
//     refs.openModalBtn.addEventListener("click", toggleModal);
//     refs.closeModalBtn.addEventListener("click", toggleModal);
  
//     function toggleModal() {
//       refs.modal.classList.toggle("is-hidden");
//     }
//   })();

(() => {
  const refs = {
    openModalBtn: document.querySelector("[data-modal-open]"),
    closeModalBtn: document.querySelector("[data-modal-close]"),
    modal: document.querySelector("[data-modal]"),
  };

  let isShow = false;

  refs.openModalBtn.addEventListener("click", toggleModal);
  refs.closeModalBtn.addEventListener("click", toggleModal);
  refs.modal.addEventListener('click', onBackdropClick);

  function toggleModal() {
    refs.modal.classList.toggle("is-hidden");
    document.body.classList.toggle('js-modal-is-hidden');
    isShow
      ? document.body.removeEventListener('keydown', onKeyDown)
      : document.body.addEventListener('keydown', onKeyDown);
    isShow = !isShow;
  }
  function onBackdropClick(event) {
    if (event.target != event.currentTarget) {
      return;
    }
    toggleModal();
  }

  function onKeyDown(event) {
    event.code === 'Escape' ? toggleModal() : none;
  }
})();