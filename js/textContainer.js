class TextContainer {
  #textArray;
  #wordsElementArray;
  #currentWordIndex = 0;
  #currentScroll = 0;
  constructor(htmlElement, text) {
    this.htmlElement = htmlElement;
    this.#textArray = text.split(" ");
    this._generateText();
  }
  reset(newText){
    this.#textArray = newText.split(" ");
    this._generateText();
    this.#currentWordIndex = 0;
    this.#currentScroll = 0;
    this.scrollToTop();
    //despintar palabras
  }
  paintCurrentWord() {
    this.#wordsElementArray.forEach((wordEl) =>
      wordEl.classList.remove("word--current")
    );

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
  getElement() {
    return this.htmlElement;
  }
  scrollToTop(){
    this.htmlElement.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
  _isInsideArea(element) {
    const { top: elementTop } = element.getBoundingClientRect();
    const firstWord = document.querySelector(".word");
    const areaHeight = Number.parseFloat(
      window.getComputedStyle(firstWord).height
    );
    const { top: areaTop } = this.htmlElement.getBoundingClientRect();
    const bottomArea = areaTop + areaHeight;
    return elementTop > bottomArea;
  }
  _generateText() {
    //clean html element
    this.htmlElement.innerHTML='';

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
    this.#wordsElementArray = [...this.htmlElement.querySelectorAll(".word")];
  }
  _scrollElementHeight(element) {
    const { top: topWordOutOfArea } = element.getBoundingClientRect();
    const { top: topContainer } = this.htmlElement.getBoundingClientRect();

    //6 píxeles menos de scroll
    this.#currentScroll += topWordOutOfArea - topContainer - 6;

    this.htmlElement.scroll({
      top: this.#currentScroll,
      behavior: "smooth",
    });
  }
}
