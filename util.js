/*
    This contains multiple shared functions that are used in the bot multiple times.
*/

const Markov = require('js-markov');
const fs = require('node:fs');

module.exports = {
    async generateMarkov(){
        let test = new Promise(function(resolve) {
            fs.readFile('markov.txt', function(err, data) {
                try {
                    var markov = new Markov();
                    let arr = new Array();
    
                    if(err) throw err;
    
                    const parr = data.toString().replace(/\r\n/g,'\n').split('\n');
    
                    for(let i of parr) {if(i.length > 0) arr.push(i);}
    
                    markov.addStates(arr);
    
                    markov.train();
    
                    let txt = markov.generateRandom(100);				
                    console.log(`New markov generated: "${txt}"\n`)
                    resolve(txt)
                } catch(er) {
                    console.error(er)
                    throw err;
                }
            })
        })
        return test;
    },

    validateExpression(number) {
		return /^[+\-/*^0-9().]+$/.test(number)
	},

    random_range(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    },

    random(number) {
        return Math.floor(Math.random() * number)
    },
}