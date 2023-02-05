const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v9');
const {MessageEmbed} = require('discord.js');
const death = require('./resources/json/death.json')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Kill')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        var typeOfDeath = Math.floor(Math.random() * 2);
        const deathMessages = death.deathmessages[typeOfDeath]
        const victim = interaction.targetUser;
        const cause = interaction.user;

        var todString = "";

        switch (typeOfDeath) {
            case 0:
                todString = "player"
                break;
            case 1:
                todString = "general"
                break;
        }

        var deathMessage = deathMessages[todString][Math.floor(Math.random() * Object.keys(deathMessages[todString]).length)].text;
        var deathMessage2 = "";

        switch (todString) {
            case "player":
                deathMessage2 = `<@!${victim.id}> ${deathMessage} <@!${cause.id}>`;
                break;
            case "general":
                deathMessage2 = `<@!${victim.id}> ${deathMessage}`;
                break;
        }
        const embed = new MessageEmbed()
            .setTitle('You Died!')
            .setDescription(deathMessage2)
            .setColor('#910700');
        await interaction.reply({embeds: [embed]});
    },
};