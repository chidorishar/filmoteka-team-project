export class Spinner {
  #rootEl = null;
  #selfDOMEl = null;
  #innerSpinnerEl = null;
  #selfCSSClass = null;
  #rootElPrevPositionStyleValue = null;

  constructor(rootElementSelector, spinnerClassToCreate) {
    this.#rootEl = document.querySelector(rootElementSelector);
    this.#selfCSSClass = spinnerClassToCreate;

    this.#render();
    this.#selfDOMEl = document.querySelector(`.${spinnerClassToCreate}`);
    this.#innerSpinnerEl = document.querySelector(
      `.${spinnerClassToCreate} .loader__spinner`
    );
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

  //method for positioning the spinner along the Y axis according to root el
  setDeltaY(delta) {
    this.#selfDOMEl.style.paddingTop = `${delta}px`;
    this.#innerSpinnerEl.style.top = `${delta}px`;
    console.log(this.#innerSpinnerEl.style.top);
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
  }
}