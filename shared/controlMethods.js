const { getBaseDate } = require('./utils');

const getValues = async (req, res) => {
  try {
    const data = await getBaseDate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } catch (error) {
    console.log(error);
  }
};
// const getValues = async (req, res, data) => {
//   await console.log('object');
// };

module.exports = { getValues };
