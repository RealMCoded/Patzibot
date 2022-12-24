const { SlashCommandBuilder } = require('@discordjs/builders');
const { powerList } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription(`Say something as PatziBot`)
		.addStringOption(string =>
			string.setName("string")
				.setRequired(true)
				.setDescription("The text to say."))
		.addStringOption(string =>
			string.setName("reply-message-id")
				.setRequired(false)
				.setDescription("The Message ID to reply to.")),
	async execute(interaction) {
		if (powerList.includes(interaction.user.id)) {
			let message, ping, replyID;
			message = interaction.options.getString('string')
			//ping = interaction.options.getBoolean('mention') || false
			replyID = interaction.options.getString('reply-message-id') || "DO-NOT"

			if (replyID == "DO-NOT") {
				await interaction.channel.send(message)
			} else {
				await interaction.channel.send({ content: message, reply: { messageReference: replyID }});
			}
			await console.log(`${interaction.user.tag} made the bot say "${message}"\n`)
			await interaction.reply({ content: "ok i said the thing u wanted me to say :)", ephemeral: true });
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};