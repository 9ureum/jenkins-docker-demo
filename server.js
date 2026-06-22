const http = require('http');

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || 'dev';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Hello from Jenkins Docker demo!',
    version: VERSION,
    time: new Date().toISOString(),
  }));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, version ${VERSION}`);
});
