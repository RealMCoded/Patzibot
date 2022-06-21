const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription(`run js code`)
		.addStringOption(string =>
			string.setName("str")
				.setRequired(true)
				.setDescription("string 2 eval"))
		.addIntegerOption(option => 
				option.setRequired(true)
					.setName("showresult")
					.setDescription("is slef")
					.addChoice(`Show`, 1)
					.addChoice(`Hide`, 0)),
	async execute(interaction) {
		if (interaction.user.id == 284804878604435476) {
			const evl = eval(interaction.options.getString('str'));
			if (interaction.options.getInteger('showResult') == 1) {
				await interaction.reply({ content: `\`\`\`eval\`\`\``, ephemeral: false });
			} else {
				await interaction.reply({ content: `\`\`\`eval\`\`\``, ephemeral: true });
			}
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};