var request = require('request');

var data = {};

var url = 'http://localhost:4000/'

var options = {
  method: 'post',
  body: data,
  json: true,
  url: url
};

request(options, function (err, res, body) {
  if (err) {
    console.error('error posting json: ', err)
    throw err
  }
  var headers = res.headers
  var statusCode = res.statusCode
  console.log('headers: ', headers)
  console.log('statusCode: ', statusCode)
  console.log('body: ', body)
});
