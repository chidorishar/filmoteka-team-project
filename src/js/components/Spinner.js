export class Spinner {
  #rootEl = null;
  #selfDOMEl = null;
  #innerSpinnerEl = null;
  #selfCSSClass = null;
  #rootElPrevPositionStyleValue = null;
  #HIDE_DELAY = 250; //ms

  static POSITION_MODE = {
    FLEX_CENTRED: 'f-c',
    STICKY_CENTRED: 's-c',
  };
  #positionMode = null;

  constructor(
    rootElementSelector,
    spinnerClassToCreate,
    positioningMode = Spinner.POSITION_MODE.STICKY_CENTRED
  ) {
    this.#rootEl = document.querySelector(rootElementSelector);
    this.#selfCSSClass = spinnerClassToCreate;
    this.#positionMode = positioningMode;

    this.#render();
    this.#selfDOMEl = document.querySelector(`.${spinnerClassToCreate}`);
    this.#innerSpinnerEl = document.querySelector(
      `.${spinnerClassToCreate} .loader__spinner`
    );
    this.hide();
  }

  show() {
    //centring element vertically
    const deltaFromRootElTop = window.innerHeight / 2;
    this.setDeltaY(deltaFromRootElTop);

    this.#rootElPrevPositionStyleValue = this.#rootEl.style.position;
    this.#rootEl.style.position = 'relative';
    this.#selfDOMEl.style.display = 'flex';
    this.#selfDOMEl.style.opacity = 1;
  }

  hide() {
    this.#selfDOMEl.style.opacity = 0;
    setTimeout(() => {
      this.#selfDOMEl.style.display = 'none';
      this.#rootEl.style.position = this.#rootElPrevPositionStyleValue;
    }, this.#HIDE_DELAY);
  }

  //method for positioning the spinner along the Y axis according to root el
  setDeltaY(delta) {
    //this.#selfDOMEl.style.paddingTop = `${delta}px`;
    this.#innerSpinnerEl.style.top = `${delta}px`;
  }

  #render() {
    // prettier-ignore
    const markup = `<div class="${this.#selfCSSClass}"
        style="
          position: absolute; 
          top: 0px; 
          left: 0px;
          z-index: 2;
          display: flex; 
          justify-content: center;
          ${this.#positionMode === Spinner.POSITION_MODE.FLEX_CENTRED ? "align-items: center;" : ''}
          width: 100%;
          height: 100%; 
          transition: opacity ${this.#HIDE_DELAY}ms ease-in-out;
          background-color: var(--bg-color);
          ">
        <div class="loader__spinner" 
          style="
            ${this.#positionMode === Spinner.POSITION_MODE.FLEX_CENTRED ? "" : 'position: sticky;'}
        ">
        </div>
      </div>`;

    this.#rootEl.insertAdjacentHTML('beforeend', markup);
  }
}
