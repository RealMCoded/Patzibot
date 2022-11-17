const { MessageEmbed } = require('discord.js');
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
			var verified = false

			var invstr = ""
			for(var i=0; i < inv.length; i++){
				try {
				var item = inv[i]
				var itemname = store[item].item
					if (item == 10) {
						verified = true
					}
				} catch(e){
					var itemname = `Undefined item #${item+1}` 
				}
				invstr = invstr + itemname + "\n"
			}
			if(invstr == ""){
				invstr = "( empty )\n"
			}

			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Stats for ${usrnm.tag} ${(verified == true ? '<:useless_tick:1042895519552389191>' : '')}`)
				.setColor("#0099ff")
				.setDescription(`**PatziCoins**: ${correct} 🪙\n**Bank Balance**: ${bank}/${bankMaxBal}\n\n**Inventory**:\n\`\`\`${invstr}\`\`\``)
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