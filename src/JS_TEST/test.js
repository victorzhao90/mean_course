const from = require('rxjs').from;
const filter = require('rxjs/operators').filter;

const numbers = from([1, 2, 3, 4, 5]);
const evenNumbers = numbers.pipe(filter(n => n % 2 === 0));
evenNumbers.subscribe(x => console.log(x));