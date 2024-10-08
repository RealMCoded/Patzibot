const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { formatUsername } = require("../../util.js")
const responses = require("../../resources/json/ask_responses.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription(`Ask PatziBot a question!`)
		.addStringOption(question =>
			question.setName("question")
				.setRequired(true)
				.setDescription("The question to ask. Under 1500 characters allowed")),
	async execute(interaction) {
		const question = interaction.options.getString('question')
		if (question.length > 1500) {await interaction.reply({content: 'Your question is over **1500** characters!', ephemeral: true}); return;}
		if (question == "" || question =="‍" || question == "​" || question == "ㅤ" || question == "⠀" || question == "_ _" || question == "** **" || question == "*** ***"){
			await interaction.reply({content: `**Tip of the day:** try actually typing something`, ephemeral: true});
		} else {
			await interaction.deferReply();
			await wait(1000);
			await interaction.editReply(`**${formatUsername(interaction.user)}**: "${interaction.options.getString('question')}"\n\n**PatziBot**: "${responses[Math.floor(Math.random() * responses.length)]}"`);
		}
	},
};