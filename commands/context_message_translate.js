const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v9');
const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch');
const languageName = new Intl.DisplayNames(['en'], { type: 'language' });

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('translate')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		var msgContent = interaction.targetMessage.content
		await interaction.deferReply();
		let _f = "auto"
		let _t = "en"
		//if (!_f) _f = "auto"
		const res = await fetch("https://translate.argosopentech.com/translate", {
			method: "POST",
			body: JSON.stringify({
				q: msgContent,
				source: _f,
				target: _t
			}),
			headers: { "Content-Type": "application/json" }
		});

		const json = await res.json();
		const embed = new MessageEmbed()
            .setTitle(`Translation`)
            .setDescription(`**${languageName.of(_f)}**: "${msgContent}"\n**${languageName.of(_t)}**: "${json.translatedText}"`)
			.setFooter({text: `Translation may not be 100% accurate.`})
        await interaction.editReply({embeds: [embed]});
	},
};