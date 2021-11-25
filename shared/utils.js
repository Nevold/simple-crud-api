const data = require('../data/base.json');
const getBaseDate = () => {
  return new Promise((resolve, reject) => {
    resolve(JSON.stringify(data));
  });
};

const getBaseDateById = id => {
  return new Promise((resolve, reject) => {
    const dataById = data.find(elem => elem.id === id);
    resolve(JSON.stringify(dataById));
  });
};

module.exports = { getBaseDate, getBaseDateById };
