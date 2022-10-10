class LocalStorageUtil {
  constructor() {
    this.keyName = 'watched';
  }


  putFilms(film) {
    let watched = this.getFilms();
    let pushFilm = false;
    const index = watched.indexOf(film.id);
    console.log(watched);
    console.log(film.id);

    if (watched.find(obj => obj.id === film.id)) {
      watched.splice(index, 1);
    } else {
      watched.push(film);
      pushFilm = true;
    }

    localStorage.setItem(this.keyName, JSON.stringify(watched));

    return { pushFilm, watched };
  }
}

const localStorageUtil = new LocalStorageUtil();
