const { SHA3 } = require('sha3');

const randChars = "qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*())-_+={}|[]\\`~<>?,./;:\'\"";
const n = randChars.length;

const generateRandKey = (email) => {
  const timeInHex = (Date.now()).toString(16);
  let input = email +timeInHex;

  //add random characters to the front and end of string
  const randLen = Math.floor(Math.random() * 7)+11;
  for (let i = 0; i < randLen; i++) {
    input += randChars[Math.floor(Math.random()*n)];
  }
  const randLen2 = Math.floor(Math.random() * 23)+3;
  for (let i = 0; i < randLen2; i++) {
    input = randChars[Math.floor(Math.random()*n)] + input;
  }

  //generate hash
  const hash = new SHA3(512);
  hash.update(input);
  const key = hash.digest('hex');
  return key;
}

module.exports = generateRandKey;