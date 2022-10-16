import { readFromLocalStorage } from './WebStorageMethods';

export class LDStorageAPI {
  static MOVIE_INFO = {
    WATCHED: 'watched',
    QUEUED: 'queued',
    SEARCHED: 'searched',
  };

  static lastSearchRequest = null;

  static #paginationInfo = {
    page: 1,
    totalPages: null,
    MOVIES_PER_PAGE: 18,
  };

  static #activeStorage = null;
  static #activeStorageMode = null;
  static #isInLibrary = null;
  static #watched = {};
  static #queued = {};
  static #searched = [];

  static init(isInLibraryMode = false) {
    this.#watched = readFromLocalStorage(this.MOVIE_INFO.WATCHED) ?? {};
    this.#queued = readFromLocalStorage(this.MOVIE_INFO.QUEUED) ?? {};

    this.#isInLibrary = isInLibraryMode;
    if (isInLibraryMode) {
      this.#activeStorageMode = this.MOVIE_INFO.WATCHED;
      this.#activeStorage = [...Object.values(this.#watched)];
      this.#paginationInfo.totalPages = this.#countTotalPages();
    }
  }

  static getTotalPages() {
    this.#paginationInfo.totalPages = this.#countTotalPages();

    return this.#paginationInfo.totalPages;
  }

  static getMoviesByPage(pageNumber) {
    this.#paginationInfo.page = pageNumber;

    const moviesData = this.#sliceMoviesArrayByPage();

    return moviesData;
  }

  static updateActiveStorage(storageType = '') {
    if (!storageType) storageType = this.#activeStorageMode;

    this.#activeStorageMode = storageType;
    switch (storageType) {
      case this.MOVIE_INFO.QUEUED:
        this.#activeStorage = [...Object.values(this.#queued)];
        break;
      case this.MOVIE_INFO.WATCHED:
        this.#activeStorage = [...Object.values(this.#watched)];
        break;
      case this.MOVIE_INFO.SEARCHED:
        this.#activeStorage = this.#searched;
        break;
    }
  }

  static searchMoviesByName(searchRequest, searchIn) {
    if (!this.#activeStorage) return;

    const moviesData = [
      ...Object.values(
        searchIn === this.MOVIE_INFO.WATCHED ? this.#watched : this.#queued
      ),
    ];

    const filteredMoviesData = moviesData.filter(movieObj => {
      let movieName = movieObj.title ? movieObj.title : movieObj.name;
      return movieName.toLowerCase().includes(searchRequest.toLowerCase());
    });

    this.lastSearchRequest = searchRequest;
    this.#searched = filteredMoviesData;
    this.updateActiveStorage();
    return filteredMoviesData;
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
    if (this.#isInLibrary) this.updateActiveStorage();
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
    if (this.#isInLibrary) this.updateActiveStorage();
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

  static #sliceMoviesArrayByPage() {
    let fromMovie =
      (this.#paginationInfo.page - 1) * this.#paginationInfo.MOVIES_PER_PAGE;
    let toMovie =
      this.#paginationInfo.page * this.#paginationInfo.MOVIES_PER_PAGE;

    return this.#activeStorage.slice(fromMovie, toMovie);
  }

  static #countTotalPages() {
    const moviesQuantity = this.#activeStorage.length;
    const paginationPagesQuantity =
      moviesQuantity / this.#paginationInfo.MOVIES_PER_PAGE;

    return Math.ceil(paginationPagesQuantity);
  }

  static #writeObjToLS(key, obj) {
    const toAdd = JSON.stringify(obj);

    localStorage.setItem(key, toAdd);
  }
}
