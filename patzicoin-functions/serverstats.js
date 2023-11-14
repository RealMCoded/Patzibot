const { EmbedBuilder } = require("discord.js")

async function serverStats(db, interaction) {
    let total_coin = 0;
    let total_bank = 0;

    const list = await db.findAll({
        attributes: ['coins', 'bank']
    })

    for(var i=0; i < list.length; i++){
        total_coin+=list[i].coins
        total_bank+=list[i].bank
    }

    const embed = new EmbedBuilder()
			.setTitle("Server Stats - PatziCoin")
			.setColor("#0099ff")
			.setDescription(`**Total Users with PatziCoins**: ${list.length}\n**Total PatziCoins**: ${total_coin} 🪙 (avg. ${Math.round((total_coin/list.length)*100)/100} per member)\n**Total Bank**: ${total_bank}`)
			.setTimestamp()
		return interaction.reply({embeds: [embed]});
}

module.exports = {serverStats}