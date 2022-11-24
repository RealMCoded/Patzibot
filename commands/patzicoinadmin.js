const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { logWebhookURL } = require('../config.json')
const shp = require('./resources/json/items.json')

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
			subcommand.setName("give-item")
				.setDescription("give an item to a user")
				.addUserOption(option =>
					option.setRequired(true)
						.setName("user")
						.setDescription("the user to give item to"))
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("item-id")
						.setDescription("the item ID to give (starting from 0)")))
		.addSubcommand(subcommand => 
			subcommand.setName("revoke-item")
				.setDescription("remove an item from a user")
				.addUserOption(option =>
					option.setRequired(true)
						.setName("user")
						.setDescription("the user to give item to"))
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("item-id")
						.setDescription("the item ID to revoke (starting from 0)")))
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
		} else if (subcommand == "give-item"){
			const user = interaction.options.getUser('user');
			const userID = user.id;
			var item = interaction.options.getInteger('item-id');

			var dbusr = await db.findOne({ where: { userID: userID } });

			if(item > shp.length || item < 1){
				try {
					interaction.reply({content:`⚠ **Invalid item! Maybe you were looking for ${shp[item-1].item}, which is item ID ${item-1}**`,ephemeral: true});
				} catch(e){
					interaction.reply({content:`⚠ **Invalid item!**`,ephemeral: true});
				}
				return;
			}

			if(!dbusr){
				interaction.reply({content:`⚠ **this person has never earned a singular patzicoin. ever.**`,ephemeral: true});
				return;
			}
			var inve = dbusr.get("inv");
			inve = JSON.parse(inve);

			if(inve.includes(item)){
				interaction.reply({content:`⚠ **they already have this item**`,ephemeral: true});
				return;
			}

			inve.push(item);
			inve = JSON.stringify(inve);

			db.update({
				inv: inve
			}, {
				where: { userID: userID },
			});

			interaction.reply({ content: `✅ **Gave ${user.username} ${shp[item].item}!**`, ephemeral: true })

			//logging
			const embed = new MessageEmbed()
				.setTitle("Patzicoin Logs")
				.setDescription(`${user.tag} was given **${shp[item].item}**\n\nExecutor: \`\`\`${interaction.user.id} | ${interaction.user.tag}\`\`\``)
				.setColor("#00ff00")
				.setTimestamp();
			webhookClient.send({embeds: [embed]});

		}else if (subcommand == "revoke-item"){
			const user = interaction.options.getUser('user');
			const userID = user.id;
			var item = interaction.options.getInteger('item-id');

			var dbusr = await db.findOne({ where: { userID: userID } });

			if(item > shp.length || item < 1){
				try {
					interaction.reply({content:`⚠ **Invalid item! Maybe you were looking for ${shp[item-1].item}, which is item ID ${item-1}**`,ephemeral: true});
				} catch(e){
					interaction.reply({content:`⚠ **Invalid item!**`,ephemeral: true});
				}
				return;
			}

			if(!dbusr){
				interaction.reply({content:`⚠ **this person has never earned a singular patzicoin. ever.**`,ephemeral: true});
				return;
			}
			var inve = dbusr.get("inv");
			inve = JSON.parse(inve);

			if(inve.includes(item)){
				inve.splice(item, item);
				inve = JSON.stringify(inve);

				db.update({
					inv: inve
				}, {
					where: { userID: userID },
				});

				interaction.reply({ content: `✅ **Revoked ${shp[item].item} from ${user.username}!**`, ephemeral: true })

				//logging
				const embed = new MessageEmbed()
					.setTitle("Patzicoin Logs")
					.setDescription(`${user.tag} was removed of **${shp[item].item}**\n\nExecutor: \`\`\`${interaction.user.id} | ${interaction.user.tag}\`\`\``)
					.setColor("#00ff00")
					.setTimestamp();
				webhookClient.send({embeds: [embed]});
			} else {
				interaction.reply({content:`⚠ **they do not have this item**`,ephemeral: true});
				return;
			}

		}
	},
};