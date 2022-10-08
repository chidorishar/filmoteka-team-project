export class IDsParser {
  #genresAndIdsObj = null;

  constructor(genresAndIdsObj) {
    this.#genresAndIdsObj = genresAndIdsObj;
  }

  /**
   *Function that takes array with IDs and return string, that contain all genres corresponding to passed IDs
   * @param {string []} ids - array that contains IDs in string format.
   * @param {Object[]} genresAndIdsObj - array of objects.
   * @param {number} genresAndIdsObj[].id id
   * @param {string} genresAndIdsObj[].name - contain genre's name decoded with id
   *
   * @returns {string} string that contains all genres combined together and separated with comma: 'genre-1, genre-2'.
   */
  idsToGenres(ids) {
    return ids
      .reduce((acc, id) => {
        const genre = this.#findGenreByID(id);

        return genre ? (acc += `${genre}, `) : acc;
      }, '')
      .slice(0, -2);
  }

  #findGenreByID(idToFind) {
    const foundedName = this.#genresAndIdsObj.find(
      ({ id }) => id === idToFind
    )?.name;

    return foundedName;
  }
}
