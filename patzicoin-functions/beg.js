const { changePatzicoins } = require("./patzicoin")
const { random_range } = require("../util")
const { EmbedBuilder } = require("discord.js")

async function beg(db, interaction) {
    const delay = 18000
    const lastBeg= parseInt(db.get('lastBegClaimDate'))
    const now = Math.floor(Date.now() / 1000)

    if(now <= lastBeg+delay){
        //get time left between now and last beg
        const embed = new EmbedBuilder()
            .setTitle("Beg - PatziCoin")
            .setColor("#FF0000")
            .setDescription(`"Go away! You can beg again <t:${lastBeg+delay}:R> (<t:${lastBeg+delay}:f>)"\n -craig`)
            .setTimestamp()
        return interaction.reply({embeds: [embed]});
    } else {
        const amount = random_range(1, 125)

        changePatzicoins(interaction.user.id , amount)
        db.update({ lastBegClaimDate: now }, { where: { userID: interaction.user.id } });

        const embed = new EmbedBuilder()
			.setTitle("Beg - PatziCoin")
			.setColor("#00FF00")
			.setDescription(`"Here's **${amount} PatziCoins**, now go away!"\n -craig`)
			.setTimestamp()
		return interaction.reply({embeds: [embed]});
    }
}

module.exports = { beg }