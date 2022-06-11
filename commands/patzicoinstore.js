const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const shp = require('./resources/json/store.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patzicoin-store')
		.setDescription(`patzercon`)
		.addSubcommand(subcommand => 
			subcommand.setName("view")
				.setDescription("View the store")
				.addIntegerOption(option =>
					option.setName('offsale')
						.setDescription('Show offsale items? (Default: false)')
						.setRequired(false)
						.addChoice('True', 1)
						.addChoice('False', 0)))
		.addSubcommand(subcommand => 
			subcommand.setName("buy")
				.setDescription("buy an item")
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("item")
						.setDescription("The Item ID in the shop")))
		.addSubcommand(subcommand => 
			subcommand.setName("info")
				.setDescription("see the info of an item")
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("item")
						.setDescription("The Item ID in the shop"))),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const db = interaction.client.db.Patzicoin;

		if (subcommand == "view") {
			var shop = ""

			for(var i = 0; i < shp.length; i++){
				var showOffsale = interaction.options.getInteger('offsale') || 0
				if(showOffsale == 1) {
					if(shp[i].forSale == true) {
						shop += `${i+1}. ${shp[i].item} - **${shp[i].price}** 🪙\n"${shp[i].desc}"\n\n`
					} else {
						shop += `~~${i+1}. ${shp[i].item} - **${shp[i].price}** 🪙\n"${shp[i].desc}"~~\n\n`
					}
				} else {
					if(shp[i].forSale == true) {
						shop += `${i+1}. ${shp[i].item} - **${shp[i].price}** 🪙\n"${shp[i].desc}"\n\n`
					}
				}
			}

			const embed = new MessageEmbed()
				.setTitle("Patzicoin store")
				.setDescription(shop)
				.setThumbnail("https://cdn.discordapp.com/attachments/808339703547428884/982120176571011072/iconmonstr-shop-3-240.png?size=2048")
			interaction.reply({embeds: [embed]});
		} else if(subcommand == "buy"){
			var item = interaction.options.getInteger('item');

			if(item > shp.length){
				interaction.reply({content:`⚠ **Invalid item!**`,ephemeral: true});
				return;
			}

			if(shp[item].forSale == false){
				interaction.reply({content:`⚠ **This item is not for sale!**`,ephemeral: true});
				return;
			}

			var dbusr = await db.findOne({ where: { userID: interaction.user.id } });

			if(!dbusr){
				interaction.reply({content:`⚠ **if you are seeing this, you have never earned a singular patzicoin. ever.**`,ephemeral: true});
				return;
			}
			var coin = dbusr.get("coins");
			var inve = dbusr.get("inv");
			inve = JSON.parse(inve);

			if(coin < shp[item-1].price){
				interaction.reply({content:`⚠ **You do not have enough Patzicoins!**`,ephemeral: true});
				return;
			}

			if(inve.includes(item-1)){
				interaction.reply({content:`⚠ **You already have this item!**`,ephemeral: true});
				return;
			}

			inve.push(item-1);
			inve = JSON.stringify(inve);

			db.update({
				coins: dbusr.coins - shp[item-1].price,
				inv: inve
			}, {
				where: { userID: interaction.user.id },
			});

			const embed = new MessageEmbed()
				.setTitle("Purchase successful!")
				.setDescription(`**You have bought the item!**\n\n**Item:** ${shp[item-1].item}\n**Price:** ${shp[item-1].price} Patzicoins\n**Description:** ${shp[item-1].desc}`)
				.setThumbnail("https://cdn.discordapp.com/attachments/808339703547428884/982120176571011072/iconmonstr-shop-3-240.png?size=2048")
			interaction.reply({embeds: [embed]});

			//interaction.reply({content:`✅ **You have bought the item!**\n\n**Item:** ${shp[item-1].item}\n**Price:** ${shp[item-1].price} Patzicoins\n**Description:** ${shp[item-1].desc}`});
		} else if(subcommand == "info"){
			var item = interaction.options.getInteger('item');

			if(item > shp.length){
				interaction.reply({content:`⚠ **Invalid item!**`,ephemeral: true});
				return;
			}

			const embed = new MessageEmbed()
				.setTitle(`Patzicoin Store - Item ${item}`)
				.setDescription(`**Item:** ${shp[item-1].item}\n**Price:** ${shp[item-1].price} Patzicoins\n**Description:** ${shp[item-1].desc}`)
				.setThumbnail("https://cdn.discordapp.com/attachments/808339703547428884/982120176571011072/iconmonstr-shop-3-240.png?size=2048")
			interaction.reply({embeds: [embed]});
		}
	},
};