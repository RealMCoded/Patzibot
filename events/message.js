const { Events } = require('discord.js');
const Markov = require('js-markov');
const { guildId, ignoreChannels, markov } = require('../config.json');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		console.error(message)
		if (ignoreChannels.includes(message.channel.id)) return;
		if (message.author.bot) return;
        if(message.guild.id !== guildId) return;

		if (markov.enabled) {
			//logging
			let msg = message.content
			if (msg.includes("@")) return;

			msg = msg.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '')

			if (msg.length == 0) return;

			if (message.client.lastmessages > markov.contextLength) {message.client.lastmessages.shift()}

			message.client.lastmessages.push(message.content)

			//Sending
			if(Math.random() < markov.probability && message.channel.id == markov.sendChannel){
				try {
					const markov = new Markov();
		
					markov.addStates(message.client.lastmessages);
		
					markov.train();

					message.channel.send(markov.generateRandom(100))
				} catch(er) {
					console.error(er)
				}
			}
		}

		try {

		} catch(e) {

		}

		//message.client.lastMessage
		/*
		TODO: MARKOV, MESSAGE REACTIONS
		*/
	},
};