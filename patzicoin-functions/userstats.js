const { EmbedBuilder, codeBlock } = require("discord.js")
const store = require("../resources/json/items.json")
const { emojis } = require("../config.json")
const { getOccurrence, isBooster } = require("../util.js")
const { bankMaxBal } = require("../config.json")

/**
 * 
 * @param {string} user 
 * @param {db} db 
 * @param {interaction} interaction 
 * @returns interaction
 */
async function userstats(user, db, interaction) {
    user = await interaction.client.users.fetch(user.id);

    if (db) {
        const coins = db.get("coins")
        const inventory = JSON.parse(db.get("inv"))
        const bank = db.get("bank")
        let inventory_output = ""

        //Sorting and grouping inventory
        const frequency = {}
        const result = [];

        for(const item of inventory) {
            if (frequency[item]) {
                frequency[item]++
            } else {
                frequency[item] = 1
            }
        }

        for (const item in frequency) {
            try {
                result.push(frequency[item] === 1 ? `+ ${store[item].item}` : `+ ${store[item].item} (x${frequency[item]})`);
            } catch(e) {
                result.push(frequency[item] === 1 ? store[item].item : `*** Unknown Item #${item} (x${frequency[item]})`);
            }
        }

        for (const res in result) {inventory_output += `${result[res]}\n`}
        if (inventory_output === "") inventory_output = "- ( empty )\n"

        let verifiedChecks = getOccurrence(inventory, 10)

		let titleString = `PatziCoin Stats for ${user.username} ${isBooster(interaction.member) ? `${emojis.boost} ` : " "}${(`${emojis.useless_tick} `.repeat(verifiedChecks))}`

		const embed = new EmbedBuilder()
			.setTitle(titleString.substring(0, 255))
			.setColor("#0099ff")
			//.setDescription(`**PatziCoins**: ${coins} 🪙\n**Bank Balance**: ${bank}/${bankMaxBal}`)
            .setDescription(`**Inventory**\n${codeBlock("diff", inventory_output)}`)
			.addFields(
				//{ name: `Inventory`, value: codeBlock("diff", inventory_output)},
                { name: 'PatziCoins', value: `${coins} 🪙`, inline: true },
		        { name: 'Bank Balance', value: `${bank}/${bankMaxBal}`, inline: true },
			)
			.setTimestamp()

		return interaction.reply({embeds: [embed]});
    } else {
        const embed = new EmbedBuilder()
				.setTitle(`PatziCoin Stats for ${user.username}`)
				.setColor("#0099ff")
				.setDescription(`***No stats found for ${user.username} :(***`)
				.setTimestamp()

		return interaction.reply({embeds: [embed]});
    }
}

module.exports = {userstats}