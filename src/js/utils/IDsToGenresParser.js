import { BackendConfigStorage } from '../libs/BackendConfigStorage.js';

export class IDsParser {
  constructor() {}

  /**
   *Function that takes array with IDs and return string, that contain all genres corresponding to passed IDs
   * @param {string []} ids - array that contains IDs in string format.
   * @param {Object[]} genresAndIdsObj - array of objects.
   * @param {number} genresAndIdsObj[].id id
   * @param {string} genresAndIdsObj[].name - contain genre's name decoded with id
   *
   * @returns {string} string that contains all genres combined together and separated with comma: 'genre-1, genre-2'.
   */
  static idsToGenres(ids) {
    if (!ids) return '';
    return ids
      .reduce((acc, id) => {
        const genre = this.#findGenreByID(id);

        return genre ? (acc += `${genre}, `) : acc;
      }, '')
      .slice(0, -2);
  }

  static #findGenreByID(idToFind) {
    const foundedName = BackendConfigStorage.genresAndIDs?.find(
      ({ id }) => id === idToFind
    )?.name;

    return foundedName;
  }
}
