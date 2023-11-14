const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get how long it takes for the bot to reply!'),
	async execute(interaction) {
		await interaction.reply(`🏓 **Pong!**\nTook \`${interaction.client.ws.ping}ms\` to respond!`);
	},
};