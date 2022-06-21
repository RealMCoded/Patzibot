const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const earnResp = require('./resources/json/earnResp.json')
const store = require('./resources/json/store.json')
const wait = require('node:timers/promises').setTimeout;

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
						.addChoice(`Withdraw (Take money)`, 1)
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
			subcommand.setName("work")
				.setDescription("Work to earn Patzicoins!")
				.addStringOption(option =>
					option.setName('job')
						.setDescription('the job')
						.setRequired(true)
						.addChoice('McDonalds (Pay: 15-30 | 5% lose rate)', `1`)
						.addChoice('Dollar Store (Pay: 35-50 | 10% lose rate)', `2`))),
	async execute(interaction) {
		const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
		const subcommand = interaction.options.getSubcommand();
		const db = interaction.client.db.Patzicoin;

		if (subcommand == "about") {
			const embed = new MessageEmbed()
				.setTitle("About PatziCoins")
				.setDescription("PatziCoins are a currency used in the Patzi's World Discord server. They can be used to buy special items and rewards.\n\nYou can earn PatziCoins by chatting in the server, and you can spend them on special items and rewards.\n\nNote: The PatziCoin system is currently in Beta and may change at any time.")
			interaction.reply({embeds: [embed]});
		} else if(subcommand == "bank") {
			const usr = interaction.user
			const mode = interaction.options.getInteger("mode");
			var amount = interaction.options.getInteger("amount");

			const tag = await db.findOne({ where: { userID: usr.id } });
			if (!tag) {
				interaction.reply("❌ **You don't have any PatziCoins!**");
				return;
			}

			//check if amount is above 0
			if (amount < 0) {
				interaction.reply("❌ **You can't withdraw negative PatziCoins!**");
				return;
			}

			if(amount == 0) amount = tag.bank

			if (mode == 1) {
				if (amount > tag.coins) {
					interaction.reply("❌ **You don't have that many PatziCoins!**");
					return;
				} else {
					tag.update({
						coins: tag.coins - amount,
						bank: tag.bank + amount
					});
					const embed = new MessageEmbed()
						.setTitle("Deposit PatziCoins")
						.setDescription(`You've deposited **${amount}** PatziCoins into your bank!`)
						.setColor("#00ff00")
					interaction.reply({embeds: [embed]});
				}
			} else if (mode == 2) {
				if (amount > tag.bank) {
					interaction.reply("You don't have that many PatziCoins in your bank!");
					return;
				} else {
					tag.update({
						coins: tag.coins + amount,
						bank: tag.bank - amount
					});
					const embed = new MessageEmbed()
						.setTitle("Withdraw PatziCoins")
						.setDescription(`You've withdrawn **${amount}** PatziCoins from your bank!`)
						.setColor("#00ff00")
					interaction.reply({embeds: [embed]});
				}
			} else if (mode == 3) {
				const embed = new MessageEmbed()
					.setTitle("PatziCoin Bank")
					.setDescription(`You have **${tag.bank}** PatziCoins in your bank!`)
				interaction.reply({embeds: [embed]});
			}
		} else if (subcommand == "rob") {
			const usr = interaction.user
			const target = interaction.options.getUser("user");

			if(usr == target) {
				interaction.reply("❌ **You can't rob yourself!**");
				return;
			}
			if(recentrobbers.includes(usr.id)) {
				interaction.reply({content: "⏰ **You can't rob right now, you must wait 5 minutes since your last rob!**", ephemeral: true});
				return;
			}

			const tag = await db.findOne({ where: { userID: usr.id } });
			const targetTag = await db.findOne({ where: { userID: target.id } });
			
			if (!tag) {
				interaction.reply("You don't have any PatziCoins!");
				return;
			}
			if (!targetTag) {
				interaction.reply("That user doesn't have any PatziCoins!");
				return;
			}

			const chance = Math.floor(Math.random() * 100); //0-100

			if (chance < 55) { //55% chance of success
				const embed = new MessageEmbed()
					.setTitle("Robbery")
					.setDescription(`You tried to rob **${target.username}**, but they were too quick and they ran away!`)
					.setColor("#ff0000")
				interaction.reply({embeds: [embed]});
			} else {
				const stole = Math.floor(Math.random() * (clamp(targetTag.coins, 0, 250) - 1)) + 1; //1-targetTag.coins
				const embed = new MessageEmbed()
					.setTitle("Robbery")
					.setDescription(`**You've successfully robbed ${target.username}**!\nYou stole **${stole}** PatziCoins!`)
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
			const page = (interaction.options.getInteger("page") || 1)*10;
			await interaction.deferReply();
			var timr = setTimeout(() => {
                // notify the user why it's taking so damn long
                interaction.editReply(`<a:typing:944765274475864094> ***This is taking longer than expected. If you requested a large amount of users, this is normal.\n\nTo be under fair use of Discord's API, we need to slow requests down a little so we don't get our ass beaten. We currently wait 25 milliseconds between each request.\n\nWe plan to change this in the future with pages (15 people/page)\n\n(We're at ${gli}/${list.length} users btw!)***`);
                }, 10000);
			var le = ""
			list = await db.findAll({
				attributes: ['coins', 'bank', 'userID']
			})

			list = list.sort((a, b) => (b.coins + b.bank) - (a.coins + a.bank));
			list = list.slice((page-10), page);

			for(var i=0; i < list.length; i++){

				//TODO: Prevent rate limiting for this, causing it to hang. - mildly fixed
				var gli = i
				let user = await interaction.client.users.fetch(list[i].userID);
				if(user){
					var le = le + "**#" + ((i+1)+(page-10)).toString() + "** | `" + user.tag + "`: **" + list[i].coins.toString() + "** 🪙\n"
				} else {
					var le = le + "**#" + (i+1).toString() + "** | `Unknown#" + list[i].userID + "`: **" + list[i].coins.toString() + "** 🪙\n"
				}
				console.log(`[patzicoin.js] FETCHED! (${i+1} / ${list.length})\n`)
				await wait(250);
			}

			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Leaderboard | Page ${(page/10).toString()}`)
				.setColor("#0099ff")
				.setDescription(`${le}`)
				.setTimestamp()

			clearTimeout(timr)
			return interaction.editReply({ content:"_ _", embeds: [embed]});
		} else if(subcommand == "userstats"){
			const usr = interaction.options.getUser("user") || interaction.member.user;

			const tag = await db.findOne({ where: { userID: usr.id } });

			const usrnm = await interaction.client.users.fetch(usr.id);
              
        if (tag) {
			const correct = tag.get("coins")
			const invjson = tag.get("inv")
			const bank = tag.get("bank")
			const inv = JSON.parse(invjson)

			var invstr = ""
			for(var i=0; i < inv.length; i++){
				var item = inv[i]
				var itemname = store[item].item
				invstr = invstr + itemname + "\n"
			}

			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Stats for ${usrnm.tag}`)
				.setColor("#0099ff")
				.setDescription(`**PatziCoins**: ${correct} 🪙\n**Bank Balance**: ${bank}\n\n**Inventory**: ${invstr}`)
				.setTimestamp()

			return interaction.reply({embeds: [embed]});
		} else {
			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Stats for ${usrnm.tag}`)
				.setColor("#0099ff")
				.setDescription(`***No stats found for ${usrnm.tag} :(***`)
				.setTimestamp()

			return interaction.reply({embeds: [embed]});
		}

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
			let amount = Math.floor(Math.random() * (125 - 1 + 1)) + 1;

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
		var le = 0
		var le2 = 0

		list = await db.findAll({
			attributes: ['coins', 'bank']
		})

		for(var i=0; i < list.length; i++){
			le+=list[i].coins
			le2+=list[i].bank
		}

		const embed = new MessageEmbed()
			.setTitle("Server Stats - PatziCoin")
			.setColor("#0099ff")
			.setDescription(`**Total Users**: ${list.length}\n**Total PatziCoins**: ${le} 🪙 (avg. ${Math.round((le/list.length)*100)/100} per member)\n**Total Bank**: ${le2}`)
			.setTimestamp()
		return interaction.reply({embeds: [embed]});
	}
	},
};