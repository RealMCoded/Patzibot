/*
    I stole the idea from zai's bot xaiSharp 
*/

const { Events, WebhookClient, EmbedBuilder } = require('discord.js');
const { logWebhookURL, ignoreChannels } = require("../config.json")

module.exports = {
	name: Events.MessageReactionAdd,
	once: false,
	async execute(reaction, user) {
        // When a reaction is received, check if the structure is partial
        if (reaction.message.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.message.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        if (reaction.message.pinned || ignoreChannels.includes(reaction.message.channel.id)) return;

        let upCount, downCount

        try {
            upCount = reaction.message.reactions.cache.get('⬆️').count
        } catch(e) {
            upCount = 0
        }
        
        try {
            downCount = reaction.message.reactions.cache.get('⬇️').count
        } catch(e) {
            downCount = 0
        }

        const count = downCount - upCount

        let msg = reaction.message
        let messageContent = reaction.message.content

        reaction.message.attachments.forEach((attachment) => {
            const attachmentURL = attachment.attachment;
            messageContent += `\n${attachmentURL}`
          });

        if (count > 4 ){
            const wh = new WebhookClient({ url: logWebhookURL })

            const embed = new EmbedBuilder()
                .setTitle(`Message deleted (by community)`)
                .setDescription(`${messageContent}`)
                .setFooter({ text: `Author: ${msg.author.username} (${msg.author.id})`})
                .setTimestamp();

            wh.send({
                username: "Bad Message",
                embeds: [embed]
            })

            msg.delete()
        } else if ( reaction.message.author == user && reaction.emoji.name == "⬆️" ) {
            const wh = new WebhookClient({ url: logWebhookURL })

            const embed = new EmbedBuilder()
                .setTitle(`Message deleted (Self upvote)`)
                .setDescription(`${messageContent}`)
                .setFooter({ text: `Author: ${msg.author.username} (${msg.author.id})`})
                .setTimestamp();

            wh.send({
                username: "Bad Message",
                embeds: [embed]
            })

            msg.delete()
        }
	},
};