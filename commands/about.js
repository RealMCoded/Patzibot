const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const project = require('../package.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('patzibot')
        .setDescription('intro related commands')
        .addSubcommand(subcommand =>
            subcommand
            .setName("about")
            .setDescription("Learn more about me!"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("version")
            .setDescription("What version am i on? I don't know!"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("github")
            .setDescription("I'm open source! Yipee!")),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "version"){
            try {
                revision = require('child_process')
                    .execSync('git rev-parse HEAD')
                    .toString().substring(0, 7);
                //const currentTimestamp = Math.round(+new Date() / 1000);
                //const timestampColour = currentTimestamp.toString(16).substring(2, 10);
                const embed = new MessageEmbed()
                    .setTitle('PatziBot')
                    .setDescription(`Version ${project.version} ([commit \`${revision}\`](https://github.com/RealMCoded/PatziBot/commit/${revision}))\n\nBot created by stuartt#2419, Icon created by Patzi#0001.\n\`/kill\`, \`/quiz\` command created by Zai#1113`)
                    .setColor(`${revision.substring(0,6)}`);
                await interaction.reply({embeds: [embed]});
            } catch(e) {
                const embed = new MessageEmbed()
                    .setTitle('PatziBot')
                    .setDescription(`Version ${project.version} (\`git not installed :(\`)\n\nBot created by stuartt#2419, Icon created by Patzi#0001.\n\`/kill\`, \`/quiz\` command created by Zai#1113`)
                    .setColor(`FF0000`);
                await interaction.reply({embeds: [embed]});
            }
        } else if (subcommand == "about") {
            interaction.reply({content:`⚠ **The intro is not ready yet! Come back later.**`,ephemeral: true});
        } if (subcommand == "github") {
            interaction.reply({content:`https://github.com/RealMCoded/Patzibot`,ephemeral: true});
        }
    },
};