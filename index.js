const protect = require('static-auth');

// https://github.com/flawyte/static-auth
// https://github.com/flawyte/now-basic-auth/blob/master/node-static-auth/now.json
// https://dev.to/daksamit/deploy-static-vuepress-site-using-now-sh-and-basic-authentication-2ci2

const route = '/';
const { USERNAME, PASSWORD } = process.env;
const isAuthenticated = (user, pass) => (user === USERNAME && pass === PASSWORD);
const options = {
  directory: __dirname + '/build'
};

const app = protect(route, isAuthenticated, options);

module.exports = app;