require('dotenv').config();
const http = require('http');
const {
  getValues,
  getValuesById,
  setDefaultError,
  setValues,
  updateValuesById,
  deleteValuesById
} = require('./shared/methods');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const id = req.url.split('/').pop();
  const pathArray = req.url.split('/').length;
  switch (true) {
    case pathArray > 3:
      setDefaultError(res);
      break;
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
    case req.url.match(/\/person\/([0-9a-z]+)/) && req.method === 'DELETE':
      deleteValuesById(req, res, id);
      break;
    default:
      setDefaultError(res);
      break;
  }
});

server.listen(PORT, 'localhost', error => {
  error ? console.log(error) : console.log(`Server is running on port, ${PORT}`);
});
