const express = require('express');
const request = require('request-promise');
const { DateTime } = require('luxon');
const Promise = require("bluebird");
const mcache = require('memory-cache');

const app = express();  
app.use(express.static('public'));

const DOMAIN = 'nyt-games-prd.appspot.com';
const API = `https://${DOMAIN}/svc/crosswords/`;
const HEADERS = {
    'nyt-s': process.env.NYT_SECRET,
    'authority': DOMAIN
  }
const TODAY = DateTime.local();

function lookupTimes(puzzles) {
  function lookupTime(d) {
    return request({
      uri: `${API}/v6/game/${d.id}.json`,
      headers: HEADERS,
      json: true
    })
    .then((data) => {
      d.time = data.calcs.secondsSpentSolving / 60
      return d
    })
    .catch((err) => console.log(err));
  }
  return Promise.all(puzzles.map((d) => lookupTime(d))).then(() => puzzles);
}

function getSolvedPuzzles(endDate = TODAY) {
  // NYT API limits the number of puzzles that it will return at a time; so chunk by months, walking backwards from today
  const startDate = endDate.minus({months: 1});
  return request({
    uri: `${API}/v3/0/puzzles.json`,
    qs: {
      'date_start': startDate.toISODate(),
      'date_end': endDate.toISODate()
    },
    headers: HEADERS,
    json: true
  })
  .then((data) => {
    var solvedPuzzles = data.results
      .filter((d) => d.solved)
      .map((d) => ({ 
          date: d.print_date,
          day: DateTime.fromISO(d.print_date).toFormat('c'),
          id: d.puzzle_id
      }));
    console.log(endDate.toISODate(), solvedPuzzles.length);
    return lookupTimes(solvedPuzzles).then(() => {
      if (solvedPuzzles.length === 0) {
        return solvedPuzzles;
      } else {
        return getSolvedPuzzles(startDate).then((d) => solvedPuzzles.concat(d));
      };
    });
  }); 
}

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__'+ req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  }
}
      
app.get("/", (req, resp) => 
  resp.sendFile(__dirname + '/views/index.html')
);

app.get("/stats", cache(60*60), (req, resp) => 
  getSolvedPuzzles().then((d) => resp.send(d))
);

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

