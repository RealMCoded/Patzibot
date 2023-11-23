const { changePatzicoins } = require("./patzicoin")
const { random_range, isBooster } = require("../util")
const { EmbedBuilder } = require("discord.js")
const { boosterBegExtraPercent } = require("../config.json")

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
        const amount = random_range(5, 125)
        const memberBooster = isBooster(interaction.member)

        changePatzicoins(interaction.user.id , amount)
        if (memberBooster) {
            changePatzicoins(interaction.user.id , Math.round(amount*boosterBegExtraPercent))
        }
        db.update({ lastBegClaimDate: now }, { where: { userID: interaction.user.id } });

        const embed = new EmbedBuilder()
			.setTitle("Beg - PatziCoin")
			.setColor("#00FF00")
			.setDescription(`"Here's **${amount} PatziCoins**, ${memberBooster ? `and since you're a server booster, you get an extra **${Math.round(amount*boosterBegExtraPercent)} Patzicoins**! ` : ""}now go away!"\n -craig`)
            .setFooter({"text": `Server boosters get ${boosterBegExtraPercent*100}% extra PatziCoins when begging!`})
			.setTimestamp()
		return interaction.reply({embeds: [embed]});
    }
}

module.exports = { beg }