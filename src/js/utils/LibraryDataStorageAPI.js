import { readFromLocalStorage } from './WebStorageMethods';

export class LDStorageAPI {
  static MOVIE_INFO = {
    WATCHED: 'watched',
    QUEUED: 'queued',
  };

  static paginationInfo = {
    page: 1,
    totalPages: null,
  };

  static #activeStorage = null;
  static #watched = {};
  static #queued = {};

  static init() {
    this.#watched = readFromLocalStorage(this.MOVIE_INFO.WATCHED) ?? {};
    this.#queued = readFromLocalStorage(this.MOVIE_INFO.QUEUED) ?? {};
    this.#activeStorage = this.#watched;
    this.paginationInfo.totalPages = this.#countTotalPages();
  }

  /**
   * adding movie data to local storage
   * @param {Object} obj - an object (for disct)
   * @param {number} obj.id - id of obj of movie data we need to add
   * @param {Object} obj.movieData - the obj of movie data
   * @param {string} obj.storageKey - the key (where to safe (watched/ queued))
   */

  static addToLocalStorage({ id, movieData, storageKey } = {}) {
    const writeToLS = this.#writeObjToLS;

    try {
      if (storageKey === this.MOVIE_INFO.WATCHED) {
        this.#watched['' + id] = movieData;
        writeToLS(storageKey, this.#watched);
      } else if (storageKey === this.MOVIE_INFO.QUEUED) {
        this.#queued['' + id] = movieData;
        writeToLS(storageKey, this.#queued);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * removing movie from local storage
   * @param {number} id - id of obj of movie data we need to remove
   * @param {string} storageKey - the key (where data was saved (watched/ queued))
   */
  static removeFromLocalStorage(id, storageKey) {
    const writeToLS = this.#writeObjToLS;

    if (storageKey === this.MOVIE_INFO.WATCHED) {
      delete this.#watched['' + id];
      writeToLS(storageKey, this.#watched);
    } else if (storageKey === this.MOVIE_INFO.QUEUED) {
      delete this.#queued['' + id];
      writeToLS(storageKey, this.#queued);
    }
  }

  static getTotalPages() {
    this.paginationInfo.totalPages = this.#countTotalPages();
    return this.paginationInfo.totalPages;
  }

  static getMovies() {
    const moviesObjectKeysArray = Object.keys(this.#activeStorage);

    let moviesPropertiesArray = this.#moviesObjectIntoPropertiesArray(
      moviesObjectKeysArray
    );

    let moviesData = this.#sliceMoviesArrayByPage(moviesPropertiesArray);

    return moviesData;
    // cutting sausage into slices
  }

  static getMoviesByPage(pageNumber) {
    this.paginationInfo.page = pageNumber;

    return this.getMovies();
  }

  static #sliceMoviesArrayByPage(moviesArray) {
    let fromMovie = (this.paginationInfo.page - 1) * 18;
    let toMovie = this.paginationInfo.page * 18;

    return moviesArray.slice(fromMovie, toMovie);
  }

  static #moviesObjectIntoPropertiesArray(keysArray) {
    const moviesPropertiesArray = keysArray.reduce(
      (allPropertiesArray, key) => {
        allPropertiesArray.push(this.#activeStorage[key]);

        return allPropertiesArray;
      },
      []
    );

    return moviesPropertiesArray;
  }

  static #countTotalPages() {
    const moviesQuantity = Object.keys(this.#activeStorage).length;
    const paginationPagesQuantity = moviesQuantity / 18;

    return paginationPagesQuantity === 0
      ? paginationPagesQuantity
      : Math.ceil(paginationPagesQuantity);
  }

  static #setActiveStorage(storageValue) {
    if (this.#activeStorage === storageValue) return;
    else {
      this.#activeStorage = storageValue;
    }
  }

  /**
   * Shows if we have the movie in local storage
   * @param {number} id  id of obj of movie we need to find
   * @returns {Object} object of information about storing the film
   */
  static findInLocalStorage(id) {
    const movInf = {
      watched: !!this.#watched['' + id],
      queued: !!this.#queued['' + id],
    };

    return movInf;
  }

  static #writeObjToLS(key, obj) {
    const toAdd = JSON.stringify(obj);

    localStorage.setItem(key, toAdd);
  }
}
