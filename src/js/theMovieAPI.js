export class TMDBAPI {
  #API_KEY = 'a7cdca3ac9a73d688c9dec2c3c2e067b';
  #BASE_URL = 'https://api.themoviedb.org/3';

  #FETCH_MODES = {
    TOP: 'TOP',
    NAME: 'NAME',
  };

  #moviesByNameQueryOptions = {
    URL: `${this.#BASE_URL}/search/movie`,
    includeAdult: false,
    name: '',
    page: 1,
  };

  #topMoviesQueryOptions = {
    URL: `${this.#BASE_URL}/trending/all`,
    timeWindow: 'week',
    page: 1,
  };

  constructor() {}

  async getConfiguration() {
    const query = `${this.#BASE_URL}/configuration?api_key=${this.#API_KEY}`;

    return await this.#fetchByQuery(query);
  }

  async getMoviesByName(searchName) {
    if (searchName) {
      this.#moviesByNameQueryOptions.name = searchName;
      this.#moviesByNameQueryOptions.page = 1;
    }

    const response = await this.#fetchMovies(this.#FETCH_MODES.NAME);

    return response;
  }

  async getMoviesByNameFromPage(pageNumber) {
    this.#moviesByNameQueryOptions.page = pageNumber;

    return await this.getMoviesByName('');
  }

  async getTopMovies() {
    const response = await this.#fetchMovies(this.#FETCH_MODES.TOP);

    return response;
  }

  async getTopMoviesFromPage(pageNumber) {
    this.#topMoviesQueryOptions.page = pageNumber;

    return await this.getTopMovies();
  }

  async #fetchMovies(mode) {
    const byNameOptions = this.#moviesByNameQueryOptions;
    const byTopOptions = this.#topMoviesQueryOptions;

    // prettier-ignore
    const query =
      mode === this.#FETCH_MODES.TOP
        ? `${byTopOptions.URL}/${byTopOptions.timeWindow}?api_key=${this.#API_KEY}&page=${byTopOptions.page}`
        : `${byNameOptions.URL}?api_key=${this.#API_KEY}&page=${byNameOptions.page}&query=${byNameOptions.name}
          &include_adult=${byNameOptions.includeAdult}`;

    return await this.#fetchByQuery(query);
  }

  async #fetchByQuery(query) {
    const response = await fetch(query);

    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  get currentPageByName() {
    return this.#moviesByNameQueryOptions.page;
  }

  get currentPageByTop() {
    return this.#topMoviesQueryOptions.page;
  }

  get lastSearchedName() {
    return this.#moviesByNameQueryOptions.name;
  }
}
