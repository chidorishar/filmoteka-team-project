const NOTIFICATION_DELAY = 3000;
let timeoutId = null;

const notificationEl = document.querySelector('.js-alert');

notificationEl.addEventListener('click', onNotificationClick);

showNotification();

function onNotificationClick() {
  hideNotification();
  clearInterval(timeoutId);
}

function showNotification() {
  notificationEl.classList.add('is-visible');

  timeoutId = setInterval(() => {
    hideNotification();
  }, NOTIFICATION_DELAY);
}

function hideNotification() {
  notificationEl.classList.remove('is-visible');
}
