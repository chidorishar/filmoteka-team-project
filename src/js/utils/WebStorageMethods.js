export function readFromLocalStorage(key) {
  const item = localStorage.getItem(key);

  return parseJson(item);
}

export function readFromSessionStorage(key) {
  const item = sessionStorage.getItem(key);

  return parseJson(item);
}

function parseJson(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}
