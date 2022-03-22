const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeoutprecise')
		.setDescription(`Timeout a member for up to 28 days.`)
		.addUserOption(option =>
			option.setName("user")
			.setDescription("The user to timeout")
			.setRequired(true))
		.addStringOption(option =>
            option.setName('unit')
                .setDescription('the unit of time')
                .setRequired(true)
                .addChoice('seconds', 'seconds')
				.addChoice('minutes', 'minutes')
				.addChoice('hours', 'hours')
				.addChoice('days', 'days'))
		.addIntegerOption(option =>
			option.setName("duration")
				.setDescription('the duration')
                .setRequired(true))
		.addStringOption(option =>
			option.setName("reason")
				.setDescription('the reason')),
	async execute(interaction) {
		if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
			const user = interaction.options.getUser('user')
			const RealLen = interaction.options.getInteger('duration')
			let length = interaction.options.getInteger('duration')
			const unit = interaction.options.getString('unit')
			const member = interaction.guild.members.cache.get(user.id)
			let reason = interaction.options.getString('reason')

			if (!reason) reason = "No reason provided"

			if (unit == "seconds") {
				length = Math.floor(length * 1000)
			} else if (unit == "minutes") {
				length = Math.floor(length * 60 * 1000)
			} else if (unit == "hours") {
				length = Math.floor(length * 60 * 60 * 1000)
			} else if (unit == "days") {
				length = Math.floor(length * 24 * 60 * 60 * 1000)
			}

			if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				await interaction.reply(`❌ **I cannot timeout ${user.tag}! They have staff permissions!**`)
			} else if (length > 2.419e+9) {
				await interaction.reply(`❌ **I cannot timeout ${user.tag}! You provided a time longer than 28 days!**`)
			} else {
				member.timeout(length, reason)
				await interaction.reply(`✅ Timedout ${user} for **${RealLen} ${unit}** for **"${reason}".**`)
			}
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};