const { getBaseDate, getBaseDateById, createNewPerson, updateNewPerson } = require('./utils');

const setDefaultError = (res, error = 'No data', status = '404') => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
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
  } catch (error) {
    console.log(error);
  }
};

const updateValuesById = async (req, res, id) => {
  try {
    const data = await getBaseDateById(id);
    // const re=/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/
    if (!data) {
      setDefaultError(res, 'This id does not exist');
    } else {
      const { name: oldName, age: oldAge, hobbies: oldHobbies } = JSON.parse(data);
      let newPerson = '';
      req
        .on('data', chunk => {
          newPerson += chunk.toString();
        })
        .on('end', async () => {
          const { name: updateName, age: updateAge, hobbies: updateHobbies } = JSON.parse(newPerson);

          const updatePerson = {
            name: updateName || oldName,
            age: updateAge || oldAge,
            hobbies: updateHobbies || oldHobbies
          };

          const updatePersonData = await updateNewPerson(updatePerson, id);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatePersonData));
        });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getValues, setDefaultError, getValuesById, setValues, updateValuesById };
