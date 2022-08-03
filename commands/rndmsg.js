const { SlashCommandBuilder } = require('@discordjs/builders');
const perm = require('./powerList.json');
const rndmsg = require('./resources/json/randommsg.json');
const Markov = require('js-markov');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-message')
		.setDescription(`Send a random message.`),
	async execute(interaction) {
		if (perm.includes(interaction.user.id)) {
			/*
			await console.log(`${interaction.user.tag} requested that i send a random message\n`)
			const randomIndex = Math.floor(Math.random() * (rndmsg.length - 1) + 1);
			interaction.channel.send(rndmsg[randomIndex])
			*/
			fs.readFile('markov.txt', function(err, data) {
				var markov = new Markov();
				let arr = new Array();

				if(err) throw err;

				const parr = data.toString().replace(/\r\n/g,'\n').split('\n');

				for(let i of parr) {if(i.length > 0) arr.push(i);}

				markov.addStates(arr);

				markov.train();

				var txt = markov.generateRandom(100);

				interaction.channel.send(txt)
				console.log(`[INFO] New markov generated! ${txt}\n`)
				interaction.reply({ content: "ok", ephemeral: true });
			});
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};