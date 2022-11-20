const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription(`Ping the bot!`),
	async execute(interaction) {
		//interaction.deferReply()
		return interaction.editReply(`🏓 **Pong!**\nTook \`${interaction.client.ws.ping}ms\` to respond!`)
	},
};