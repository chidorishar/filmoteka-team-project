export const MOVIE_INFO = {
  WATCHED: 'watched',
  QUEUED: 'queued',
};

const watched = {};
const queued = {};

export function saveToLS(id, data, where) {
  if (where === MOVIE_INFO.WATCHED) watched['' + id] = data;
  else queued['' + id] = data;

  console.log('Save: ', watched, queued);
}

export function removeFromLS(id, from) {
  from === MOVIE_INFO.WATCHED
    ? delete watched['' + id]
    : delete queued['' + id];

  console.log('Delete: ', watched, queued);
}

export function getMovieLSInfo(id) {
  const res = {
    watched: !!watched['' + id],
    queued: !!queued['' + id],
  };

  console.log('Res: ', res);

  return res;
}
