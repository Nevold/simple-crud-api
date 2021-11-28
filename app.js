require('dotenv').config();
const http = require('http');
const { getValues, getValuesById, setDefaultError, setValues, updateValuesById } = require('./shared/methods');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log('Server request');
  const id = req.url.split('/').pop();
  switch (true) {
    case req.url === '/person' && req.method === 'GET':
      getValues(req, res);
      break;
    case req.url.match(/\/person\/([0-9a-z]+)/) && req.method === 'GET':
      getValuesById(req, res, id);
      break;
    case req.url === '/person' && req.method === 'POST':
      setValues(req, res);
      break;
    case req.url.match(/\/person\/([0-9a-z]+)/) && req.method === 'PUT':
      updateValuesById(req, res, id);
      break;
    default:
      setDefaultError(res);
      break;
  }
});

server.listen(PORT, 'localhost', error => {
  error ? console.log(error) : console.log(`Server is running on port, ${PORT}`);
});
