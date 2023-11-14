const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

async function leaderboard(page, db, interaction) {
    await interaction.deferReply();

    let leaderList = ""

    let list = await db.findAll({
        attributes: ['coins', 'bank', 'userID']
    })

    list = list.sort((a, b) => (b.coins + b.bank) - (a.coins + a.bank));
    list = list.slice((page-10), page);

    for(var i=0; i < list.length; i++){
        //TODO: Prevent rate limiting for this, causing it to hang. - mildly fixed
        let user = await interaction.client.users.fetch(list[i].userID);

        if (user) {
            leaderList += `**#${((i+1)+(page-10))}** | \`${user.username}\`: **${(list[i].coins + list[i].bank)}** 🪙${(list[i].userID == interaction.user.id ? ' < __You__' : '')}\n`
        } else {
            leaderList += `**#${((i+1)+(page-10))}** | \`Unknown#${list[i].userID}\`: **${(list[i].coins + list[i].bank)}** 🪙${(list[i].userID == interaction.user.id ? ' < __You__' : '')}\n`
        }

        await wait(250);
    }

    const embed = new EmbedBuilder()
		.setTitle(`PatziCoin Leaderboard | Page ${(page/10)}`)
		.setColor("#0099ff")
		.setDescription(`${leaderList}`)
		.setTimestamp()
	return interaction.editReply({ embeds: [embed]});
}

module.exports = {leaderboard}