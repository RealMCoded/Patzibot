const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription(`Restart the bot`),
	async execute(interaction) {
		if (interaction.user.id == 284804878604435476) {
			console.warn("Restarting bot!")
			interaction.reply({ content: "Restarting...", ephemeral: false });
			process.exit()
		} else {
			await interaction.reply({ content: "This command can only be used by <@284804878604435476>.", ephemeral: true });
		}
	},
};