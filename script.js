const palabras =
  "Lorem Consectetur esse corrupti aspernatur nesciunt quidem? Fuga officia cupiditate odit in eveniet Ipsam iusto vel iste magnam est, at minima Dolorem perspiciatis ducimus voluptatem nesciunt temporibus Debitis nulla dignissimos dolor Elit deleniti repellendus numquam unde quisquam Tenetur alias corporis quae eum architecto minus. Corporis laudantium rem dolorum accusantium sed cupiditate aliquid? Ratione deserunt illum illum ipsum minima Nesciunt a maxime. lorem Amet iste corporis commodi consequatur commodi. Obcaecati sunt cum rem sunt repudiandae Eveniet magnam aperiam amet quae perferendis iste Dolore aperiam laudantium id omnis tenetur Non commodi nisi officiis accusamus? lorem Amet reiciendis recusandae illum optio in! Unde quia omnis fugiat laborum perferendis! Exercitationem officia consectetur numquam doloribus rerum. Nam illo ducimus praesentium impedit itaque iusto quibusdam quas atque Harum amet.";
class App {
  #touchTyper = new TouchTyper(textContainer, inputElement, palabras);
  constructor() {}
}

class TouchTyper {
  #currentWord;
  constructor(textContainerElement, inputElement, text) {
    this.textToType = new TextArea(textContainerElement, text);
    this.textInput = new TextInput(inputElement);
    this.#currentWord = this.textToType.getNextWord();

    this.textInput
      .getElement()
      .addEventListener("input", this._checkWord.bind(this));
  }
  _checkWord() {
    const typedText = this.textInput.getElement().value;
    //modo precisión
    if (this.#currentWord + " " === typedText) {
      //la palabra escrita es correcta después de pulsar espacio
      this.#currentWord = this.textToType.getNextWord();
      //aquí debería comprobarse si la nueva palabra está dentro del área y si no lo está, hacer scroll
      this.textInput.getElement().value = "";
      this.textToType.paintTypedWord();
      return;
    }

    const wordChunk = this.#currentWord.slice(0, typedText.length);
    if (typedText === wordChunk) {
      this.textToType.paintCharacter(typedText.length, "correct");
    } else {
      this.textToType.paintCharacter(typedText.length, "wrong");
    }
  }

  //Podría intentar usar una factory function para los modos
  _precisionMode() {}
  _normalMode() {}
}

class TextArea {
  #textArray;
  #currentWordIndex = 0;
  constructor(htmlElement, text) {
    this.htmlElement = htmlElement;
    this.#textArray = text.split(" ");

    this._generateText();
    //aquí se debe generar el area
    this._generateArea();
  }
  paintTypedWord(){
    this.htmlElement.querySelectorAll('.word')[this.#currentWordIndex - 2].classList.add('word--typed');
  }
  paintCharacter(charIndex, isCorrect) {
    // prettier-ignore
    const charElementsArray = [...this.htmlElement.querySelectorAll(".word")[this.#currentWordIndex - 1].children];

    charElementsArray.forEach((char) => {
      char.classList.remove("char--correct");
      char.classList.remove("char--wrong");
    });

    if (!isCorrect) return;

    charElementsArray.slice(0, charIndex).forEach((char) => {
      char.classList.add(`char--${isCorrect}`);
    });
  }
  _generateText() {
    this.#textArray.forEach((word) => {
      const markedUpWords = [...word]
        .map((char) => `<span class="char">${char}</span>`)
        .join("");
      const html = `<span class="word">${markedUpWords}</span>`;
      this.htmlElement.insertAdjacentHTML("beforeend", html);
    });
  }
  _generateArea() {
    //
  }
  getNextWord() {
    //se usa contador para no mutar el array con unshift
    const word = this.#textArray[this.#currentWordIndex];
    this.#currentWordIndex++;
    return word;
  }
}

class TextInput {
  constructor(htmlElement) {
    this.htmlElement = htmlElement;
  }
  getElement() {
    return this.htmlElement;
  }
}

const textContainer = document.querySelector(".touch-typer__text-container");
const inputElement = document.querySelector(".touch-typer__input");
const component = document.querySelector(".touch-typer");

const app = new App();

/* const firstWord = document.querySelector(".word");
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
isInsideArea(breakArea, targetAbove); */
