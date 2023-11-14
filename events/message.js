const { Events } = require('discord.js');
const { guildId } = require('../config.json');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (message.author.bot) return

        if(message.guild.id !== guildId) return

		//message.client.lastMessage
		/*
		TODO: MARKOV, MESSAGE REACTIONS
		*/
	},
};