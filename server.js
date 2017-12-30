const express = require('express');
const app = express();
app.use(express.static('client'));

const cache = require('./server/cache.js');
const getPuzzles = require('./server/getPuzzles.js');

app.get('/stats', cache(60 * 60), (req, resp) => getPuzzles().then(d => resp.send(d)));

const listener = app.listen(9001, () => console.log(`API server listening on port ${listener.address().port}`)); // eslint-disable-line no-console


