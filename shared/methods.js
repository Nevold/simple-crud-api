const { getBaseDate, getBaseDateById, createNewPerson } = require('./utils');

const setDefaultError = (res, error = 'No data') => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(error));
};

const getValues = async (req, res) => {
  try {
    const data = await getBaseDate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } catch (error) {
    console.log(error);
  }
};

const getValuesById = async (req, res, id) => {
  try {
    const data = await getBaseDateById(id);
    if (!data) {
      // res.writeHead(404, { 'Content-Type': 'application/json' });
      // res.end(JSON.stringify('This id does not exist'));
      setDefaultError(res, 'This id does not exist');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    }
  } catch (error) {
    console.log(error);
  }
};

const setValues = async (req, res) => {
  try {
    // const newPerson = {
    //   name: 'Mike',
    //   age: 28,
    //   hobbies: ['fishing', 'hunter']
    // };

    let newPerson = '';
    req
      .on('data', chunk => {
        newPerson += chunk.toString();
      })
      .on('end', async () => {
        const { name, age, hobbies } = JSON.parse(newPerson);
        if (!name || !age || !hobbies) {
          setDefaultError(res, 'Required fields not entered');
        } else {
          const newPersonData = await createNewPerson(JSON.parse(newPerson));
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newPersonData));
        }
      });

    // const newPersonData = await createNewPerson(newPerson);
    // res.writeHead(201, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify(newPersonData));
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getValues, setDefaultError, getValuesById, setValues };
