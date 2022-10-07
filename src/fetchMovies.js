const SEARCH_URL = 'https://api.themoviedb.org/3/search/company';
const KEY = 'abcfdf4888b5d5a909ef440a87808432';
let page = 1;

export async function fetchByName(movieName) {
  const response = await fetch(
    `${SEARCH_URL}?api_key=${KEY}&query=${movieName}&page=${page}`
  );
  const films = await response.json();
  return films;
}
