const { Events, WebhookClient, EmbedBuilder } = require('discord.js');
const { joinleaveHook } = require("../config.json")

module.exports = {
	name: Events.GuildMemberRemove,
	execute(member) {
		const wh = new WebhookClient({ url: joinleaveHook })

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} has left ${member.guild.name}!`)
            .setDescription(`We now have \`${member.guild.memberCount}\` members.`)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(0xED4245);

        wh.send({
            username: member.guild.name,
            avatarURL: `https://cdn.discordapp.com/icons/909565157116608573/${member.guild.icon}.webp`,
            embeds: [embed]
        })
	},
};