const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sponge')
		.setDescription(`everyone's favorite cartoon sponge!`),
	async execute(interaction) {
		interaction.reply({content:`https://cdn.discordapp.com/attachments/947679414542557245/1096130018406568037/sponge.webp`,ephemeral: true});
	},
};