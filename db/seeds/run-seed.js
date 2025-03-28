const ENV = process.env.NODE_ENV || 'development';
const data = ENV === 'production'
    ? require('../data/development-data/index.js')
    : require('../data/development-data/index.js');

const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  return seed(data).then(() => db.end());
};

runSeed();
