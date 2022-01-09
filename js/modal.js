const buttonClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modal = document.querySelector('.modal');

const hideModal = () => {
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.classList.add('invisible');
  }, 500);
}

modalBackdrop.addEventListener('click', () => hideModal());
buttonClose.addEventListener('click', () => hideModal());
