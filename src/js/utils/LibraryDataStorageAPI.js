import { readFromLocalStorage } from './WebStorageMethods';

export class LDStorageAPI {
  static MOVIE_INFO = {
    WATCHED: 'watched',
    QUEUED: 'queued',
  };

  static #watched = {};
  static #queued = {};

  static init() {
    this.#watched = readFromLocalStorage(this.MOVIE_INFO.WATCHED) ?? {};
    this.#queued = readFromLocalStorage(this.MOVIE_INFO.QUEUED) ?? {};
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

  // /**
  //  * gettting movie data from local storaage
  //  * @param {number} id - id of obj of movie we need to get
  //  * @returns {Object} - the movie we were lookimg for
  //  */
  // readFromLocalStorage(id) {
  //   let getResult = null;
  //   if (this.findInLocalStorage(id).watched) {
  //     getResult = localStorage.getItem(this.MOVIE_INFO.WATCHED);
  //   } else if (this.findInLocalStorage({ id }).queued) {
  //     getResult = localStorage.getItem(this.MOVIE_INFO.QUEUED);
  //   }

  //   return JSON.parse(getResult)[id + ''];
  // },

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
