const { MessageEmbed } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');
const { getOccurrence } = require('../util.js')
const store = require(`../commands/resources/json/items.json`)
const { bankMaxBal } = require('../config.json');

module.exports = {
    async userstats(usr, tag, interaction){
        let usrnm = await interaction.client.users.fetch(usr.id);
              
        if (tag) {
			const correct = tag.get("coins")
			const invjson = tag.get("inv")
			const bank = tag.get("bank")
			const inv = JSON.parse(invjson)
			const frequency = {}
			var invstr = ""
			const result = [];

			for (const item of inv) {
				if (frequency[item]) {
					frequency[item]++;
				} else {
					frequency[item] = 1;
				}
			}

			for (const item in frequency) {
				try {
					result.push(frequency[item] === 1 ? `+ ${store[item].item}` : `+ ${store[item].item} (x${frequency[item]})`);
				} catch(e) {
					result.push(frequency[item] === 1 ? store[item].item : `*** Unknown Item #${item} (x${frequency[item]})`);
				}
			}

			for (const res in result) {invstr += `${result[res]}\n`}

			if(invstr == ""){invstr = "- ( empty )\n"}

			let verifiedChecks = getOccurrence(inv, 10)

			let titleString = `PatziCoin Stats for ${usrnm.tag} ${('<:useless_tick:1042895519552389191> '.repeat(verifiedChecks))}`

			const embed = new MessageEmbed()
				.setTitle(titleString.substring(0, 255))
				.setColor("#0099ff")
				.setDescription(`**PatziCoins**: ${correct} 🪙\n**Bank Balance**: ${bank}/${bankMaxBal}`)
				.addFields(
					{ name: `Inventory`, value: codeBlock("diff", invstr)},
				)
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
    }
}