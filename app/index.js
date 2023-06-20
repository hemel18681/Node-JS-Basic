const calc = require('./calc')

const numberstToAdd = [3, 4, 10, 2];

const result = calc.sum(numberstToAdd)

console.log(`The result is: ${result}`)

module.exports.result = result

