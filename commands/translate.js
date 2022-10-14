const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch');
const languageName = new Intl.DisplayNames(['en'], { type: 'language' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription(`Translate a phrase`)
			.addStringOption(string =>
				string.setName("text")
					.setRequired(true)
					.setDescription("the text to translate"))
							.addStringOption(string =>
								string.setName("to")
									.setRequired(true)
									.setDescription("the language to translate to")
									.addChoice("English", "en")
									.addChoice("Arabic", "ar")
									//.addChoice("Azerbaijani", "ax")
									.addChoice("Chinese", "zh")
									//.addChoice("Czech", "cs")
									//.addChoice("Dutch", "nl")
									//.addChoice("Finnish", "fi")
									.addChoice("French", "fr")
									.addChoice("German", "de")
									.addChoice("Hindi", "hi")
									//.addChoice("Hungarian", "hu")
									.addChoice("Indonesian", "id")
									.addChoice("Irish", "ga")
									.addChoice("Italian", "it")
									.addChoice("Japanese", "ja")
									.addChoice("Korean", "ko")
									.addChoice("Polish", "pl")
									.addChoice("Portuguese", "pt")
									.addChoice("Russian", "ru")
									.addChoice("Spanish", "es")
									//.addChoice("Swedish", "sv")
									.addChoice("Turkish", "tr")
									.addChoice("Vietnamese", "vi"))
						.addStringOption(string =>
							string.setName("from")
								//.setRequired(true)
								.setDescription("the language to translate from - leave blank for auto-detection")
								.addChoice("AutoDetect", "auto")
								.addChoice("English", "en")
								.addChoice("Arabic", "ar")
								//.addChoice("Azerbaijani", "ax")
								.addChoice("Chinese", "zh")
								//.addChoice("Czech", "cs")
								//.addChoice("Dutch", "nl")
								//.addChoice("Finnish", "fi")
								.addChoice("French", "fr")
								.addChoice("German", "de")
								.addChoice("Hindi", "hi")
								//.addChoice("Hungarian", "hu")
								.addChoice("Indonesian", "id")
								.addChoice("Irish", "ga")
								.addChoice("Italian", "it")
								.addChoice("Japanese", "ja")
								.addChoice("Korean", "ko")
								.addChoice("Polish", "pl")
								.addChoice("Portuguese", "pt")
								.addChoice("Russian", "ru")
								.addChoice("Spanish", "es")
								//.addChoice("Swedish", "sv")
								.addChoice("Turkish", "tr")
								.addChoice("Vietnamese", "vi")),
	async execute(interaction) {
		let _f= interaction.options.getString('from')
		if (!_f) _f = "auto"
		const res = await fetch("https://translate.argosopentech.com/translate", {
			method: "POST",
			body: JSON.stringify({
				q: interaction.options.getString('text'),
				source: _f,
				target: interaction.options.getString('to')
			}),
			headers: { "Content-Type": "application/json" }
		});

		const json = await res.json();
		const embed = new MessageEmbed()
            .setTitle(`Translation`)
            .setDescription(`**${languageName.of(_f)}**: "${interaction.options.getString('text')}"\n**${languageName.of(interaction.options.getString('to'))}**: "${json.translatedText}"`)
			.setFooter({text: `Translation may not be 100% accurate.`})
        await interaction.reply({embeds: [embed]});
	},
};