// import { TMDBAPI } from './theMovieAPI';

// let tmdbAPI = null;
// let idOfMovie = null;

// (async () => {
//   tmdbAPI = new TMDBAPI();
//   let idOfMovie = null;
//   let idOfMovie1 = null;
//   let idOfMovie2 = null;
//   let idOfMovie3 = null;
//   try {
//     moviesData = (await tmdbAPI.getTopMovies()).results[0];
//     moviesData1 = (await tmdbAPI.getTopMovies()).results[1];
//     moviesData2 = (await tmdbAPI.getTopMovies()).results[2];
//     moviesData3 = (await tmdbAPI.getTopMovies()).results[3];
//     // moviesData4 = (await tmdbAPI.getTopMovies()).results[4];

//     idOfMovie = moviesData.id;
//     idOfMovie1 = moviesData1.id;
//     idOfMovie2 = moviesData2.id;
//     idOfMovie3 = moviesData3.id;
//   } catch (error) {
//     console.log('error :', error);
//   }

//   operationsLS.addToLocalStorage({
//     id: idOfMovie,
//     movieData: moviesData,
//     storageKey: 'watched',
//   });
//   operationsLS.addToLocalStorage({
//     id: idOfMovie1,
//     movieData: moviesData1,
//     storageKey: 'queued',
//   });
//   operationsLS.addToLocalStorage({
//     id: idOfMovie2,
//     movieData: moviesData2,
//     storageKey: 'watched',
//   });
//   operationsLS.addToLocalStorage({
//     id: idOfMovie3,
//     movieData: moviesData3,
//     storageKey: 'queued',
//   });
//   operationsLS.removeFromLocalStorage({
//     id: idOfMovie3,
//     storageKey: 'queued',
//   });
//   // operationsLS.readFromLocalStorage({
//   //   id: idOfMovie2,
//   // });
//   // operationsLS.readFromLocalStorage({
//   //   id: idOfMovie3,
//   // });
//   operationsLS.readFromLocalStorage({ id: idOfMovie1 });
// })();

const operationsLS = {
  MOVIE_INFO: {
    WATCHED: 'watched',
    QUEUED: 'queued',
  },

  watched: {},
  queued: {},

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

  removeFromLocalStorage({ id, storageKey } = {}) {
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

  readFromLocalStorage({ id } = {}) {
    let getResult = null;
    if (this.findInLocalStorage({ id }).watched) {
      getResult = localStorage.getItem(this.MOVIE_INFO.WATCHED);
    } else if (this.findInLocalStorage({ id }).queued) {
      getResult = localStorage.getItem(this.MOVIE_INFO.QUEUED);
    }

    return JSON.parse(getResult)[id + ''];
  },

  findInLocalStorage({ id } = {}) {
    const movInf = {
      watched: !!this.watched['' + id],
      queued: !!this.queued['' + id],
    };

    return movInf;
  },
};
