const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const recent= new Set();
const recent_work = new Set();
const recent_robbers = new Set();
const recent_robbed = new Set();

module.exports = {
	data: new SlashCommandBuilder()
        .setName('patzicoin')
        .setDescription(`patzercon`)
        .addSubcommand(subcommand => 
            subcommand.setName("lb")
                .setDescription("The PatziCoin Leaderboard")
                .addIntegerOption(option => 
                    option.setRequired(false)
                        .setName("page")
                        .setDescription("The page of users to show (10 users/page) (Default: 1)")))
        .addSubcommand(subcommand => 
            subcommand.setName("bank")
                .setDescription("The PatziCoin bank")
                .addIntegerOption(option => 
                    option.setRequired(true)
                        .setName("mode")
                        .setDescription("The mode of the bank")
                        .addChoices(
                            {name: "Deposit (Put money)", value: 1},
                            {name: "Withdraw (Take money)", value: 2},
                            {name: "Balance (View Money)", value: 3},
                        ))
                .addIntegerOption(option => 
                    option.setRequired(false)
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
            subcommand.setName("transfer")
                .setDescription("Transfer patzicoins to someone else!")
                .addIntegerOption(option =>
                    option.setRequired(true)
                        .setName("amount")
                        .setDescription("The amount to transfer. Tax is applied to this number."))
                .addUserOption(option => 
                    option.setRequired(true)
                        .setName("user")
                        .setDescription("The user to give the coins to")))
        .addSubcommand(subcommand => 
            subcommand.setName("serverstats")
                .setDescription("View the server\'s patzicoin stats"))
        .addSubcommand(subcommand => 
            subcommand.setName("about")
                .setDescription("About PatziCoins"))
        .addSubcommand(subcommand => 
            subcommand.setName("beg")
                .setDescription("beg craig for patzicoins"))
        .addSubcommand(subcommand => 
            subcommand.setName("search")
                .setDescription("Search for Patzicoins!")
                .addIntegerOption(option =>
                    option.setName('location')
                        .setDescription('the place to look')
                        .setRequired(true)
                        .addChoices(
                            {name: "McDonalds Dumpster (Pay: 5-10 | 5% lose rate)", value: 1},
                            {name: "Break into a car (Pay: 40-50 | 30% lose rate)", value: 2},
                            {name: "Break into Patzi\'s House (Pay: 1000-2763 | 99% lose rate)", value: 3},
                        )))
        .addSubcommand(subcommand => 
            subcommand.setName("work")
                .setDescription("Work to earn Patzicoins!")
                .addIntegerOption(option =>
                    option.setName('job')
                        .setDescription('the job')
                        .setRequired(true)
                        .addChoices(
                            {name: "McDonalds (Pay: 15-34 | 5% lose rate)", value: 1},
                            {name: "Corner Store (Pay: 35-50 | 10% lose rate)", value: 2},
                            {name: "PatziMart (Pay: 50-60 | 15% lose rate)", value: 3},
                        ))),
	async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
		const db = interaction.client.db.Patzicoin;

		if (subcommand == "about") {
			const embed = new EmbedBuilder()
				.setTitle("About PatziCoins")
				.setDescription("PatziCoins are a currency used in the Patzi's World Discord server. They can be used to buy special items and rewards and to show off to other server members how active you are.\n\nYou can earn PatziCoins by chatting in the server or by working!\n\nNote: The PatziCoin system is currently a work in progress and may change at any time.")
			return await interaction.reply({embeds: [embed]});
		}

        if (subcommand === "lb") {
            const page = (interaction.options.getInteger("page") || 1)*10;
			return await require(`../../patzicoin-functions/leaderboard.js`).leaderboard(page, db, interaction)
        }

        if (subcommand === "userstats") {
            const usr = interaction.options.getUser("user") || interaction.member.user;
			const tag = await db.findOne({ where: { userID: usr.id } });

			return await require(`../../patzicoin-functions/userstats.js`).userstats(usr, tag, interaction)
        }

        if (subcommand === "serverstats") {
			return await require(`../../patzicoin-functions/serverstats.js`).serverStats(db, interaction)
        }

        if (subcommand === "bank") {
            const usr = interaction.user
			const mode = interaction.options.getInteger("mode");
			const amount = interaction.options.getInteger("amount") || 0;

			const tag = await db.findOne({ where: { userID: usr.id } });

            if (!tag) {
				const embed = new EmbedBuilder()
						.setTitle("PatziCoins")
						.setDescription(`**You don't have any PatziCoins!**`)
						.setColor("#FF0000")
				return interaction.reply({embeds: [embed]});
			}

            if (amount < 0) {
				return interaction.reply({content: "❌ **You can't withdraw a negative amount of Patzicoins!**", ephemeral: true})
			}

            switch(mode) {
                case 1: return await require("../../patzicoin-functions/bank.js").bankDeposit(amount, tag, interaction); break;
                case 2: return await require("../../patzicoin-functions/bank.js").bankWithdraw(amount, tag, interaction); break;
                case 3: return await require("../../patzicoin-functions/bank.js").bankBalance(tag, interaction); break;
            }
        }

        if (subcommand === "search") {
            if(recent.has(interaction.user.id)){
				interaction.reply({content:`⏰ **You cannot search for PatziCoins right now!**\n**You have to wait a while to use it again!**`,ephemeral: true});
				return;
			}

			const method = interaction.options.getInteger("location");

            await require("../../patzicoin-functions/search.js").search(method, interaction.user.id, interaction);

            recent.add(interaction.user.id );
            setTimeout(() => {
                // Removes the user from the set after 60 seconds
                recent.delete(interaction.user.id );
                }, 30000);
            return;
        }

        if (subcommand === "work") {
            if(recent_work.has(interaction.user.id)){
				interaction.reply({content:`⏰ **You cannot work right now!**\n**You have to wait a while to use it again!**`,ephemeral: true});
				return;
			}

			const method = interaction.options.getInteger("job");

            await require("../../patzicoin-functions/work.js").work(method, interaction.user.id, interaction);

            recent_work.add(interaction.user.id );
            setTimeout(() => {
                // Removes the user from the set after 60 seconds
                recent_work.delete(interaction.user.id );
                }, 60000);
            return;
        }

        if (subcommand === "beg") {
            await db.findOrCreate({
				where: { userID: interaction.user.id },
			});

            const tag = await db.findOne({ where: { userID: interaction.user.id } });

            return await require("../../patzicoin-functions/beg.js").beg(tag, interaction);
        }

        if (subcommand === "rob") {

            const usr = interaction.user
			const target = interaction.options.getUser("user");

            if(recent_robbers.has(usr.id)) {
				interaction.reply({content: "⏰ **You can't rob right now, you must wait 5 minutes since your last rob!**", ephemeral: true});
				return;
			}

            if(recent_robbed.has(target.id)) {
				interaction.reply({content: "⏰ **You can't rob this person right now, they are on cooldown!**", ephemeral: true});
				return;
			}

            const user_db = await db.findOne({ where: { userID: usr.id } });
			const target_db = await db.findOne({ where: { userID: target.id } });

            const robResult = await require("../../patzicoin-functions/rob.js").rob(usr, user_db, target, target_db, interaction);
            
            if (robResult == true) {
                recent_robbers.add(usr.id);
				setTimeout(() => {
					recent_robbers.delete(usr.id);
				} , 300000);

                recent_robbed.add(target.id);
				setTimeout(() => {
					recent_robbed.delete(target.id);
				} , 150000);
            }

            return;
            //return interaction.reply({content: "soon", ephemeral:true})
        }

        if (subcommand === "transfer") {
            const usr = interaction.user
			const target = interaction.options.getUser("user");

            const amount = interaction.options.getInteger("amount");

            if(target.bot){
                const embed = new EmbedBuilder()
                        .setTitle("Transfer Patzicoins to a bot?")
                        .setDescription(`**You can't transfer PatziCoins to bots!**`)
                        .setColor("#FF0000")
                interaction.reply({embeds: [embed]});
        
                return;
            }

            if(target.id == interaction.user.id) {
                const embed = new EmbedBuilder()
                        .setTitle("Transfer Patzicoins to a bot? ...yourself...")
                        .setDescription(`**You can't transfer PatziCoins to yourself!**`)
                        .setColor("#FF0000")
                interaction.reply({embeds: [embed]});
        
                return 0;
            }

            return await require("../../patzicoin-functions/transfer.js").transfer(usr, target, amount, interaction);
        }
	},
};