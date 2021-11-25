require('dotenv').config();
const http = require('http');
const { getValues, getValuesById, setDefaultError } = require('./shared/controlMethods');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log('Server request');
  console.log(req.url.sp);
  switch (true) {
    case req.url === '/person' && req.method === 'GET':
      getValues(req, res);
      break;
    case req.url.match(/\/person\/([0-9]+)/) && req.method === 'GET':
      const id = req.url.split('/').pop();
      getValuesById(req, res, id);
      break;
    default:
      setDefaultError(res);
      break;
  }
});

server.listen(PORT, 'localhost', error => {
  error ? console.log(error) : console.log(`Server is running on port, ${PORT}`);
});
