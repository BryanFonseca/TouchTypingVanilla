const textContainer = document.querySelector(".touch-typer__text-container");
const component = document.querySelector(".touch-typer");

const palabras =
  "Lorem Consectetur esse corrupti aspernatur nesciunt quidem? Fuga officia cupiditate odit in eveniet Ipsam iusto vel iste magnam est, at minima Dolorem perspiciatis ducimus voluptatem nesciunt temporibus Debitis nulla dignissimos dolor Elit deleniti repellendus numquam unde quisquam Tenetur alias corporis quae eum architecto minus. Corporis laudantium rem dolorum accusantium sed cupiditate aliquid? Ratione deserunt illum illum ipsum minima Nesciunt a maxime. lorem Amet iste corporis commodi consequatur commodi. Obcaecati sunt cum rem sunt repudiandae Eveniet magnam aperiam amet quae perferendis iste Dolore aperiam laudantium id omnis tenetur Non commodi nisi officiis accusamus? lorem Amet reiciendis recusandae illum optio in! Unde quia omnis fugiat laborum perferendis! Exercitationem officia consectetur numquam doloribus rerum. Nam illo ducimus praesentium impedit itaque iusto quibusdam quas atque Harum amet.";
const palabrasArr = palabras.split(" ");

//generar area

palabrasArr.forEach((palabra) => {
  const html = `<span class="word">${palabra}</span>`;
  textContainer.insertAdjacentHTML("beforeend", html);
});

const firstWord = document.querySelector(".word");
const breakArea = document.createElement("div");
breakArea.classList.add("break-area");
breakArea.style.height = window.getComputedStyle(firstWord).height;
breakArea.style.width = "100%";
component.insertBefore(breakArea, textContainer);

//El scroll va a estar desactivado mientras está corriendo el tiempo

//Está dentro de área?
function isInsideArea(area, element) {
  const { top: elementTop } = element.getBoundingClientRect();
  const { top: breakAreaTop } = area.getBoundingClientRect();
  const areaHeight = Number.parseFloat(window.getComputedStyle(area).height);
  const bottomArea = breakAreaTop + areaHeight;
  console.log("word top", elementTop);
  console.log("break area top", bottomArea);

  const wordTopMargin = Number.parseFloat(
    window.getComputedStyle(element).marginTop
  );
  const wordHeight =
    Number.parseFloat(window.getComputedStyle(element).height) +
    wordTopMargin * 2;

  console.log(textContainer.scrollTop);

  if (elementTop > bottomArea) {
    console.log("La palabra actual está fuera del area");
    //Se necesita hacer scroll
    textContainer.scroll({
      top: textContainer.scrollTop + wordHeight,
      behavior: "smooth",
    });
  } else {
    console.log("DENTRO");
  }
}

function scrollElementHeight(container, element) {
  const topMargin = Number.parseFloat(
    window.getComputedStyle(element).marginTop
  );
  const height =
    Number.parseFloat(window.getComputedStyle(element).height) + topMargin * 2;
  container.scroll({
    top: container.scrollTop + height,
    behavior: "smooth",
  });
}

const targetBelow = document.querySelector(
  ".touch-typer__text-container > .word:nth-child(6)"
);
const targetAbove = document.querySelector(".word");
isInsideArea(breakArea, targetAbove);
