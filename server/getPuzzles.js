const request = require('request-promise');
const { DateTime } = require('luxon');
const Promise = require('bluebird');

const DOMAIN = 'nyt-games-prd.appspot.com';
const API = `https://${DOMAIN}/svc/crosswords/`;
const HEADERS = {
  'nyt-s': process.env.NYT_SECRET, // eslint-disable-line no-undef  
  authority: DOMAIN,
};
const TODAY = DateTime.local();

function lookupTimes(puzzles) {
  function lookupTime(d) {
    return request({
      uri: `${API}/v6/game/${d.id}.json`,
      headers: HEADERS,
      json: true,
    })
      .then(data => {
        d.time = data.calcs.secondsSpentSolving / 60;
        return d;
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console 
  }
  return Promise.all(puzzles.map(d => lookupTime(d))).then(() => puzzles);
}

function getPuzzles(endDate = TODAY) {
  // NYT API limits the number of puzzles that it will return at a time; so chunk by months, walking backwards from today
  const startDate = endDate.minus({ months: 1 });
  return request({
    uri: `${API}/v3/0/puzzles.json`,
    qs: {
      date_start: startDate.plus({ days: 1 }).toISODate(), // eslint-disable-line camelcase
      date_end: endDate.toISODate(), // eslint-disable-line camelcase
    },
    headers: HEADERS,
    json: true,
  })
    .then(data => {
      const solvedPuzzles = data.results
        .filter(d => d.solved)
        .map(d => ({
          date: d.print_date,
          day: DateTime.fromISO(d.print_date).toFormat('c'),
          id: d.puzzle_id,
        }));
      return lookupTimes(solvedPuzzles).then(() => {
        if (solvedPuzzles.length === 0) {
          return solvedPuzzles;
        }
        return getPuzzles(startDate).then(d => solvedPuzzles.concat(d));
      });
    });
}

module.exports = getPuzzles;
