const { MessageEmbed } = require('discord.js');

module.exports = {
    async serverstats(db, interaction){
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
			.setDescription(`**Total Users with PatziCoins**: ${list.length}\n**Total PatziCoins**: ${le} 🪙 (avg. ${Math.round((le/list.length)*100)/100} per member)\n**Total Bank**: ${le2}`)
			.setTimestamp()
		return interaction.reply({embeds: [embed]});
    }
}