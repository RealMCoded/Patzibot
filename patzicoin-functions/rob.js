const { changePatzicoins } = require("./patzicoin")
const { random_range } = require("../util")
const { EmbedBuilder } = require("discord.js")

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

async function rob(user, user_db, target_user, target_db, interaction) {
    /*
        return 0 - fail
        return 1 - pass
    */

    //checks to see if robbing is valid.
    if(target_user.bot){
        const embed = new EmbedBuilder()
                .setTitle("Robbing a bot! - PatziCoin")
                .setDescription(`**You can't rob bots!**`)
                .setColor("#FF0000")
        interaction.reply({embeds: [embed]});

        return 0;
    }
    if(user == target_user) {
        const embed = new EmbedBuilder()
                .setTitle("Robbing ...yourself... - PatziCoin")
                .setDescription(`**You can't rob yourself!**`)
                .setColor("#FF0000")
        interaction.reply({embeds: [embed]});

        return 0;
    }
    if (!user_db) {
        const embed = new EmbedBuilder()
            .setTitle(`Robbing ${target_user.username} - PatziCoin`)
            .setDescription(`You don't have any PatziCoins!`)
            .setColor("#ff0000")
        interaction.reply({embeds: [embed]});

        return 0;
    }
    if (!target_db) {
        const embed = new EmbedBuilder()
            .setTitle(`Robbing ${target_user.username} - PatziCoin`)
            .setDescription(`**${target_user.username}** doesn't have any PatziCoins!`)
            .setColor("#ff0000")
        interaction.reply({embeds: [embed]});

        return 0;
    }

    const chance = random_range(0, 100)

    if (chance < 0) {
        const embed = new EmbedBuilder()
            .setTitle(`Robbing ${target_user.username} - PatziCoin`)
            .setDescription(`You tried to rob **${target_user.username}**, but they got away!`)
            .setColor("#ff0000")
        interaction.reply({embeds: [embed]});

        return 1;
    } else {
        const stole = Math.floor(Math.random() * (clamp(target_db.coins, 0, 2763) - 1)) + 1; //1-targetTag.coins
        const embed = new EmbedBuilder()
            .setTitle(`Robbing ${target_user.username} - PatziCoin`)
            .setDescription(`**You've successfully robbed ${target_user.username}**!\nYou stole **${stole}** PatziCoins from them!`)
            .setColor("#00ff00")
        interaction.reply({embeds: [embed]});

        changePatzicoins(target_user.id, -stole)

        changePatzicoins(user.id, stole)

        return 1;
    }
}

module.exports = {rob}