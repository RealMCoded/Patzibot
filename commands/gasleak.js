const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gas-leak')
		.setDescription(`Love is in the air? WRONG! Gas leak.`)
		.addStringOption(string =>
			string.setName("string")
				.setRequired(true)
				.setDescription("love is in the air?")),
	async execute(interaction) {
			let str = interaction.options.getString('string')
			await interaction.reply({ content: "*note: this may look a little* ***funky*** *on mobile.*```ansi\n" + str + "?\n\nWRONG! [2;40m  [2;37mgas leak[0m[2;40m    [0m[2;40m \n                      [0m[2;40m[0m```", ephemeral: false });
	},
};