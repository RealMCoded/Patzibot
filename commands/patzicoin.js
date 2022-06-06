const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const earnResp = require('./resources/json/earnResp.json')

const recent= new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patzicoin')
		.setDescription(`patzercon`)
		.addSubcommand(subcommand => 
			subcommand.setName("lb")
				.setDescription("PatziCoin Leaderboard")
				.addIntegerOption(option => 
					option.setRequired(false)
						.setName("amount")
						.setDescription("The amount of users to show (Default: 10)")))
		.addSubcommand(subcommand => 
			subcommand.setName("userstats")
				.setDescription("View a user's stats")
				.addUserOption(option => 
					option.setRequired(false)
						.setName("user")
						.setDescription("The user to view (Default: Current User)")))
		.addSubcommand(subcommand => 
			subcommand.setName("about")
				.setDescription("About PatziCoins"))
		.addSubcommand(subcommand => 
			subcommand.setName("work")
				.setDescription("Work to earn Patzicoins!")
				.addStringOption(option =>
					option.setName('job')
						.setDescription('the job')
						.setRequired(true)
						//.addChoice('Random! (??-?? - ?% lose rate)', 'rnd')
						.addChoice('McDonalds (Pay: 15-30 | 5% lose rate)', `1`)
						.addChoice('Dollar Store (Pay: 35-50 | 10% lose rate)', `2`))),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const db = interaction.client.db.Patzicoin;

		if (subcommand == "about") {
			const embed = new MessageEmbed()
				.setTitle("About PatziCoins")
				.setDescription("PatziCoins are a currency used in the Patzi's World Discord server. They can be used to buy special items and rewards.\n\nYou can earn PatziCoins by chatting in the server, and you can spend them on special items and rewards.\n\nNote: The PatziCoin system is currently in Beta and may change at any time.")
			interaction.reply({embeds: [embed]});
		} else if(subcommand == "work"){
			if(recent.has(interaction.user.id)){
				interaction.reply({content:`⏰ **You cannot work for PatziCoins right now!**\n**You have to wait a while to use it again!**`,ephemeral: true});
				return;
			} else {
			var method = interaction.options.getString("job");

			var dbusr = await db.findOrCreate({
				where: { userID: interaction.user.id },
			});

			if (method == "1") {

				if(Math.random() < 0.05){
					var msg = earnResp[`JOB1_BAD`][Math.floor(Math.random() * (earnResp[`JOB1_BAD`].length))]
					const embed = new MessageEmbed()
						.setTitle("Work at McDonalds - PatziCoin")
						.setColor(0xFF0000)
						.setDescription(`"${msg}" - boss\nYou lost **0** PatziCoins.`)
					interaction.reply({embeds: [embed]});
				} else {
					var amount = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
					var msg = earnResp[`JOB1_GOOD`][Math.floor(Math.random() * (earnResp[`JOB1_GOOD`].length))]
					const embed = new MessageEmbed()
						.setTitle("Work at McDonalds - PatziCoin")
						.setColor(0x00FF00)
						.setDescription(`"${msg}" - boss\nYou earned **${amount}** PatziCoins!`)
					interaction.reply({embeds: [embed]});

					db.increment('coins', { by: amount, where: { userID: interaction.user.id } });
				}

			}
			if (method == "2") {

				if(Math.random() < 0.10){
					var msg = earnResp[`JOB2_BAD`][Math.floor(Math.random() * (earnResp[`JOB2_BAD`].length))]
					const embed = new MessageEmbed()
						.setTitle("Work at Dollar Store - PatziCoin")
						.setColor(0xFF0000)
						.setDescription(`"${msg}" - boss\nYou lost **0** PatziCoins.`)
					interaction.reply({embeds: [embed]});
				} else {
					var amount = Math.floor(Math.random() * (50 - 35 + 1)) + 35;
					var msg = earnResp[`JOB2_GOOD`][Math.floor(Math.random() * (earnResp[`JOB2_GOOD`].length))]
					const embed = new MessageEmbed()
						.setTitle("Work at Dollar Store - PatziCoin")
						.setColor(0x00FF00)
						.setDescription(`"${msg}" - boss\nYou earned **${amount}** PatziCoins!`)
					interaction.reply({embeds: [embed]});

					db.increment('coins', { by: amount, where: { userID: interaction.user.id } });
				}

			}

			recent.add(interaction.user.id );
            setTimeout(() => {
                // Removes the user from the set after 60 seconds
                recent.delete(interaction.user.id );
                }, 35000);
			}
		} else if(subcommand == "lb"){
			var le = ""
			list = await db.findAll({
				attributes: ['coins', 'userID']
			})

			list = list.sort((a, b) => b.coins - a.coins)
			list = list.slice(0, interaction.options.getInteger('amount') || 10)

			for(var i=0; i < list.length; i++){
				var le = le + "**#" + (i+1).toString() + "** | <@" + list[i].userID + ">: **" + list[i].coins.toString() + "** 🪙\n"
			}

			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Leaderboard | First ${interaction.options.getInteger('amount') || 10} users`)
				.setColor("#0099ff")
				.setDescription(`${le}`)
				.setTimestamp()

			return interaction.reply({embeds: [embed]});
		} else if(subcommand == "userstats"){
			const usr = interaction.options.getUser("user") || interaction.member.user;

			const tag = await db.findOne({ where: { userID: usr.id } });
              
        if (tag) {
			const correct = tag.get("coins")
			const invjson = tag.get("inv")
			const inv = JSON.parse(invjson)

			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Stats for `)
				.setColor("#0099ff")
				.setDescription(`**PatziCoins**: ${correct} 🪙\n\n**Inventory**: ${inv}`)
				.setTimestamp()

			return interaction.reply({embeds: [embed]});
		} else {
			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Stats for `)
				.setColor("#0099ff")
				.setDescription(`**PatziCoins**: 0 🪙`)
				.setTimestamp()

			return interaction.reply({embeds: [embed]});
		}
	}
	},
};