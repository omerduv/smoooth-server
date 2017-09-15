const requestSearch = require('./PeopleFetcher.js').requestSearch;
const getResults = require('./PeopleFetcher.js').getResults;
const express = require('express');
const app = express();


const checkQuery = (query) => {
  return ((query.name) ||
     (query.age) ||
     (query.phone)) &&
     (query.page);
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/search', async function (req, res) {
  const query = req.query;

  if (!checkQuery(query)) {
    res.status(400).send('Bad Request');
  } else {
    requestSearch(query, (err, requestId) => {
      res.send({ 
        statusCode: (err && err.statusCode) ? err.statusCode : 200, 
        requestId
      });
    });
  }
});

app.get('/results', async function (req, res) {
  const query = req.query;
  if (!query.id) {
    res.status(400).send('Bad Request');    
  } else {  
    getResults(query, (err, results) => {
      res.send({ 
        statusCode: (err && err.statusCode == 404) ? 400 : 200, 
        results: (results) ? results : null
      });
    });
  }
});

app.listen(3001, function () {
  console.log('Person fetcher listening on port 3001!')
})