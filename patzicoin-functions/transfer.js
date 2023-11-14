const { transferTax } = require("../config.json")
const { changePatzicoins, getPatzicoins } = require("./patzicoin")
const { EmbedBuilder } = require("discord.js")

async function transfer(user, target, amount, interaction) {
    const finalAmount = amount - (amount * transferTax)

    const userCoins = await getPatzicoins(user.id)

    console.log(userCoins)

    if (await getPatzicoins(user.id) < amount) {
        const embed = new EmbedBuilder()
            .setTitle(`Transfer Patzicoins to ${user.username}`)
            .setDescription(`You don't have that many Patzicoins!`)
            .setColor("#00ff00")
        return interaction.reply({embeds: [embed]});
    }

    changePatzicoins(user.id, -amount)
    changePatzicoins(target.id, finalAmount)

    const embed = new EmbedBuilder()
        .setTitle(`Transfer Patzicoins to ${user.username}`)
        .setDescription(`You transfered **${finalAmount}** (${amount} - (${amount} x ${transferTax})) to ${target}!`)
        .setColor("#00ff00")
    return interaction.reply({embeds: [embed]});
}

module.exports = {transfer}