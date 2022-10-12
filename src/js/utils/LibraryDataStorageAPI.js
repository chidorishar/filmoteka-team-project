import { readFromLocalStorage } from './WebStorageMethods';

export class LDStorageAPI {
  static MOVIE_INFO = {
    WATCHED: 'watched',
    QUEUED: 'queued',
  };

  static paginationInfo = {
    page: 1,
    totalPages: null,
    MOVIES_PER_PAGE: 18,
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

  static getMoviesByPage(pageNumber) {
    this.paginationInfo.page = pageNumber;

    let moviesPropertiesArray = [...Object.values(this.#activeStorage)];

    let moviesData = this.#sliceMoviesArrayByPage(moviesPropertiesArray);

    return moviesData;
  }

  static setActiveStorage(storageType) {
    if (this.MOVIE_INFO.WATCHED === storageType) {
      this.#activeStorage = this.#watched;
    } else if (this.MOVIE_INFO.QUEUED === storageType) {
      this.#activeStorage = this.#queued;
    }
  }

  static #sliceMoviesArrayByPage(moviesArray) {
    // cutting sausage into slices
    let fromMovie =
      (this.paginationInfo.page - 1) * this.paginationInfo.MOVIES_PER_PAGE;
    let toMovie =
      this.paginationInfo.page * this.paginationInfo.MOVIES_PER_PAGE;

    return moviesArray.slice(fromMovie, toMovie);
  }

  static #countTotalPages() {
    const moviesQuantity = Object.keys(this.#activeStorage).length;
    const paginationPagesQuantity =
      moviesQuantity / this.paginationInfo.MOVIES_PER_PAGE;

    return Math.ceil(paginationPagesQuantity);
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
