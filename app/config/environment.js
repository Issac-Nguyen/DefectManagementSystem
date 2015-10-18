var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..'),
  lodash = require('lodash'),
  env = process.env.NODE_ENV || 'development';
var baseConfig = {
  root: rootPath,
  app: {
    name: 'dkskeleton'
  },
  smtp: {
    username: 'linhquang1986@gmail.com',
    password: '1234',
    from: 'quang@kwifi.vn'
  },
  secretJWT: 'secretDefectSystem',
  URLNotAuthenAPI: ['/api/getTokenAndUpdateNotifi', '/api/getInitInformation']
};


var config = {
  development: {
    root: rootPath,
    port: 8888,
    db: {
      'driver': 'mongoose',
      'url': 'mongodb://localhost:27017/DefectSystem',
      'username': 'phat.nguyen',
      'password': 'phat123',
      'db': 'token-auth',
      'newdb': 'token-auth',
      'host': '127.0.0.1'
    }
  },

  heroku: {

  },

  codeship: {

  },

  test: {
    root: rootPath,
    port: 3000,
    db: {
      url: 'mysql://root:root@localhost/erp_backend_test',
      host: 'localhost',
      port: 8889,
      user: 'root',
      password: 'root',
      database: 'erp_backend_test'
    }
  },

  production: {
    root: rootPath,
    port: 3000,
    db: {
      url: 'mysql://root:root@localhost/erp_backend_production',
      host: 'localhost',
      port: 8889,
      user: 'root',
      password: 'root',
      database: 'erp_backend_production'
    }
  }
};

module.exports = lodash.extend(config[env], baseConfig);