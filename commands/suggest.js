const {SlashCommandBuilder} = require('@discordjs/builders');
const { WebhookClient } = require('discord.js');
const { suggestHookID, suggestHookToken } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('suggest a feature for the bot')
        .addStringOption(option => option.setName('suggestion').setDescription('What\'s on your mind?').setRequired(true)),
    async execute(interaction) {
        const webhookClient = new WebhookClient({id: suggestHookID, token: suggestHookToken});
        var suggestion = interaction.options.getString('suggestion');

        if (suggestion.length > 2000){ 
            await interaction.reply({content: 'Your suggestion is too long. Please shorten it.', ephemeral: true});
            suggestion = 'The suggestion was too long.';
        }
        webhookClient.send({
            content: suggestion,
            username: interaction.user.username,
            avatarURL: interaction.user.avatarURL(),
        });
        await interaction.reply({content: 'Your suggestion was sent.', ephemeral: true});
    },
};