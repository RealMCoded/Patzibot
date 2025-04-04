const { Events } = require('discord.js');
const Markov = require('js-markov');
const { random } = require("../util.js")
const { changePatzicoins } = require("../patzicoin-functions/patzicoin.js")
const { guildId, ignoreChannels, markov } = require('../config.json');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (ignoreChannels.includes(message.channel.id)) return;
		if (message.author.bot) return;
        if(message.guild.id !== guildId) return;

		if (markov.enabled) {
			//logging
			let msg = message.content
			if (msg.includes("@")) return;
			if (message.client.lastmessages.includes(msg)) return;

			msg = msg.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '')

			if (msg.length == 0) return;
			
			if (message.client.lastmessages.length >= markov.contextLength) {message.client.lastmessages.shift()}

			message.client.lastmessages.push(message.content)

			//Sending
			if(Math.random() < markov.probability && message.channel.id == markov.sendChannel && message.client.lastmessages.length >= markov.minTokensToGenerate){
				try {
					const markov = new Markov();
		
					markov.addStates(message.client.lastmessages);
		
					markov.train();

					let genMessage = markov.generateRandom(100)

					message.channel.send(genMessage + `\n-# This message was randomly generated based off of the last ${message.client.lastmessages.length} messages sent in the server.`)

					console.log(`New markov generated: ${genMessage}`)

				} catch(er) {
					console.error(er)
				}
			}
		}

		try {
			//PatziCoin for talking
			changePatzicoins(message.author.id, random(5))
			message.client.chattedRecently.add(message.author.id);
			setTimeout(() => {
				// Removes the user from the set after 60 seconds
				message.client.chattedRecently.delete(message.author.id);
				}, 60000);
		} catch(e) {

		}
	},
};