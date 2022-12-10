const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMarkov } = require("../config.json")
const { generateMarkov } = require("../util.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-message')
		.setDescription(`Get PatziBot to generate a brand new message based off of previous messages in general.`),
	async execute(interaction) {

		if (useMarkov){
			var msg = await generateMarkov()

			if (interaction.channel.id == "929252329247608852"){
				await interaction.reply({ content: msg, ephemeral: false });
			} else {
				await interaction.channel.send(msg)
				interaction.reply({ content: "ok", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "The instance host has disabled the markov feature.", ephemeral: true });
		}
	},
};