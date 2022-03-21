const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jokeban')
		.setDescription(`Ban a user [JOKE COMMAND]`)
		.addUserOption(user =>
			user.setName("user")
				.setRequired(true)
				.setDescription("The member to ban"))
		.addStringOption(reason =>
			reason.setName("reason")
				//.setRequired(true)
				.setDescription("The reason for the ban")),
	async execute(interaction) {
		//await interaction.reply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s IP Address** `);

		var reason = interaction.options.getString('reason')

		if (!reason) reason = "No reason specified."

		await interaction.deferReply();
		await wait(2000);
		await interaction.editReply(`✅ Banned **${interaction.options.getUser('user')}** for "**${reason}**"\n\n*haha jk get TROLLED!*`);
	},
};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }
  