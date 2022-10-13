const NOTIFICATION_HIDE_DELAY = 10000;
const DELETE_NOTIFICATION_EL_DELAY = 250;
let numberOfMessages = 0;
const notifTimeoutsIds = {};

const notifListEl = document.querySelector('.notif-list');
notifListEl.addEventListener('click', onNotificationClick);

function onNotificationClick(e) {
  if (e.target.nodeName !== 'P') return;

  hideNotification(e.target.dataset.notifId);
}

export function addNotification(
  text = '',
  isAlert = false,
  visibleDuration = NOTIFICATION_HIDE_DELAY
) {
  if (numberOfMessages > 100) numberOfMessages = 0;
  numberOfMessages++;

  //render markup
  // prettier-ignore
  const id = numberOfMessages;
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
  notifListEl.insertAdjacentHTML('beforeend', markup);

  //hide notification after timeout
  notifTimeoutsIds['' + id] = setTimeout(() => {
    hideNotification(id);
  }, visibleDuration);

  return id;
}

export function hideNotification(id) {
  clearInterval(notifTimeoutsIds['' + id]);
  delete notifTimeoutsIds['' + id];

  const notificationEl = document.querySelector(`p[data-notif-id="${id}"]`);
  notificationEl.classList.remove('notif-list__text--is-visible');
  setTimeout(() => {
    notificationEl.closest('li').remove();
  }, DELETE_NOTIFICATION_EL_DELAY);
}
