const { SlashCommandBuilder } = require('@discordjs/builders');
const perm = require('./powerList.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gas-leak')
		.setDescription(`Love is in the air? WRONG! Gas leak.`)
		.addStringOption(string =>
			string.setName("string")
				.setRequired(true)
				.setDescription("love is in the air?")),
	async execute(interaction) {
		if (perm.includes(interaction.user.id)) {
			let str = interaction.options.getString('string')
			await interaction.reply({ content: "*note: this may look a little* ***funky*** *on mobile.*```ansi\n" + str + "?\n\nWRONG! [2;40m  [2;37mgas leak[0m[2;40m    [0m[2;40m \n                      [0m[2;40m[0m```", ephemeral: false });
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};