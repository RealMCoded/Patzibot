const { Events, WebhookClient, EmbedBuilder } = require('discord.js');
const { joinleaveHook } = require("../config.json")

module.exports = {
	name: Events.GuildMemberAdd,
	execute(member) {
		const wh = new WebhookClient({ url: joinleaveHook })

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} has joined ${member.guild.name}!`)
            .setDescription(`Hi hi hi **${member.user.username}**, Welcome to **${member.guild.name}**!\nWe now have \`${member.guild.memberCount}\` members.`)
            .setThumbnail(member.user.displayAvatarURL())
            .setImage("https://cdn.discordapp.com/attachments/876731478980050994/1353232137897119796/image.png?ex=67e0e723&is=67df95a3&hm=7adb370adacff0b6703bc827e0a073be172c275ccc92f63db42ed7049c92d9c3&")
            .setColor(0x57F287);

        wh.send({
            username: member.guild.name,
            avatarURL: `https://cdn.discordapp.com/icons/909565157116608573/${member.guild.icon}.webp`,
            embeds: [embed]
        })
	},
};