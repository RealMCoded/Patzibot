const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;
const { clientId } = require('../config.json');
const DateTime = new Date();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('life-expectancy')
		.setDescription(`Get how long a user have left to live.`)
		.addUserOption(user =>
			user.setName("user")
				.setRequired(true)
				.setDescription("The member to get the life expectancy of.")),
	async execute(interaction) {
		if (interaction.options.getUser('user').id == clientId){
			await interaction.reply("❌ **You can't use this command on me! I am immortal!**");
			return;
		} else {
			if ((Math.floor(Math.random() * 100) + 1) === 1 ) {
				await interaction.reply("❌ **This user has already died. Try someone else!**");
				return;
			} else {
				const rn = new Date(DateTime.getFullYear(), DateTime.getMonth(), DateTime.getDate())
				const deathdate = randomDate(rn, new Date(DateTime.getFullYear()+100, DateTime.getMonth(), DateTime.getDate()), 0, 24);

				await interaction.reply(`<a:typing:944765274475864094>  **Preparing** `);
				await wait(2000);
				await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s life expectancy \`(Step 1/3 - Collecting users birth records)\`** `);
				await wait(2500);
				await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s life expectancy \`(Step 2/3 - Checking users diet (..oh things aren't looking good..))\`** `);
				await wait(3000);
				await interaction.editReply(`<a:typing:944765274475864094>  **Getting ${interaction.options.getUser('user')}'s life expectancy \`(Step 3/3 - Simulating users life ${Math.floor(Math.random() * 1000) + 1} times...)\`** `);
				await wait(4550);
				await interaction.editReply(`✅ **${interaction.options.getUser('user')}'s life expectancy is <t:${Math.floor(deathdate.getTime() / 1000)}:F>.**`);
				return;
			}
		}
	},
};

function randomDate(start, end, startHour, endHour) {
	var date = new Date(+start + Math.random() * (end - start));
	var hour = startHour + Math.random() * (endHour - startHour) | 0;
	date.setHours(hour);
	return date;
}
  