import { readFromLocalStorage } from './WebStorageMethods';

export class LDStorageAPI {
  static MOVIE_INFO = {
    WATCHED: 'watched',
    QUEUED: 'queued',
    SEARCHED: 'searched',
  };

  static paginationInfo = {
    page: 1,
    totalPages: null,
    MOVIES_PER_PAGE: 18,
  };

  static lastSearchRequest = null;
  static lastActiveMovieInfo = null;

  static #activeStorage = null;
  static #watched = {};
  static #queued = {};
  static #searched = [];

  static init() {
    this.#watched = readFromLocalStorage(this.MOVIE_INFO.WATCHED) ?? {};
    this.#queued = readFromLocalStorage(this.MOVIE_INFO.QUEUED) ?? {};
    this.#activeStorage = [...Object.values(this.#watched)];
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

    let moviesData = this.#sliceMoviesArrayByPage(this.#activeStorage);

    return moviesData;
  }

  static setActiveStorage(storageType) {
    switch (storageType) {
      case this.MOVIE_INFO.QUEUED:
        this.lastActiveMovieInfo = this.MOVIE_INFO.QUEUED;
        this.#activeStorage = [...Object.values(this.#queued)];
        break;
      case this.MOVIE_INFO.WATCHED:
        this.lastActiveMovieInfo = this.MOVIE_INFO.WATCHED;
        this.#activeStorage = [...Object.values(this.#watched)];
        break;
      case this.MOVIE_INFO.SEARCHED:
        this.#activeStorage = this.#searched;
        break;
    }
  }

  static searchInLastActiveStorageMovies(searchRequest) {
    this.setActiveStorage(this.lastActiveMovieInfo);

    let moviesPropertiesArray = [...Object.values(this.#activeStorage)];
    this.lastSearchRequest = searchRequest;

    const filteredBySearchRequestArray = moviesPropertiesArray.filter(
      movieObj => {
        let movieName = movieObj.title ? movieObj.title : movieObj.name;
        return movieName.toLowerCase().includes(searchRequest.toLowerCase());
      }
    );

    this.#searched = filteredBySearchRequestArray;
    return filteredBySearchRequestArray;
  }

  static #sliceMoviesArrayByPage(moviesArray) {
    let fromMovie =
      (this.paginationInfo.page - 1) * this.paginationInfo.MOVIES_PER_PAGE;
    let toMovie =
      this.paginationInfo.page * this.paginationInfo.MOVIES_PER_PAGE;

    return moviesArray.slice(fromMovie, toMovie);
  }

  static #countTotalPages() {
    const moviesQuantity = this.#activeStorage.length;
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
