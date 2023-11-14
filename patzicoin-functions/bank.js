const { EmbedBuilder } = require('discord.js');
const { bankMaxBal } = require('../config.json');
/*
MODES

1 - Deposit
2 - Withdraw
3 - Balance
*/

async function bankDeposit(amount, tag, interaction) {
    if(amount == 0) amount = tag.coins //force to user's current coins if amount is 0

    if (amount > tag.coins) {
        const embed = new EmbedBuilder()
			.setTitle("Deposit PatziCoins")
			.setDescription(`**You don't have that many Patzicoins!**\nYou only have ${tag.coins} coins!`)
			.setColor("#FF0000")
		return interaction.reply({embeds: [embed]});
    } else if ((amount + tag.bank) > bankMaxBal) {
        const embed = new EmbedBuilder()
			.setTitle("Deposit PatziCoins")
			.setDescription(`**You can't have more than ${bankMaxBal} PatziCoins in your bank!**\nYou are **${(amount + tag.bank) - bankMaxBal}** over!`)
			.setColor("#FF0000")
		return interaction.reply({embeds: [embed]});
    } else {
        tag.update({
            coins: tag.coins - amount,
            bank: tag.bank + amount
        });
        const embed = new EmbedBuilder()
            .setTitle("Deposit PatziCoins")
            .setDescription(`You've deposited **${amount}** PatziCoins into your bank!\nYour bank balance is now **${tag.bank}**.`)
            .setColor("#00ff00")
        interaction.reply({embeds: [embed]});
    }
}

async function bankWithdraw(amount, tag, interaction) {
    if(amount == 0) amount = tag.bank

    if (amount > tag.bank) {
        const embed = new EmbedBuilder()
            .setTitle("Withdraw PatziCoins")
            .setDescription(`**You don't have this much in your bank!**`) //TODO: Better message?
            .setColor("#FF0000")
        return interaction.reply({embeds: [embed]});
    } else {
        tag.update({
            coins: tag.coins + amount,
            bank: tag.bank - amount
        });
        const embed = new EmbedBuilder()
            .setTitle("Withdraw PatziCoins")
            .setDescription(`You've withdrawn **${amount}** PatziCoins from your bank!\nYour bank balance is now **${tag.bank}**.`)
            .setColor("#00ff00")
        interaction.reply({embeds: [embed]});
    }
}

async function bankBalance(tag, interaction) {
    const embed = new EmbedBuilder()
		.setTitle("PatziCoin Bank")
		.setDescription(`You have **${tag.bank}/${bankMaxBal}** PatziCoins in your bank!`)
	interaction.reply({embeds: [embed]});
}

module.exports = {bankDeposit, bankWithdraw, bankBalance}