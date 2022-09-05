const { SlashCommandBuilder } = require('@discordjs/builders');
const perm = require('./powerList.json');
const rndmsg = require('./resources/json/randommsg.json');
const Markov = require('js-markov');
const fs = require('node:fs');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-message')
		.setDescription(`Get PatziBot to generate a brand new message based off of previous messages in general.`),
	async execute(interaction) {
		if (interaction.channel.id == "929252329247608852"){
			fs.readFile('markov.txt', function(err, data) {
				var markov = new Markov();
				let arr = new Array();

				if(err) throw err;

				const parr = data.toString().replace(/\r\n/g,'\n').split('\n');

				for(let i of parr) {if(i.length > 0) arr.push(i);}

				markov.addStates(arr);

				markov.train();

				var txt = markov.generateRandom(100);

				interaction.reply({ content: txt, ephemeral: false });
			});
		} else {
			fs.readFile('markov.txt', function(err, data) {
				var markov = new Markov();
				let arr = new Array();

				if(err) throw err;

				const parr = data.toString().replace(/\r\n/g,'\n').split('\n');

				for(let i of parr) {if(i.length > 0) arr.push(i);}

				markov.addStates(arr);

				markov.train();

				var txt = markov.generateRandom(100);

				interaction.channel.sendTyping()

				wait(3500)

				interaction.channel.send(txt)
				console.log(`[INFO] New markov generated! ${txt}\n`)
				interaction.reply({ content: "ok", ephemeral: true });
			});
		}
	},
};