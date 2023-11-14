const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { random } = require("../../util.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ip')
		.setDescription(`Get a user's totally 203% real ip!`)
		.addUserOption(user =>
			user.setName("user")
				.setRequired(true)
				.setDescription("The member to get the IP address of")),
	async execute(interaction) {
		const user = interaction.options.getUser('user')
		await interaction.reply(`<a:typing:944765274475864094>  **Preparing** `);
		await wait(2000);
		await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${user}'s IP Address \`(Step 1/3 - HAXXORING into the Discord account)\`** `);
		await wait(2500);
		await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${user}'s IP Address \`(Step 2/3 - Getting 239% real ip (real!))\`** `);
		await wait(3000);
		await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${user}'s IP Address \`(Step 3/3 - changing their password so they can no longer log in (lol!))\`** `);
		await wait(2550);
		await interaction.editReply(`✅ **${interaction.options.getUser('user')}'s IP found!**\n\n\`${random(512)}.${random(512)}.${random(512)}.${random(512)}\``);
	},
};