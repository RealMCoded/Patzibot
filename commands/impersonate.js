const { SlashCommandBuilder } = require('@discordjs/builders');
const perm = require('./powerList.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('impersonate')
		.setDescription(`impersonate someone`)
		.addUserOption(string =>
			string.setName("user")
				.setRequired(true)
				.setDescription("The member to impersonate."))
		.addStringOption(string =>
			string.setName("string")
				.setRequired(true)
				.setDescription("The text to say.")),
	async execute(interaction) {
		await interaction.reply(`\\*in ${interaction.options.getUser('user').username} voice\\* ${interaction.options.getString('string')}`);
	},
};