// import './js/***.js';
class LocalStorageUtil {
  constructor({ name, date, poster, genre }) {
    this.keyName = 'films';
  }

    getFilms() {
        const filmsLocalStorage = localStorage.getItem(this.keyName);
        if (filmsLocalStorage !== null) {
            return JSON.parse(filmsLocalStorage);
        }
        return []
  }

  getFilms() {}
}

const localStorageUtil = new LocalStorageUtil();

const a = localStorageUtil.getFilms();
console.log(a)