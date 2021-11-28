const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const data = require('../data/bd.json');

const getBaseDate = async () => JSON.stringify(data);

const getBaseDateById = async id => {
  const dataById = data.find(elem => elem.id === id);
  return JSON.stringify(dataById);
};

const writeFile = async (path, data) => {
  fs.writeFile(path, JSON.stringify(data), 'utf-8', error => {
    if (error) throw error;
  });
};

const createNewPerson = async newPerson => {
  const newPersonData = { id: uuidv4(), ...newPerson };
  data.push(newPersonData);
  await writeFile('./data/bd.json', data);
  return newPersonData;
};

const updateNewPerson = async (newPerson, id) => {
  const index = data.findIndex(elem => elem.id === id);

  data[index] = { id, ...newPerson };
  await writeFile('./data/bd.json', data);
  return data[index];
};

const deleteById = async id => {
  const dataWithoutCurrentId = data.filter(elem => elem.id !== id);
  await writeFile('./data/bd.json', dataWithoutCurrentId);
};

module.exports = { getBaseDate, getBaseDateById, createNewPerson, updateNewPerson, deleteById };
