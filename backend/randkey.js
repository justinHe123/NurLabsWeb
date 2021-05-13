const { v4: uuidv4 } = require('uuid');

const generateRandKey = () => {
  return uuidv4();
}

module.exports = generateRandKey;