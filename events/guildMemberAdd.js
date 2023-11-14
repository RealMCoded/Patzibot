const { Events, WebhookClient, EmbedBuilder } = require('discord.js');
const { joinleaveHook } = require("../config.json")

module.exports = {
	name: Events.GuildMemberAdd,
	once: true,
	execute(member) {
		const wh = new WebhookClient({ url: joinleaveHook })

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} has joined ${member.guild.name}!`)
            .setDescription(`We now have **${member.guild.memberCount}** members.`)
            .setColor(0x00FFFF);

        wh.send({
            username: member.guild.name,
            avatarURL: `https://cdn.discordapp.com/icons/909565157116608573/${member.guild.icon}.webp`,
            embeds: [embed]
        })
	},
};