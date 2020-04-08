const protect = require('static-auth');

const route = '/';
const { USERNAME, PASSWORD } = process.env;
const isAuthenticated = (user, pass) => (user === USERNAME && pass === PASSWORD);
const options = {
  directory: __dirname + '/build'
};

const app = protect(route, isAuthenticated, options);

module.exports = app;


// Serve on localhost if asked to.
// NOTE: This only used for testing locally, this is NOT needed nor used by Now once deployed.
if (process.env.SERVE === 'true') {
  const http = require('http');
  const server = http.createServer(app);
  server.listen(4444, () => console.log('Listening on port 4444...'));
}