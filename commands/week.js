const { SlashCommandBuilder } = require('@discordjs/builders');
const week = require("./resources/json/weekvids.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('day')
		.setDescription('Get a video for the current day of the week'),
	async execute(interaction) {
		const dayOfWeek = new Date().getDay();
		const weekVid = week[dayOfWeek];
		await interaction.reply(weekVid[Math.floor(Math.random() * (weekVid.length))])
	},
};