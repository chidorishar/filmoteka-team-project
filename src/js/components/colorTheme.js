const switchButton = document.querySelector('#theme-button');
switchButton.onclick = toggleTheme;

getTheme();

function getTheme() {
  const theme = localStorage.getItem('theme');
  theme && setTheme(theme);
  if (theme === 'dark')
    switchButton.classList.toggle('theme-button--dark-mode');
}

function setTheme(theme) {
  document.documentElement.className = theme;
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const theme = document.documentElement.classList.contains('dark')
    ? 'light'
    : 'dark';
  switchButton.classList.toggle('theme-button--dark-mode');
  setTheme(theme);
}
