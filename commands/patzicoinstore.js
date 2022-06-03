const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const shp = require('./resources/json/store.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patzicoin-store')
		.setDescription(`patzercon`)
		.addSubcommand(subcommand => 
			subcommand.setName("view")
				.setDescription("View the store")),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const db = interaction.client.db.Patzicoin;

		if (subcommand == "view") {
			var shop = ""

			for(var i = 0; i < shp.length; i++){
				shop += `${i+1}. ${shp[i].item} - **${shp[i].price}** 🪙\n"${shp[i].desc}"\n\n`
			}

			const embed = new MessageEmbed()
				.setTitle("Patzicoin store")
				.setDescription(shop)
				.setThumbnail("https://cdn.discordapp.com/attachments/808339703547428884/982120176571011072/iconmonstr-shop-3-240.png?size=2048")
			interaction.reply({embeds: [embed]});
		}
	},
};