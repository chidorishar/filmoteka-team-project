const NOTIFICATION_DELAY = 3000;
let timeoutId = null;

const notificationEl = document.querySelector('p[js-alert]');
notificationEl.addEventListener('click', onNotificationClick);

// showNotification();

function onNotificationClick() {
  hideNotification();
  clearInterval(timeoutId);
}

function showNotification() {
  notificationEl.classList.add('notification-is-visible');
  notificationEl.textContent = 'Ось що нам вдалось найти';
  timeoutId = setInterval(() => {
    hideNotification();
  }, NOTIFICATION_DELAY);
}

function hideNotification() {
  notificationEl.classList.remove('notification-is-visible');
}
