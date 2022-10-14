import { TMDBAPI } from './TMDBAPI.js';
import { readFromLocalStorage } from '../utils/WebStorageMethods.js';

export class BackendConfigStorage {
  static #tmdbAPI = new TMDBAPI();

  static #PATH_TO_POSTER_SS_KEY = 'PP-KEY';
  static #GENRES_DATA_LS_KEY = 'genres-data';
  static #GET_MODE = {
    PATH: 'path',
    GENRES_IDS: 'gi',
  };
  static #genresAndIDs = null;
  static #pathToPoster = null;

  constructor() {}

  static async init() {
    const POSTER_SS_KEY = this.#PATH_TO_POSTER_SS_KEY;
    const GENRES_DATA_LS_KEY = this.#GENRES_DATA_LS_KEY;
    const FETCH_MODES = this.#GET_MODE;
    let pathToPoster = this.#pathToPoster;
    let genresAndIDs = this.#genresAndIDs;

    //try to get data from storage
    pathToPoster ??= sessionStorage.getItem(POSTER_SS_KEY);
    genresAndIDs ??= readFromLocalStorage(GENRES_DATA_LS_KEY);

    //try get data from backend
    if (!pathToPoster) {
      pathToPoster = await this.#getDataFromBackend(FETCH_MODES.PATH);
      //save path to SS
      sessionStorage.setItem(POSTER_SS_KEY, pathToPoster);
    }
    if (!genresAndIDs) {
      genresAndIDs = await this.#getDataFromBackend(FETCH_MODES.GENRES_IDS);
      //save ids to LS
      localStorage.setItem(GENRES_DATA_LS_KEY, JSON.stringify(genresAndIDs));
    }
    this.#pathToPoster = pathToPoster;
    this.#genresAndIDs = genresAndIDs;
  }

  static get genresAndIDs() {
    return this.#genresAndIDs;
  }

  static get pathToPoster() {
    return this.#pathToPoster;
  }

  static async #getDataFromBackend(mode) {
    let res = null;

    try {
      //get from backend
      res =
        mode === this.#GET_MODE.PATH
          ? (await this.#tmdbAPI.getConfiguration()).images.secure_base_url
          : (await this.#tmdbAPI.getGenresData()).genres;
    } catch (error) {
      console.log(error.message);
    }

    return res;
  }
}
