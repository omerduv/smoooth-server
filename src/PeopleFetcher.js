const request = require('request');
const withQuery = require('with-query');

const KLARNA_API = 'http://eksercise-api.herokuapp.com/people';
const KLARNA_KEY = `${process.env.KLARNA_KEY}`;

const headers = {
  'accept': 'application/json',
  'X-KLARNA-TOKEN': KLARNA_KEY,
}

const perfromRequest = (query, method, validStatusCode, callback) => {
  const requestParams = getRequestParams(query, method);
  request(requestParams, (err, res) => {
    if (err) {
      callback(err);
    } else {
      if (res.statusCode !== validStatusCode) {
        callback({ statusCode: res.statusCode });
      } else {
        result = JSON.parse(res.body);
        callback(null, result);
      }
    }
  });
}

const getRequestParams = (url, method) => {
  return Object.assign({}, { headers }, { url, method })
}

const requestSearch = (queryParams, callback) => {
  const query = withQuery(KLARNA_API + '/search', queryParams);
  perfromRequest(query, 'POST', 201, callback);
}

const getResults = (queryParams, callback) => {
  const query = withQuery(KLARNA_API, { searchRequestId: queryParams.id });
  perfromRequest(query, 'GET', 200, callback);  
}

module.exports.requestSearch = requestSearch;
module.exports.getResults = getResults;