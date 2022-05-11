const { SlashCommandBuilder } = require('@discordjs/builders');
const perm = require('./powerList.json');
const rndmsg = require('./resources/json/randommsg.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-message')
		.setDescription(`Send a random message.`),
	async execute(interaction) {
		if (perm.includes(interaction.user.id)) {
			await console.log(`${interaction.user.tag} requested that i send a random message\n`)
			const randomIndex = Math.floor(Math.random() * (rndmsg.length - 1) + 1);
			interaction.channel.send(rndmsg[randomIndex])
			await interaction.reply({ content: "ok", ephemeral: true });
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};