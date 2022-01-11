const buttonClose = document.querySelector(".modal-close");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modal = document.querySelector(".modal");

const hideModal = () => {
  modal.style.opacity = "0";
  setTimeout(() => {
    modal.classList.add("invisible");
  }, 500);

  //se cierra el modal, aquí debería añadirse los listeners input
};

modalBackdrop.addEventListener("click", hideModal);
buttonClose.addEventListener("click", hideModal);
window.addEventListener("keydown", hideModal);
/* window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Enter")
    e.key === "Escape" && hideModal();
}); */
