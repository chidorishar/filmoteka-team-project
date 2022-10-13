const NOTIFICATION_DELAY = 10000;
let timeoutId = null;

const notificationEl = document.querySelector('p[js-alert]');
notificationEl.addEventListener('click', onNotificationClick);

// showNotification();

function onNotificationClick() {
  console.log('click');
  hideNotification();
  clearInterval(timeoutId);
}

function showNotification(text = '', isAlert = false) {
  notificationEl.classList.add('notification-is-visible');
  if (isAlert) notificationEl.classList.add('notification--alert');
  notificationEl.textContent = text;
  timeoutId = setInterval(() => {
    hideNotification();
  }, NOTIFICATION_DELAY);
}

function hideNotification() {
  notificationEl.classList.remove('notification-is-visible');
  notificationEl.classList.remove('notification--alert');
}
