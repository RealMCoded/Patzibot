const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
//const { bankMaxBal } = require('../config.json');
const { random, random_range } = require(`../util.js`)
const earnResp = require('./resources/json/earnResp.json')
//const store = require('./resources/json/items.json')
//const wait = require('node:timers/promises').setTimeout;

const recent= new Set();
const recentrobbers = new Set();
const recentlyrobbed = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patzicoin')
		.setDescription(`patzercon`)
		.addSubcommand(subcommand => 
			subcommand.setName("lb")
				.setDescription("PatziCoin Leaderboard")
				.addIntegerOption(option => 
					option.setRequired(false)
						.setName("page")
						.setDescription("The page of users to show (10 users/page) (Default: 1)")))
		.addSubcommand(subcommand => 
			subcommand.setName("bank")
				.setDescription("PatziCoin Leaderboard")
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("mode")
						.setDescription("The mode of the bank (1: deposit, 2: withdraw, 3: balance)")
						.addChoice(`Deposit (Put money)`, 1)
						.addChoice(`Withdraw (Take money)`, 2)
						.addChoice(`Balance (view money)`, 3))
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("amount")
						.setDescription("The amount of PatziCoin to exchange (0 for all) (ignored for balance)")))
		.addSubcommand(subcommand => 
			subcommand.setName("userstats")
				.setDescription("View a user's stats")
				.addUserOption(option => 
					option.setRequired(false)
						.setName("user")
						.setDescription("The user to view (Default: Current User)")))
		.addSubcommand(subcommand => 
			subcommand.setName("rob")
				.setDescription("rob a person lol")
				.addUserOption(option => 
					option.setRequired(true)
						.setName("user")
						.setDescription("The user to rob")))
		.addSubcommand(subcommand => 
			subcommand.setName("serverstats")
				.setDescription("View the server's patzicoin stats"))
		.addSubcommand(subcommand => 
			subcommand.setName("about")
				.setDescription("About PatziCoins"))
		.addSubcommand(subcommand => 
					subcommand.setName("beg")
						.setDescription("beg craig for patzicoins"))
		.addSubcommand(subcommand => 
			subcommand.setName("search")
				.setDescription("Search for Patzicoins!")
				.addStringOption(option =>
					option.setName('location')
						.setDescription('the place to look')
						.setRequired(true)
						.addChoice('McDonalds Dumpster (Pay: 5-15 | 3% lose rate)', `1`)
						.addChoice('Break into a car (Pay: 50-100 | 50% lose rate)', `2`)
						.addChoice('Break into Patzi\'s House (Pay: 1000-10000 | 99% lose rate)', `3`)))
		.addSubcommand(subcommand => 
			subcommand.setName("work")
				.setDescription("Work to earn Patzicoins!")
				.addStringOption(option =>
					option.setName('job')
						.setDescription('the job')
						.setRequired(true)
						.addChoice('McDonalds (Pay: 15-34 | 5% lose rate)', `1`)
						.addChoice('Corner Store (Pay: 35-50 | 10% lose rate)', `2`)
						.addChoice('PatziMart (Pay: 50-60 | 15% lose rate)', `3`))),
	async execute(interaction) {
		const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
		const subcommand = interaction.options.getSubcommand();
		const db = interaction.client.db.Patzicoin;

		if (subcommand == "about") {
			const embed = new MessageEmbed()
				.setTitle("About PatziCoins")
				.setDescription("PatziCoins are a currency used in the Patzi's World Discord server. They can be used to buy special items and rewards and to show off to other server members how active you are.\n\nYou can earn PatziCoins by chatting in the server or by working!\n\nNote: The PatziCoin system is currently a work in progress and may change at any time.")
			interaction.reply({embeds: [embed]});
		} else if(subcommand == "bank") {
			const usr = interaction.user
			const mode = interaction.options.getInteger("mode");
			var amount = interaction.options.getInteger("amount");

			const tag = await db.findOne({ where: { userID: usr.id } });

			await require(`../patzicoin-functions/bank.js`).bank(mode, amount, tag, interaction)
		} else if (subcommand == "rob") {
			const usr = interaction.user
			const target = interaction.options.getUser("user");

			if(target.bot){
				const embed = new MessageEmbed()
						.setTitle("Robbing a bot! - PatziCoin")
						.setDescription(`**You can't rob bots!**`)
						.setColor("#FF0000")
				return interaction.reply({embeds: [embed]});
			}

			if(usr == target) {
				const embed = new MessageEmbed()
						.setTitle("Robbing ...yourself... - PatziCoin")
						.setDescription(`**You can't rob yourself!**`)
						.setColor("#FF0000")
				return interaction.reply({embeds: [embed]});
			}
			if(recentrobbers.has(usr.id)) {
				interaction.reply({content: "⏰ **You can't rob right now, you must wait 5 minutes since your last rob!**", ephemeral: true});
				return;
			}

			const tag = await db.findOne({ where: { userID: usr.id } });
			const targetTag = await db.findOne({ where: { userID: target.id } });
			
			if (!tag) {
				const embed = new MessageEmbed()
					.setTitle(`Robbing ${target.username} - PatziCoin`)
					.setDescription(`You don't have any PatziCoins!`)
					.setColor("#ff0000")
				return interaction.reply({embeds: [embed]});
			}
			if (!targetTag) {
				const embed = new MessageEmbed()
					.setTitle(`Robbing ${target.username} - PatziCoin`)
					.setDescription(`**${target.username}** doesn't have any PatziCoins!`)
					.setColor("#ff0000")
				return interaction.reply({embeds: [embed]});
			}

			const chance = Math.floor(Math.random() * 100); //0-100

			if (chance < 55) { //55% chance of success
				const embed = new MessageEmbed()
					.setTitle(`Robbing ${target.username} - PatziCoin`)
					.setDescription(`You tried to rob **${target.username}**, but they got away!`)
					.setColor("#ff0000")
				interaction.reply({embeds: [embed]});
				recentrobbers.add(usr.id);
				setTimeout(() => {
					recentrobbers.delete(usr.id);
				} , 300000);
			} else {
				const stole = Math.floor(Math.random() * (clamp(targetTag.coins, 0, 250) - 1)) + 1; //1-targetTag.coins
				const embed = new MessageEmbed()
					.setTitle(`Robbing ${target.username} - PatziCoin`)
					.setDescription(`**You've successfully robbed ${target.username}**!\nYou stole **${stole}** PatziCoins from them!`)
					.setColor("#00ff00")
				interaction.reply({embeds: [embed]});
				tag.update({
					coins: tag.coins + stole,
				})
				targetTag.update({
					coins: targetTag.coins - stole,
				})
				recentrobbers.add(usr.id);
				setTimeout(() => {
					recentrobbers.delete(usr.id);
				} , 300000);
				//dm the target
				//target.send(`${usr} has just robbed you! You lost **${stole}** PatziCoins!`);
			}
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
					var amount = random_range(15, 30)
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
						.setTitle("Work at Corner Store - PatziCoin")
						.setColor(0xFF0000)
						.setDescription(`"${msg}" - boss\nYou lost **0** PatziCoins.`)
					interaction.reply({embeds: [embed]});
				} else {
					var amount = random_range(35, 50)
					var msg = earnResp[`JOB2_GOOD`][Math.floor(Math.random() * (earnResp[`JOB2_GOOD`].length))]
					const embed = new MessageEmbed()
						.setTitle("Work at Corner Store - PatziCoin")
						.setColor(0x00FF00)
						.setDescription(`"${msg}" - boss\nYou earned **${amount}** PatziCoins!`)
					interaction.reply({embeds: [embed]});

					db.increment('coins', { by: amount, where: { userID: interaction.user.id } });
				}

			}
			if (method == "3") {

				if(Math.random() < 0.15){
					var msg = earnResp[`JOB2_BAD`][Math.floor(Math.random() * (earnResp[`JOB2_BAD`].length))]
					const embed = new MessageEmbed()
						.setTitle("Work at PatziMart - PatziCoin")
						.setColor(0xFF0000)
						.setDescription(`"${msg}" - boss(not patzi)\nYou lost **0** PatziCoins.`)
					interaction.reply({embeds: [embed]});
				} else {
					var amount = random_range(50, 60)
					var msg = earnResp[`JOB2_GOOD`][Math.floor(Math.random() * (earnResp[`JOB2_GOOD`].length))]
					const embed = new MessageEmbed()
						.setTitle("Work at PatziMart - PatziCoin")
						.setColor(0x00FF00)
						.setDescription(`"${msg}" - boss(not patzi)\nYou earned **${amount}** PatziCoins!`)
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
		} else if(subcommand == "search"){
			if(recent.has(interaction.user.id)){
				interaction.reply({content:`⏰ **You cannot search for PatziCoins right now!**\n**You have to wait a while to use it again!**`,ephemeral: true});
				return;
			} else {
			var method = interaction.options.getString("location");

			var dbusr = await db.findOrCreate({
				where: { userID: interaction.user.id },
			});

			if (method == "1") {

				if(Math.random() < 0.05){
					const embed = new MessageEmbed()
						.setTitle("Search for PatziCoins at the McDonalds Dumpster - PatziCoin")
						.setColor(0xFF0000)
						.setDescription(`The dumpster was empty. You found nothing.`)
					interaction.reply({embeds: [embed]});
				} else {
					var amount = random_range(5, 15)
					const embed = new MessageEmbed()
						.setTitle("Search for PatziCoins at the McDonalds Dumpster  - PatziCoin")
						.setColor(0x00FF00)
						.setDescription(`You found **${amount}** PatziCoins!`)
					interaction.reply({embeds: [embed]});

					db.increment('coins', { by: amount, where: { userID: interaction.user.id } });
				}
			}
			if (method == "2") {

				if(Math.random() < 0.10){
					const embed = new MessageEmbed()
						.setTitle("Break into a car - PatziCoin")
						.setColor(0xFF0000)
						.setDescription(`You were caught and sent to jail.\nYou lost **0** PatziCoins.`)
					interaction.reply({embeds: [embed]});
				} else {
					var amount = random_range(50, 100)
					const embed = new MessageEmbed()
						.setTitle("Break into a car - PatziCoin")
						.setColor(0x00FF00)
						.setDescription(`Somehow the alarms didn't go off in the car! You found **${amount}** PatziCoins!`)
					interaction.reply({embeds: [embed]});

					db.increment('coins', { by: amount, where: { userID: interaction.user.id } });
				}

			}
			if (method == "3") {

				if(Math.random() < 0.99){
					var amount = random_range(0, 124)

					const embed = new MessageEmbed()
						.setTitle("Break into Patzi's House - PatziCoin")
						.setColor(0xFF0000)
						.setDescription(`"GET THE FUCK OUT OF MY HOUSE" - Patzi\nYou lost **${amount}** PatziCoins.`)
					interaction.reply({embeds: [embed]});

					db.increment('coins', { by: -amount, where: { userID: interaction.user.id } });
				} else {
					var amount = random_range(1000, 10000)
					const embed = new MessageEmbed()
						.setTitle("Break into Patzi's House - PatziCoin")
						.setColor(0x00FF00)
						.setDescription(`You did the impossible. You found **${amount}** PatziCoins!`)
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
			const page = (interaction.options.getInteger("page") || 1)*10;
			
			await require(`../patzicoin-functions/leaderboard.js`).lb(page, db, interaction)
		} else if(subcommand == "userstats"){
			const usr = interaction.options.getUser("user") || interaction.member.user;

			const tag = await db.findOne({ where: { userID: usr.id } });

			await require(`../patzicoin-functions/userstats.js`).userstats(usr, tag, interaction)
		} else if(subcommand == "beg"){
			let delay = 18000 //~5 hours
			var dbusr = await db.findOrCreate({
				where: { userID: interaction.user.id },
			});

			const tag = await db.findOne({ where: { userID: interaction.user.id } });
			const lastBeg= parseInt(tag.get('lastBegClaimDate'))
			//console.log(`${lastBeg+43200}, now is ${Date.now()}`)

			//get current data as unix MINUS MILLISECONDS
			var n = Math.floor(Date.now() / 1000)

			if(n <= lastBeg+delay){
				//get time left between now and last beg
				const embed = new MessageEmbed()
					.setTitle("Beg - PatziCoin")
					.setColor("#FF0000")
					.setDescription(`"Go away! You can beg again <t:${lastBeg+delay}:R> (<t:${lastBeg+delay}:f>)"\n -craig`)
					.setTimestamp()
				return interaction.reply({embeds: [embed]});
			} else {
				let amount = random_range(1, 125)

				db.increment('coins', { by: amount, where: { userID: interaction.user.id } });
				db.update({ lastBegClaimDate: n }, { where: { userID: interaction.user.id } });
				if(amount == 69){
					db.increment('coins', { by: 1, where: { userID: interaction.user.id } });
					const embed = new MessageEmbed()
					.setTitle("Beg - PatziCoin")
					.setColor("#00FF00")
					.setDescription(`"Here's **${amount} PatziCoins**, now go awa-\n\nWhat's this on the floor? Another Patzicoin? Here, you can have it! That brings your total to **${amount+1}**. Now leave!"\n -craig`)
					.setTimestamp()
				return interaction.reply({embeds: [embed]});
				} else {
				const embed = new MessageEmbed()
					.setTitle("Beg - PatziCoin")
					.setColor("#00FF00")
					.setDescription(`"Here's **${amount} PatziCoins**, now go away!"\n -craig`)
					.setTimestamp()
				return interaction.reply({embeds: [embed]});
				}
			}
		} else if(subcommand == "serverstats"){
			await require('../patzicoin-functions/serverstats.js').serverstats(db, interaction)
		}
	},
};