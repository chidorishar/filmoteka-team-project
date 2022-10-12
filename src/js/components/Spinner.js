export class Spinner {
  #rootEl = null;
  #selfDOMEl = null;
  #selfCSSClass = null;
  #rootElPrevPositionStyleValue = null;

  constructor(rootElementSelector, spinnerClassToCreate) {
    this.#rootEl = document.querySelector(rootElementSelector);
    this.#selfCSSClass = spinnerClassToCreate;

    this.#render();
    this.#selfDOMEl = document.querySelector(`.${spinnerClassToCreate}`);
    this.hide();
  }

  show() {
    this.#rootElPrevPositionStyleValue = this.#rootEl.style.position;
    this.#rootEl.style.position = 'relative';
    this.#selfDOMEl.style.display = 'flex';
  }

  hide() {
    this.#selfDOMEl.style.display = 'none';
    this.#rootEl.style.position = this.#rootElPrevPositionStyleValue;
  }

  #render() {
    // prettier-ignore
    const markup =
      `<div class="${this.#selfCSSClass}"
        style="
          position: absolute; 
          top: 0px; 
          left: 0px; 
          display: flex; 
          justify-content: center;
          padding: 50px; 
          width: 100%;
          height: 100%; 
          background-color: rgb(255, 255, 255);">
        <div class="loader__spinner" 
          style="
            position: sticky; 
            top: 50px;
        ">
        </div>
      </div>`;

    this.#rootEl.insertAdjacentHTML('beforeend', markup);
    console.log(this.#rootEl);
  }
}
