const { SlashCommandBuilder } = require('@discordjs/builders');

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
				.setDescription("The text to say."))
		.addIntegerOption(option =>
				option.setName('inmind')
					.setDescription('in mind (Default: false)')
					.setRequired(false)
					.addChoice('True', 1)
					.addChoice('False', 0)),
	async execute(interaction) {
		const user = interaction.options.getUser('user').username
		const string = interaction.options.getString('string');
		const inMind = interaction.options.getInteger('inmind') || 0;

		if(inMind == 1) {
			await interaction.reply(`${user} (in mind): ${string}`);
		} else {
			await interaction.reply(`${user}: ${string}`);
		}
	},
};