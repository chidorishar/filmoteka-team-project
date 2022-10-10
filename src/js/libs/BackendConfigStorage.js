import { TMDBAPI } from './TMDBAPI';
import { readFromLocalStorage } from '../utils/WebStorageMethods';

export class BackendConfigStorage {
  static #PATH_TO_POSTER_SS_KEY = 'PP-KEY';
  static #GENRES_DATA_LS_KEY = 'genres-data';
  static #GET_MODE = {
    PATH: 'path',
    GENRES_IDS: 'gi',
  };
  static #genresAndIDs = null;
  static #pathToPoster = null;

  constructor() {
    BackendConfigStorage.#pathToPoster ??= readFromSessionStorage(
      BackendConfigStorage.#PATH_TO_POSTER_SS_KEY
    );
  }

  static async init() {
    const POSTER_SS_KEY = BackendConfigStorage.#PATH_TO_POSTER_SS_KEY;
    const GENRES_DATA_LS_KEY = BackendConfigStorage.#GENRES_DATA_LS_KEY;
    const FETCH_MODES = BackendConfigStorage.#GET_MODE;
    let pathToPoster = BackendConfigStorage.#pathToPoster;
    let genresAndIDs = BackendConfigStorage.#genresAndIDs;

    //try to get data from storage
    pathToPoster ??= sessionStorage.getItem(POSTER_SS_KEY);
    genresAndIDs ??= readFromLocalStorage(GENRES_DATA_LS_KEY);

    //try get data from backend
    if (!pathToPoster) {
      pathToPoster = await BackendConfigStorage.#getDataFromBackend(
        FETCH_MODES.PATH
      );
      //save path to SS
      sessionStorage.setItem(POSTER_SS_KEY, pathToPoster);
    }
    if (!genresAndIDs) {
      genresAndIDs = await BackendConfigStorage.#getDataFromBackend(
        FETCH_MODES.GENRES_IDS
      );
      //save ids to LS
      localStorage.setItem(GENRES_DATA_LS_KEY, JSON.stringify(genresAndIDs));
    }
    BackendConfigStorage.#pathToPoster = pathToPoster;
    BackendConfigStorage.#genresAndIDs = genresAndIDs;
  }

  static get genresAndIDs() {
    return BackendConfigStorage.#genresAndIDs;
  }

  static get pathToPoster() {
    return BackendConfigStorage.#pathToPoster;
  }

  static async #getDataFromBackend(mode) {
    const tmdbAPI = new TMDBAPI();
    let res = null;

    try {
      //get from backend
      if (mode === BackendConfigStorage.#GET_MODE.PATH)
        res = (await tmdbAPI.getConfiguration()).images.secure_base_url;
      else res = (await tmdbAPI.getGenresData()).genres;
    } catch (error) {
      console.log(error.message);
    }

    return res;
  }
}
