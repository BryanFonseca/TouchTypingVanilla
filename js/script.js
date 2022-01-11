'use strict';
class App {
  #touchTyper = new TouchTyper(textContainerElement, inputElement, resetButtonElement);
}

class TouchTyper {
  #currentWord;
  #timer;
  #isTypingLastWord;
  constructor(textContainerElement, inputElement, resetButtonElement, time = 60) {
    this.text = this._generateRandomText();
    this.textToType = new TextContainer(textContainerElement, this.text);
    this.textInput = new TextInput(inputElement);
    this.resetButton = new Reset(resetButtonElement, {
      onReset: this._onReset.bind(this),
    });
    this.#timer = new Timer(time, {
      onComplete: this._onComplete.bind(this),
      onSetTime: this._onSetTime.bind(this),
    });
    this.#isTypingLastWord = false;

    this.#currentWord = this.textToType.getNextWordInfo().word;
    this.textInput
      .getElement()
      .addEventListener("input", this._checkWord.bind(this));
    this.textInput
      .getElement()
      .addEventListener("input", this._startTyping, { once: true });
    this.textToType.paintCurrentWord();
  }
  _generateRandomText(){
    let palabras = rawText
      .split(/\t|\n/)
      .filter((_, i) => ((i + 1) % 2 === 0 ? true : false))
      .map((_, __, arr) => arr[Math.floor(Math.random() * arr.length)])
      .map((word) => word.toLowerCase())
      .join(" ");
    return palabras;
  }
  
  _onReset(){
    this.#timer.reset();
    this._reset();
    this.textInput.getElement().disabled = false;
    this.textInput.getElement().focus();
    this.textToType.getElement().style.overflowY = "auto";

    //Un evento repetido no se puede añadir varias veces, repetido quiere decir que el callback tiene la misma referencia

    //no se está añadiendo al input, se anulan
/*     this.textInput
      .getElement()
      .removeEventListener("input", prueba); */
    this.textInput
      .getElement()
      .addEventListener("input", this._startTyping, {once: true});
  }
  _reset(){
    this.textToType.reset(this._generateRandomText());
    this.#isTypingLastWord = false;
    this.#currentWord = this.textToType.getNextWordInfo().word;
    this.textToType.paintCurrentWord();
    this.textInput.getElement().value = '';
  }
  _startTyping = () => {
    //Se usa como listener
    //Al usar una arrow function, el this apunta a esta instancia
    //Se podría usar una función normal, no se repetirían (siempre y cuando no se use bind(this) porque eso crea una función con direcciones de memoria distintas, por lo que se seguirían añadiendo como listeners, ya que son diferentes, no se duplican los listeners que son iguales y que sean iguales significa que sus callbacks tienen la misma referencia)
    //Si fuera una función normal el this apuntaría al objeto que gatilla el evento
    //
    //Usar función arrow cuando se quiera el this apuntando a la instancia y se necesite que la función sea la misma (mismo espacio en memoria)
    //puede conseguirse definir el this usando bind, pero eso crea funciones con espacios de memoria diferentes, así que si se agregan varias veces, se duplicarán los listeners
    //

    //REALIZAR pruebas llamando a esta función de diferentes maneras
    //edit: la función es llamada como regular function call, y en un arrow function eso apunta a undefined
/*     console.log(this); */
    this.#timer.start();
    this.textToType.scrollToTop();
    this.textToType.getElement().style.overflowY = "hidden";
  }

  _test = () => {
    //NO se agrega al prototipo
    //Debido a que no está en el prototipo, forma parte del objeto final, y al llamarse como regular function call, se usa el this del 
    console.log(this);
  }
  _onSetTime() {
    //se llama cuando: se establece un valor nuevo en el timer
    this._reset();
    this.textInput.getElement().disabled = false;
    this.textInput.getElement().focus();
  }
  _onComplete() {
    //se llama el callback pasado al timer cuando este termina
    //esto tiene sentido porque para este punto ya no existe este listener
    //nunca estuve removiendo este listener 
/*     this.textInput
      .getElement()
      .removeEventListener("input", this._startTyping.bind(this)); */
    this.textInput
      .getElement()
      .addEventListener("input", this._startTyping, { once: true });
    this.textToType.getElement().style.overflowY = "auto";
    this.textInput.getElement().disabled = true;
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

class Reset{
  constructor(htmlElement, callbacks){
    if(callbacks){
      this.onReset = callbacks.onReset;
    }
    htmlElement.addEventListener('click', this.reset.bind(this));
  }
  reset(){
    if(this.onReset) this.onReset();
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

const timerElement = document.querySelector(".touch-typer__timer");
const textContainerElement = document.querySelector(".touch-typer__text");
const inputElement = document.querySelector(".touch-typer__input");
const resetButtonElement = document.querySelector('.touch-typer__reset-button');
const circle = document.querySelector(".background-circle");
const app = new App();
