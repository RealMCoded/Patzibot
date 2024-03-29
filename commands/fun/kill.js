const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const death = require('../../resources/json/death.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('Kill someone in Minecraft style')
    .addUserOption(option => option.setName('victim').setDescription('the chosen one').setRequired(true)),
    async execute(interaction) {
        var typeOfDeath = Math.floor(Math.random() * 2);
        const deathMessages = death.deathmessages[typeOfDeath]
        const victim = interaction.options.getUser('victim');
        var todString = "";
        //console.log(typeOfDeath)

        switch (typeOfDeath) {
            case 0:
                todString = "player"
                break;
            case 1:
                todString = "general"
                break;
        }

        //console.log(todString + "\n" + victim.id)
        var deathMessage = deathMessages[todString][Math.floor(Math.random() * Object.keys(deathMessages[todString]).length)].text;
        var deathMessage2 = "";

        switch (todString) {
            case "player":
                deathMessage2 = `<@!${victim.id}> ${deathMessage} <@!${interaction.user.id}>`;
                break;
            case "general":
                deathMessage2 = `<@!${victim.id}> ${deathMessage}`;
                break;
        }

        const embed = new EmbedBuilder()
            .setTitle('You Died!')
            .setDescription(deathMessage2)
            .setColor('#910700');
        await interaction.reply({embeds: [embed]});
    },
};