const { SlashCommandBuilder } = require('@discordjs/builders');
const perm = require('./powerList.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription(`Say something as PatziBot`)
		.addStringOption(string =>
			string.setName("string")
				.setRequired(true)
				.setDescription("The text to say.")),
	async execute(interaction) {
		if (perm.includes(interaction.user.id)) {
			await interaction.channel.send(interaction.options.getString('string'))
			await console.log(`${interaction.user.tag} made the bot say "${interaction.options.getString('string')}"\n`)
			await interaction.reply({ content: "ok i said the thing u wanted me to say :)", ephemeral: true });
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};