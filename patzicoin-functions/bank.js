const { MessageEmbed } = require('discord.js');
const { bankMaxBal } = require('../config.json');

module.exports = {
    async bank(mode, amount, tag, interaction){
			if (!tag) {
				const embed = new MessageEmbed()
						.setTitle("PatziCoins")
						.setDescription(`**You don't have any PatziCoins!**`)
						.setColor("#FF0000")
				return interaction.reply({embeds: [embed]});
			}

			//check if amount is above 0
			if (amount < 0) {
				const embed = new MessageEmbed()
						.setTitle("Withdraw PatziCoins")
						.setDescription(`**You can't withdraw negative PatziCoins!**`)
						.setColor("#FF0000")
				return interaction.reply({embeds: [embed]});
			}

			if (mode == 1) {
				if(amount == 0) amount = tag.coins
				if (amount > tag.coins) {
					const embed = new MessageEmbed()
						.setTitle("Deposit PatziCoins")
						.setDescription(`**You can't withdraw negative PatziCoins!**`)
						.setColor("#FF0000")
					return interaction.reply({embeds: [embed]});
				} else if ((amount + tag.bank) > bankMaxBal) {
					const embed = new MessageEmbed()
						.setTitle("Deposit PatziCoins")
						.setDescription(`**You can't have more than ${bankMaxBal} PatziCoins in your bank! You are ${(amount + tag.bank) - bankMaxBal} over!**`)
						.setColor("#FF0000")
					return interaction.reply({embeds: [embed]});
				} else {
					tag.update({
						coins: tag.coins - amount,
						bank: tag.bank + amount
					});
					const embed = new MessageEmbed()
						.setTitle("Deposit PatziCoins")
						.setDescription(`You've deposited **${amount}** PatziCoins into your bank!\nYour bank balance is now **${tag.bank}**.`)
						.setColor("#00ff00")
					interaction.reply({embeds: [embed]});
				}
			} else if (mode == 2) {
				if(amount == 0) amount = tag.bank
				if (amount > tag.bank) {
					const embed = new MessageEmbed()
						.setTitle("Withdraw PatziCoins")
						.setDescription(`You cannot withdraw negative PatziCoins!`)
						.setColor("#FF0000")
					return interaction.reply({embeds: [embed]});
				} else {
					tag.update({
						coins: tag.coins + amount,
						bank: tag.bank - amount
					});
					const embed = new MessageEmbed()
						.setTitle("Withdraw PatziCoins")
						.setDescription(`You've withdrawn **${amount}** PatziCoins from your bank!`)
						.setColor("#00ff00")
					interaction.reply({embeds: [embed]});
				}
			} else if (mode == 3) {
				const embed = new MessageEmbed()
					.setTitle("PatziCoin Bank")
					.setDescription(`You have **${tag.bank}** PatziCoins in your bank!`)
				interaction.reply({embeds: [embed]});
			}
    }
}