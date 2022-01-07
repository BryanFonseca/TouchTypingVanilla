/* const palabras =
  "Esto es un texto de ejemplo porque es un ejemplo y está siendo un texto a la vez la premisa es sencilla pero no bilateral siguen siendo dos cosas completamente diferentes y estoy intentando que esto sea lo más largo posible estoy seguro de que hola mamá como estás yo igual te voy a sacar de esta basura de país"; */
const palabras = "Hoy no se considera";
class App {
  #touchTyper = new TouchTyper(textContainer, inputElement, palabras);
  constructor() {}
}

class Timer {
  #intervalID;
  constructor(seconds) {
    this.seconds = seconds;
  }
  start() {
    this.#intervalID = setInterval(this._tick.bind(this), 1000);
  }
  _tick() {
    if (this.seconds <= 0) return;
    this.seconds--;
    console.log(this.seconds);
  }
  stop() {
    clearInterval(this.#intervalID);
  }
}

class TouchTyper {
  #currentWord;
  #timer;
  #isTypingLastWord;
  constructor(textContainerElement, inputElement, text) {
    this.textToType = new TextArea(textContainerElement, text);
    this.textInput = new TextInput(inputElement);
    this.#timer = new Timer(10);
    this.#isTypingLastWord = false;

    this.#currentWord = this.textToType.getNextWordInfo().word;
    this.textInput
      .getElement()
      .addEventListener("input", this._checkWord.bind(this));
    this.textInput
      .getElement()
      .addEventListener("input", this._startTimer.bind(this), { once: true });
    this.textToType.paintCurrentWord();

    /*     this.textInput.getElement().addEventListener('input', function(){
      document.styleSheets[0].insertRule('::-webkit-scrollbar-thumb{background: transparent !important}')
    }, {once: true}); */
  }
  _startTimer() {
    this.#timer.start();
  }
  _checkWord() {
    const typedText = this.textInput.getElement().value;

    //hay algún espacio
    /*     const anySpace = typedText.includes(' '); */

    //el modo precisión es recomendado para textos con signos de puntuación, donde se requiere ser 100% preciso
    //el modo normal está orientado a usarse con palabras idealmente aleatorias

    //modo precisión
    /*     if (typedText === this.#currentWord + " " || anySpace) { */
    if (typedText === this.#currentWord + " ") {
      //la palabra escrita es correcta después de pulsar espacio

      if (this.#isTypingLastWord) {
        //Se escribió la última palabra
        console.log("fin");
        this.#timer.stop();
      }

      const wordInfo = { ...this.textToType.getNextWordInfo() };
      this.#currentWord = wordInfo.word;
      this.#isTypingLastWord = wordInfo.isLast;

      const currentWordElement = this.textToType.getWordElementByIndex(
        this.textToType.getCurrentWordIndex()
      );
      this.textToType.centerWordInContainer(currentWordElement);
      this.textInput.getElement().value = "";
      this.textToType.paintCurrentWord();
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
  #currentScroll = 0;
  #textArray;
  #currentWordIndex = 0;
  #breakArea;
  #wordsElementArray;
  constructor(htmlElement, text) {
    this.htmlElement = htmlElement;
    this.#textArray = text.split(" ");
    this._generateText();
    this.#breakArea = this._generateArea();
    this.#wordsElementArray = [...this.htmlElement.querySelectorAll(".word")];
  }
  paintCurrentWord() {
    this.#wordsElementArray.forEach((wordEl) => wordEl.classList.remove("word--current"));

    if (this.#currentWordIndex > this.#textArray.length) return;

    this.htmlElement
      .querySelectorAll(".word")
      [this.#currentWordIndex - 1].classList.add("word--current");
  }
  paintCharacter(charIndex, isCorrect) {
    // prettier-ignore
    const charElementsArray = [...this.#wordsElementArray[this.#currentWordIndex - 1].children];

    charElementsArray.forEach((char) => {
      char.classList.remove("char--correct");
      char.classList.remove("char--wrong");
    });

    if (!isCorrect) return;

    charElementsArray.slice(0, charIndex).forEach((char) => {
      char.classList.add(`char--${isCorrect}`);
    });
  }
  centerWordInContainer(element) {
    if (!element) return;
    if (this._isInsideArea(element)) {
      this._scrollElementHeight(element);
    }
  }
  getNextWordInfo() {
    //se usa contador para no mutar el array con unshift
    const word = this.#textArray[this.#currentWordIndex];
    this.#currentWordIndex++;
    const wordInfo = {
      isLast: this.getCurrentWordIndex() === this.#textArray.length - 1,
      word,
    };
    return wordInfo;
  }
  getWordElementByIndex(index) {
    return this.#wordsElementArray[index];
  }
  getCurrentWordIndex() {
    //esto puede llamarse cuando termine el tiempo en el objeto TouchTyper para saber cuántas palabras se escribieron
    return this.#currentWordIndex - 1;
  }
  _isInsideArea(element) {
    //top is distance from top of the viewport to the element
    const { top: elementTop } = element.getBoundingClientRect();
    const { top: breakAreaTop } = this.#breakArea.getBoundingClientRect();
    const areaHeight = Number.parseFloat(
      window.getComputedStyle(this.#breakArea).height
    );
    const bottomArea = breakAreaTop + areaHeight;

    /*     if (elementTop > bottomArea) {
      console.log("Fuera del áre'");
    } else {
      console.log("Dentro del área");
    } */

    return elementTop > bottomArea;
  }
  _generateText() {
    /*     this.#textArray.forEach((word) => {
      const markedUpWords = [...word]
        .map((char) => `<span class="char">${char}</span>`)
        .join("");
      const html = `<span class="word">${markedUpWords}</span>`;
      this.htmlElement.insertAdjacentHTML("beforeend", html);
    }); */
    const markedUpWords = this.#textArray
      .map((word) => {
        const markedUpChars = [...word]
          .map((char) => `<span class="char">${char}</span>`)
          .join("");
        const html = `<span class="word">${markedUpChars}</span>`;
        return html;
      })
      .join("");
    this.htmlElement.insertAdjacentHTML("beforeend", markedUpWords);
  }
  _generateArea() {
    //
    const firstWord = document.querySelector(".word");
    const breakArea = document.createElement("div");
    const component = document.querySelector(".touch-typer");
    breakArea.classList.add("break-area");
    breakArea.style.height = window.getComputedStyle(firstWord).height;
    breakArea.style.width = "100%";
    component.insertBefore(breakArea, textContainer);
    return breakArea;
  }
  _scrollElementHeight(element) {
    const { top: topWordOutOfArea } = element.getBoundingClientRect();
    const { top: topContainer } = this.htmlElement.getBoundingClientRect();

    this.#currentScroll += topWordOutOfArea - topContainer - 5;

    this.htmlElement.scroll({
      top: this.#currentScroll,
      behavior: "smooth",
    });
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
const app = new App();
//El scroll va a estar desactivado mientras está corriendo el tiempo
