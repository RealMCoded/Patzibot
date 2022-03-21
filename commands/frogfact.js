const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frogfact')
		.setDescription('Get a fun frog fact!'),
	async execute(interaction) {
		await interaction.reply({ content: "I'm still learning how to answer frog related questions!", ephemeral: true });
	},
};