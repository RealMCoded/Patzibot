const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const shop = require("../../resources/json/items.json")
const patzicoin = require("../../patzicoin-functions/patzicoin.js")

const addStoreListing = (item) =>{
    return {
        name: `\`${parseInt(item)+1}\` | ${shop[item].item} - **${shop[item].price}** 🪙`,
        value: shop[item].desc
    }
}

module.exports = {
	data: new SlashCommandBuilder()
    .setName('patzicoin-store')
    .setDescription(`The store where you can buy stuff with PatziCoins!`)
    .addSubcommand(subcommand => 
        subcommand.setName("view")
            .setDescription("View the store")
            .addBooleanOption(option =>
                option.setName('offsale')
                    .setDescription('Show offsale items? (Default: false)')
                    .setRequired(false)))
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

        if (subcommand === "view") {
            let store_output = []
            const showOffsale = interaction.options.getBoolean('offsale') || false

            for(const item in shop) {
                if (shop[item].showInStore) {
                    if (showOffsale) {
                        store_output[item] = addStoreListing(item)
                    } else {
                        if (shop[item].forSale) store_output[item] = addStoreListing(item)
                    }
                }
            }

            const embed = new EmbedBuilder()
				.setTitle("Patzicoin Store")
				//.setURL("https://realmcoded.github.io/PatziCoinStore/")
				//.setDescription(shop)
                .addFields(store_output.filter(n => n))
				.setThumbnail("https://cdn.discordapp.com/attachments/808339703547428884/982120176571011072/iconmonstr-shop-3-240.png?size=2048")
			return interaction.reply({embeds: [embed]});
        }

        if (subcommand === "info") {
            const item = interaction.options.getInteger('item');

            if((item > shop.length) || (item < 1)){
				return interaction.reply({content:`⚠️️ **Invalid item!**`,ephemeral: true});
			}

            const shopItem = shop[item-1]

            const embed = new EmbedBuilder()
				.setTitle(`Patzicoin Store - ${shopItem.item}`)
                .setDescription(`"${shopItem.desc}"`)
                .addFields(
                    { name: 'Price', value: `${shopItem.price} 🪙`, inline: true },
                    { name: 'For sale?', value: `${shopItem.forSale}`, inline: true },
                    { name: 'Can own multiple?', value: `${shopItem.canOwnMultiple}`, inline: true },
                    { name: 'Resellable?', value: `${shopItem.canResell}`, inline: true },
                    { name: 'Tradable', value: `${shopItem.canTrade}`, inline: true },
                    { name: 'Unlisted?', value: `${!shopItem.showInStore}`, inline: true },
                )
				//.setDescription(`**Name:** ${shp[item-1].item}\n**Price:** ${shp[item-1].price} Patzicoins\n**Description:** ${shp[item-1].desc}\n**For sale:** ${shp[item-1].forSale}\n**Can own Multiple:** ${shp[item-1].canOwnMultiple}\n**Can resell?:** ${shp[item-1].canResell}\n**Can be traded?:** ${shp[item-1].canTrade}`)
				.setThumbnail(shopItem.iconURL)
			interaction.reply({embeds: [embed]});
        }

        if (subcommand === "buy") {
            const item = interaction.options.getInteger('item')-1;
            const userCoins = await patzicoin.getPatzicoins(interaction.user.id)

            if(item > shop.length || item < -1){
				return interaction.reply({content:`⚠️ **Invalid item!**`,ephemeral: true});
			}

			if(shop[item].forSale == false){
				return interaction.reply({content:`⚠️ **This item is not currently for sale!**`,ephemeral: true});
			}

            if(shop[item].price > userCoins){
				return interaction.reply({content:`❌ **You don't have enough Patzicoins!**\nYou need **${userCoins - shop[item].price}** more!`,ephemeral: true});
			}

            const itemGrant = patzicoin.grantItem(interaction.user.id, item)

            if (itemGrant.error) {
                return interaction.reply(interaction.reply({ content: `❌ ${itemGrant.error}`, ephemeral: true }))
            }

            patzicoin.changePatzicoins(interaction.user.id, -shop[item].price)

            const embed = new EmbedBuilder()
				.setTitle("Purchase successful!")
                .setDescription(`You purchased **${shop[item].item}**!`)

				//.setDescription(`**You have bought the item!**\n\n**Item:** ${shp[item-1].item}\n**Price:** ${shp[item-1].price} Patzicoins\n**Description:** ${shp[item-1].desc}`)
				.setThumbnail(shop[item].iconURL)
			interaction.reply({embeds: [embed]});
        }
    },
};