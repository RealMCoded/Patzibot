const { SlashCommandBuilder } = require('@discordjs/builders');
const quotes = require("./resources/json/quotes.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('random quote lol - stolen from @PatziQuotes'),
	async execute(interaction) {
		await interaction.reply(quotes[Math.floor(Math.random() * (quotes.length))])
	},
};