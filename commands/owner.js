const { SlashCommandBuilder } = require('@discordjs/builders');
const { hostID } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owner')
		.setDescription(`owner commands`)
		.addSubcommand(subcommand => 
			subcommand.setName('eval')
			.setDescription(`Executes JavaScript code. Only usable by the bot owner!`)
			.addStringOption(string =>
				string.setName("str")
					.setRequired(true)
					.setDescription("string 2 eval"))
			.addIntegerOption(option => 
					option.setRequired(true)
						.setName("showresult")
						.setDescription("is slef")
						.addChoice(`Show`, 1)
						.addChoice(`Hide`, 0)))
		.addSubcommand(subcommand => 
			subcommand.setName("debug")
				.setDescription("enter node debugger")),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (interaction.user.id == hostID) {
			if (subcommand == "eval") {
				var evl = eval(interaction.options.getString('str'));
				if (interaction.options.getInteger('showresult') == 1) {
					await interaction.reply({ content: `\`\`\`${JSON.stringify(evl)}\`\`\``, ephemeral: false });
				} else {
					await interaction.reply({ content: `\`\`\`${JSON.stringify(evl)}\`\`\``, ephemeral: true });
				}
			} else if (subcommand == "debug") {

			}
		} else {
			await interaction.reply({ content: "This command can only be used by <@" + hostID + ">.\n\nNothing personal, i just don't want anyone to mess with my insides.", ephemeral: true });
		}
	},
};