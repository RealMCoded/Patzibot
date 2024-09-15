const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription(`fake ban command`)
		.addSubcommand(subcommand =>
			subcommand
			.setName("joke")
			.setDescription(`Ban someone, but not really!`)
			.addUserOption(user =>
				user.setName("user")
					.setRequired(true)
					.setDescription("The member to \"ban\""))
			.addStringOption(reason =>
				reason.setName("reason")
					.setDescription("The reason for the \"ban\""))),
	async execute(interaction) {
		var reason = interaction.options.getString('reason')

		if (!reason) reason = "No reason specified."

		await interaction.deferReply();
		await wait(1500);
		await interaction.editReply(`✅ Banned **${interaction.options.getUser('user')}** for "**${reason}**"\n\n-# jk get trolled <:trollface:909953790977900595>`);
	},
};
  