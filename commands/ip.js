const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ip')
		.setDescription(`Get a user's totally 203% real ip!`)
		.addUserOption(user =>
			user.setName("user")
				.setRequired(true)
				.setDescription("The member to get the IP address of")),
	async execute(interaction) {
		await interaction.reply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s IP Address** `);
		await wait(2000);
		await interaction.editReply(`✅ **${interaction.options.getUser('user')}'s IP found!**\n\n\`${getRandomInt(255)}.${getRandomInt(255)}.${getRandomInt(255)}.${getRandomInt(255)}\``);
	},
};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }
  