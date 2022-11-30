const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gas-leak')
		.setDescription(`Love is in the air? WRONG! Gas leak.`)
		.addStringOption(string =>
			string.setName("string")
				.setRequired(true)
				.setDescription("love is in the air?"))
		.addStringOption(string =>
			string.setName("string2")
				.setRequired(false)
				.setDescription("gas leak.")),
	async execute(interaction) {
			let str = interaction.options.getString('string')
			let str2 = interaction.options.getString('string2') || "gas leak"
			await interaction.reply({ content: "```ansi\n" + str + "?\n\nWRONG! [2;40m  [2;37m" + str2 + "[0m[2;40m    [0m[2;40m \n                      [0m[2;40m[0m```", ephemeral: false });
	},
};