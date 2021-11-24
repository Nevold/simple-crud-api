const data = require('../data/base.json');
const getBaseDate = () => {
  return new Promise((resolve, reject) => {
    resolve(JSON.stringify(data));
  });
};

module.exports = { getBaseDate };
