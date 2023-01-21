const { SlashCommandBuilder } = require('@discordjs/builders');
const quotes = require("./resources/json/quotes.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Quotes stolen from @PenisClass')
		.addIntegerOption(option => 
			option.setRequired(false)
				.setName("quote-id")
				.setDescription("The ID of the quote")),
	async execute(interaction) {
		let quoteID;

		if (interaction.options.getInteger('quote-id') < -1) {interaction.reply({ content: "⚠️ **ID must be greater than -1!**", ephemeral: true }); return;}
		if (interaction.options.getInteger('quote-id') > quotes.length) {interaction.reply({ content: `⚠️ **ID must be less than ${quotes.length}!**`, ephemeral: true }); return;}

		quoteID = interaction.options.getInteger('quote-id') || Math.floor(Math.random() * (quotes.length)) 
		await interaction.reply(`Quote ID: \`${quoteID}\`\n${quotes[quoteID]}`)
	},
};