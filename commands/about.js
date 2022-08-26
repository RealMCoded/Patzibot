const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const project = require('../package.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('who am i'),
    async execute(interaction) {
        revision = require('child_process')
            .execSync('git rev-parse HEAD')
            .toString().substring(0, 7);
        const currentTimestamp = Math.round(+new Date() / 1000);
        const timestampColour = currentTimestamp.toString(16).substring(2, 10);
        const embed = new MessageEmbed()
            //.setThumbnail("https://cdn.discordapp.com/avatars/876729461188464660/43fb19cac4985b40677f47e1d8b476d4.png?size=4096")
            .setTitle('PatziBot')
            .setDescription(`Version ${project.version} (commit \`${revision}\`)\n\nBot created by <@284804878604435476>\n\nIcon created by <@518567024545497113>\n\n\`/kill\`, \`/quiz\` command created by Zai#1113`)
            .setColor(`${timestampColour}`);
        await interaction.reply({embeds: [embed]});
    },
};