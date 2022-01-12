class Timer {
  #intervalID;
  #htmlElement;
  //keeps track of current time
  #seconds;
  //stores the value the timer was first set with
  #initialSeconds;
  constructor(seconds, callbacks) {
    this.#seconds = this.#initialSeconds = seconds;
    this.#htmlElement = timerElement;

    if (callbacks) {
      this.onComplete = callbacks.onComplete;
      this.onSetTime = callbacks.onSetTime;
    }

    this.#htmlElement.addEventListener("change", this._setTime.bind(this));
    this._updateTimerValue();
  }
  getSeconds(){
    return this.#seconds;
  }
  getInitialSeconds(){
    return this.#initialSeconds;
  }
  _setTime() {
    //comprobar por decimales y números en general

    if (this.onSetTime) this.onSetTime();

    if (!this.#htmlElement.value.includes(":")) {
      //se consideran segundos
      this.#seconds = this.#initialSeconds = +this.#htmlElement.value;
    } else {
      //se convierte esa notación a minutos:segundos
      const [minute, second] = this.#htmlElement.value
        .split(":")
        .map((n) => +n);
      this.#seconds = this.#initialSeconds = minute * 60 + second;
    }
    this.#seconds = Math.floor(this.#seconds);
    if (!Number.isFinite(this.#seconds) || this.#seconds < 1) this.#seconds = 60;
    this._updateTimerValue();
  }
  _updateTimerValue() {
    const minute = String(Math.floor(this.#seconds / 60));
    const second = String(this.#seconds % 60).padStart(2, "0");
    const timeText = minute + ":" + second;
    this.#htmlElement.value = timeText;
  }
  start() {
/*     console.log(this); */
    this.#htmlElement.disabled = true;
    this.#intervalID = setInterval(this._tick.bind(this), 1000);
    this._tick();
  }
  _tick() {
    this._updateTimerValue();

    if (this.#seconds <= 0) {
      this.stop();
      this.complete();
      return;
    }
    this.#seconds--;
  }
  complete(){
    if (this.onComplete) this.onComplete();
  }
  stop() {
    this.#htmlElement.disabled = false;
    clearInterval(this.#intervalID);
  }
  reset() {
    /*     console.log(this); */
    //cuando se presione el botón reiniciar del widget
    this.stop();
    this.#seconds = 60;
    this.#initialSeconds = 60;
    this._updateTimerValue();
  }
}
