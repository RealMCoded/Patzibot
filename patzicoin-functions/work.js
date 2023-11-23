const { changePatzicoins, hasItem } = require("./patzicoin")
const { random_range } = require("../util")
const locations = require("../resources/json/job_locations.json")
const { EmbedBuilder } = require("discord.js")

async function work(method, userid, interaction) {
    const location = locations[method]

    if (location === undefined) {
        interaction.reply({content:`❌ **The location with the ID \`${method}\` doesn't exist!**`,ephemeral: true});
		return;
    }

    const hasApp = await hasItem(userid, location.requiredItemID)

    if (!hasApp) {
        interaction.reply({content:`❌ **You don't have the required item to work here!**`,ephemeral: true});
		return;
    }

    if(Math.random() < location.fail_percent){
        //fail
        const amount = random_range(location.fail_min, location.fail_max)

        const embed = new EmbedBuilder()
            .setTitle(location.action_name)
            .setColor(0xFF0000)
            .setDescription(location.fail_message.replace("{a}", amount))
        interaction.reply({embeds: [embed]});

        changePatzicoins(userid, -amount)
    } else {
        const amount = random_range(location.yeild_min, location.yeild_max)
        
        const embed = new EmbedBuilder()
            .setTitle(location.action_name)
            .setColor(0x00FF00)
            .setDescription(location.success_message.replace("{a}", amount))
        interaction.reply({embeds: [embed]});

        changePatzicoins(userid, amount)
    }

    return;
}

module.exports = {work}