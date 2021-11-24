require('dotenv').config();
const http = require('http');
// const data = require('./data/base.json');
const { getValues } = require('./shared/controlMethods');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log('Server request');
  if (req.url === '/person' && req.method === 'GET') {
    getValues(req, res);
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ massege: 'No data' }));
  }
});

server.listen(PORT, 'localhost', error => {
  error ? console.log(error) : console.log(`Server is running on port, ${PORT}`);
});
