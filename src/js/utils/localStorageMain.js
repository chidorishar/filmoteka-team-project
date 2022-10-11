export const operationsLS = {
  MOVIE_INFO: {
    WATCHED: 'watched',
    QUEUED: 'queued',
  },

  watched: {},
  queued: {},

  /**
   * adding movie data to local storage
   * @param {Object} obj - an object (for disct)
   * @param {number} obj.id - id of obj of movie data we need to add
   * @param {Object} obj.movieData - the obj of movie data
   * @param {string} obj.storageKey - the key (where to safe (watched/ queued))
   */
  addToLocalStorage({ id, movieData, storageKey } = {}) {
    try {
      if (storageKey === this.MOVIE_INFO.WATCHED) {
        this.watched['' + id] = movieData;
        const toAdd = JSON.stringify(this.watched);
        localStorage.setItem(storageKey, toAdd);
      } else if (storageKey === this.MOVIE_INFO.QUEUED) {
        this.queued['' + id] = movieData;
        const toAdd = JSON.stringify(this.queued);
        localStorage.setItem(storageKey, toAdd);
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  /**
   * removing movie from local storage
   * @param {number} id - id of obj of movie data we need to remove
   * @param {string} storageKey - the key (where data was saved (watched/ queued))
   */
  removeFromLocalStorage(id, storageKey) {
    if (storageKey === this.MOVIE_INFO.WATCHED) {
      delete this.watched['' + id];
      const toAdd = JSON.stringify(this.watched);

      localStorage.setItem(storageKey, toAdd);
    } else if (storageKey === this.MOVIE_INFO.QUEUED) {
      delete this.queued['' + id];
      const toAdd = JSON.stringify(this.queued);

      localStorage.setItem(storageKey, toAdd);
    }
  },

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
  findInLocalStorage(id) {
    const movInf = {
      watched: !!this.watched['' + id],
      queued: !!this.queued['' + id],
    };

    return movInf;
  },
};
