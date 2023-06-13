const { MessageEmbed } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { formatUsername } = require("../util.js")

module.exports = {
    async lb(page, db, interaction){
        await interaction.deferReply();
			var timr = setTimeout(() => {
                // notify the user why it's taking so damn long
                interaction.editReply(`<a:typing:944765274475864094> ***This is taking longer than expected. To be under fair use of Discord's API, we need to slow requests down a little so we don't get our ass beaten. We currently wait 25 milliseconds between each request.\n\n(We're at ${gli}/${list.length} users btw!)***`);
                }, 10000);
			var le = ""
			list = await db.findAll({
				attributes: ['coins', 'bank', 'userID']
			})

			list = list.sort((a, b) => (b.coins + b.bank) - (a.coins + a.bank));
			list = list.slice((page-10), page);

			for(var i=0; i < list.length; i++){
				//TODO: Prevent rate limiting for this, causing it to hang. - mildly fixed
				var gli = i
				let user = await interaction.client.users.fetch(list[i].userID);
				if(user){
					var le = le + "**#" + ((i+1)+(page-10)).toString() + "** | `" + formatUsername(user) + "`: **" + (list[i].coins + list[i].bank).toString() + "** 🪙 "+ (list[i].userID == interaction.user.id ? ' < __You__' : '') + "\n"
				} else {
					var le = le + "**#" + (i+1).toString() + "** | `Unknown#" + list[i].userID + "`: **" + (list[i].coins + list[i].bank).toString() + "** 🪙"+ (list[i].userID == interaction.user.id ? ' < __You__' : '') + "\n"
				}
				//console.log(`[patzicoin.js] FETCHED! (${i+1} / ${list.length})\n`)
				await wait(250);
			}

			const embed = new MessageEmbed()
				.setTitle(`PatziCoin Leaderboard | Page ${(page/10).toString()}`)
				.setColor("#0099ff")
				.setDescription(`${le}`)
				.setTimestamp()
			clearTimeout(timr)
			return interaction.editReply({ content:"_ _", embeds: [embed]});
    }
}