const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const shop = require("../../resources/json/items.json")
const {logWebhookURL, powerList, hostID} = require("../../config.json")
const patzicoin = require("../../patzicoin-functions/patzicoin.js");
const { Patzicoin } = require('../../database.js');

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
			subcommand.setName("delete-user")
				.setDescription("delete a user from the database. Bot host only")
				.addUserOption(option =>
					option.setRequired(true)
						.setName("user")
						.setDescription("the user to delete")))
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
		if (powerList.includes(interaction.user.id)) {

			const webhook = new WebhookClient({ url: logWebhookURL });
			const subcommand = interaction.options.getSubcommand();
			const db = interaction.client.db.Patzicoin;

			if (subcommand === "set") {
				const user = interaction.options.getUser('user');
				const amount = interaction.options.getInteger('amount');

				patzicoin.setPatzicoins(user.id, amount)

				interaction.reply({ content: `✅ **Set ${user.username}'s Patzicoins to ${amount}!**`, ephemeral: true })

				//logging
				const embed = new EmbedBuilder()
					.setTitle("Patzicoin Logs")
					.setDescription(`${user.tag}'s Patzicoins was set to **${amount}**.`)
					.setFooter({text:`Executor: ${interaction.user.username} (${interaction.user.id})`})
					.setColor("#00ff00")
					.setTimestamp();
				webhook.send({embeds: [embed]});
				return;
			}

			if (subcommand === "give") {
				const user = interaction.options.getUser('user');
				const amount = interaction.options.getInteger('amount');

				patzicoin.changePatzicoins(user.id, amount)

				interaction.reply({ content: `✅ **Gave ${amount} Patzicoins to ${user.usernameunt}!**`, ephemeral: true })

				//logging
				const embed = new EmbedBuilder()
					.setTitle("Patzicoin Logs")
					.setDescription(`${user.tag} was given **${amount}** Patzicoins`)
					.setFooter({text:`Executor: ${interaction.user.username} (${interaction.user.id})`})
					.setColor("#00ff00")
					.setTimestamp();
				webhook.send({embeds: [embed]});
				return;
			}

			if (subcommand === "give-item") {
				const user = interaction.options.getUser('user');
				const item = interaction.options.getInteger('item-id');

				if(item > shop.length || item < 1){
					try {
						interaction.reply({content:`⚠️ **Invalid item! Maybe you were looking for ${shop[item-1].item}, which is item ID ${item-1}**`,ephemeral: true});
					} catch(e){
						interaction.reply({content:`⚠️ **Invalid item!**`,ephemeral: true});
					}
					return;
				}

				const itemGrant = patzicoin.grantItem(user.id, item)

				if (itemGrant.error) {
					return interaction.reply(interaction.reply({ content: `❌ Grant item returned error: \`${itemGrant.error}\``, ephemeral: true }))
				}

				interaction.reply({ content: `✅ **Gave ${user.username} ${shop[item].item}!**`, ephemeral: true })

				//logging
				const embed = new EmbedBuilder()
					.setTitle("Patzicoin Logs")
					.setDescription(`${user.tag} was given **${shop[item].item}**`)
					.setFooter({text:`Executor: ${interaction.user.username} (${interaction.user.id})`})
					.setColor("#00ff00")
					.setTimestamp();
				webhook.send({embeds: [embed]});
				return;
			}

			if (subcommand === "revoke-item") {
				const user = interaction.options.getUser('user');
				const item = interaction.options.getInteger('item-id');

				if(item > shop.length || item < 1){
					try {
						interaction.reply({content:`⚠️ **Invalid item! Maybe you were looking for ${shop[item-1].item}, which is item ID ${item-1}**`,ephemeral: true});
					} catch(e){
						interaction.reply({content:`⚠️ **Invalid item!**`,ephemeral: true});
					}
					return;
				}

				const itemGrant = patzicoin.revokeItem(user.id, item)

				if (itemGrant.error) {
					return interaction.reply(interaction.reply({ content: `❌ Grant item returned error: \`${itemGrant.error}\``, ephemeral: true }))
				}

				interaction.reply({ content: `✅ **Revoked ${shop[item].item} from ${user.username}!**`, ephemeral: true })

				//logging
				const embed = new EmbedBuilder()
					.setTitle("Patzicoin Logs")
					.setDescription(`${user.tag} was removed of **${shop[item].item}**`)
					.setFooter({text:`Executor: ${interaction.user.username} (${interaction.user.id})`})
					.setColor("#00ff00")
					.setTimestamp();
				webhook.send({embeds: [embed]});
				return;
			}

			if (subcommand === "delete-user") {
				if (interaction.user.id != hostID) return interaction.reply({ content: `❌ **Only the bot host can use this!**`, ephemeral: true })
				
				const user = interaction.options.getUser('user');

				let dbusr = await db.findOne({ where: { userID: user.id } });

				try {
					await dbusr.destroy();
				} catch(e)
				{
					return interaction.reply({ content: `❌ **${user.username} never existed to start with!**`, ephemeral: true })
				}

				interaction.reply({ content: `✅ **Removed ${user.username} from the database!**`, ephemeral: true })

				//logging
				const embed = new EmbedBuilder()
					.setTitle("Patzicoin Logs")
					.setDescription(`${user.tag} was removed from the database.`)
					.setFooter({text:`Executor: ${interaction.user.username} (${interaction.user.id})`})
					.setColor("#00ff00")
					.setTimestamp();
				webhook.send({embeds: [embed]});
				return;
			}

		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
    },
};