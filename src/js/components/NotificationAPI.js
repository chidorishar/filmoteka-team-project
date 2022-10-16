export class NotificationAPI {
  static #NOTIFICATION_HIDE_DELAY = 10000;
  static #DELETE_NOTIFICATION_EL_DELAY = 250;
  static #numberOfMessages = 0;
  static #notifTimeoutsIds = {};

  static #notificationListEl;

  static {
    this.#notificationListEl = null;
  }

  constructor() {}

  static init(rootElSelector, deltaYFromTop = 150) {
    //adding root el for messages
    const markup = `<ul class="notif-list" id='notif-list-root'></ul>`;
    document
      .querySelector(rootElSelector)
      .insertAdjacentHTML('afterbegin', markup);
    document.querySelector('#notif-list-root').style.top = `${deltaYFromTop}px`;

    this.#notificationListEl = document.querySelector('.notif-list');
    this.#notificationListEl.addEventListener(
      'click',
      this.#onNotificationClick
    );
  }

  static #onNotificationClick = e => {
    if (e.target.nodeName !== 'P') return;

    this.clearNotification(e.target.dataset.notifId);
  };

  static addNotification = (
    text = '',
    isAlert = false,
    visibleDuration = null
  ) => {
    if (this.#numberOfMessages > 100) this.#numberOfMessages = 0;
    this.#numberOfMessages++;

    visibleDuration ??= this.#NOTIFICATION_HIDE_DELAY;
    //render markup
    const id = this.#numberOfMessages;
    // prettier-ignore
    const markup = `
    <li class="notif-list__item">
      <p class="
          notif-list__text
          ${isAlert ? 'notif-list__text--alert' : ''}
          notif-list__text--is-visible" 
        data-notif-id=${id}>
        ${text}
      </p>
    </li>
    `;
    this.#notificationListEl.insertAdjacentHTML('beforeend', markup);

    //hide notification after timeout
    this.#notifTimeoutsIds['' + id] = setTimeout(() => {
      this.clearNotification(id);
    }, visibleDuration);

    return id;
  };

  static clearNotification = id => {
    if (!this.#notifTimeoutsIds['' + id]) return;

    clearInterval(this.#notifTimeoutsIds['' + id]);
    delete this.#notifTimeoutsIds['' + id];

    const notificationEl = document.querySelector(`p[data-notif-id="${id}"]`);
    notificationEl.classList.remove('notif-list__text--is-visible');
    //completely remove notification message el from DOM
    setTimeout(() => {
      notificationEl.closest('li').remove();
    }, this.#DELETE_NOTIFICATION_EL_DELAY);
  };
}
