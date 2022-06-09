const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { logWebhookURL } = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patzicoin-admin')
		.setDescription(`patzercon admirn`)
		.addSubcommand(subcommand => 
			subcommand.setName("set")
				.setDescription("set patzicoin to a user")
				.addUserOption(option =>
					option.setRequired(true)
						.setName("user")
						.setDescription("the user to give patzicoin to"))
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("amount")
						.setDescription("The amount of coins to give")))
		.addSubcommand(subcommand => 
			subcommand.setName("give")
				.setDescription("give patzicoin to a user")
				.addUserOption(option =>
					option.setRequired(true)
						.setName("user")
						.setDescription("the user to give patzicoin to"))
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("amount")
						.setDescription("The amount of coins to give"))),
	async execute(interaction) {
		const webhookClient = new WebhookClient({ url: logWebhookURL });
		const subcommand = interaction.options.getSubcommand();
		const db = interaction.client.db.Patzicoin;

		if (subcommand == "set") {
			const user = interaction.options.getUser('user');
			const amount = interaction.options.getInteger('amount');
			const userID = user.id;
			const coins = await db.findOne({
				where: {
					userID: userID
				}
			});

			if (coins == null) {
				await db.create({
					userID: userID,
					coins: amount
				});
			} else {
				await db.update({
					coins: amount
				}, {
					where: {
						userID: userID
					}
				});
			}

			interaction.reply({ content: `✅ **Set ${user.username}'s Patzicoins to ${amount}!**`, ephemeral: true })

			//logging
			const embed = new MessageEmbed()
				.setTitle("Patzicoin Logs")
				.setDescription(`${user.tag}'s Patzicoins was set to **${amount}**.\n\nExecutor: \`\`\`${interaction.user.id} | ${interaction.user.tag}\`\`\``)
				.setColor("#00ff00")
				.setTimestamp();
			webhookClient.send({embeds: [embed]});

		} else if (subcommand == "give") {
			
			const user = interaction.options.getUser('user');
			const amount = interaction.options.getInteger('amount');
			const userID = user.id;
			const coins = await db.findOne({
				where: {
					userID: userID
				}
			});

			if (coins == null) {
				await db.create({
					userID: userID,
					coins: amount
				});
			} else {
				await db.update({
					coins: coins.coins + amount
				}, {
					where: {
						userID: userID
					}
				});
			}

			interaction.reply({ content: `✅ **Gave ${user.username} ${amount} Patzicoins!**`, ephemeral: true })

			//logging
			const embed = new MessageEmbed()
				.setTitle("Patzicoin Logs")
				.setDescription(`${user.tag} was given **${amount}** Patzicoins\n\nExecutor: \`\`\`${interaction.user.id} | ${interaction.user.tag}\`\`\``)
				.setColor("#00ff00")
				.setTimestamp();
			webhookClient.send({embeds: [embed]});
		}
	},
};