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
		await interaction.reply(`<a:typing:944765274475864094>  **Preparing** `);
		await wait(2000);
		await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s IP Address \`(Step 1/3 - Hackering into the Discord account)\`** `);
		await wait(2500);
		await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s IP Address \`(Step 2/3 - Getting 239% real ip (real!))\`** `);
		await wait(3000);
		await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s IP Address \`(Step 3/3 - Changering the password so they can no longer log in (lol!))\`** `);
		await wait(2550);
		await interaction.editReply(`✅ **${interaction.options.getUser('user')}'s IP found!**\n\n\`${getRandomInt(512)}.${getRandomInt(512)}.${getRandomInt(512)}.${getRandomInt(512)}\``);
	},
};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }
  