const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const project = require("../../package.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('patzibot')
        .setDescription('intro related commands')
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
                const embed = new EmbedBuilder()
                    .setTitle('PatziBot')
                    .setDescription(`Version ${project.version} ([commit \`${revision}\`](https://github.com/RealMCoded/PatziBot/commit/${revision}))\n\nBot created by stuartt, Icon created by Patzi.\n\`/kill\`, \`/quiz\` command created by zai_tm`)
                    .setColor(`${revision.substring(0,6)}`);
                await interaction.reply({embeds: [embed]});
            } catch(e) {
                const embed = new EmbedBuilder()
                    .setTitle('PatziBot')
                    .setDescription(`Version ${project.version} (\`git not installed :(\`)\n\nBot created by stuartt.\n\`/kill\`, \`/quiz\` command created by zai_tm`)
                    .setColor(`FF0000`);
                await interaction.reply({embeds: [embed]});
            }
        } if (subcommand == "github") {
            interaction.reply({content:`https://github.com/RealMCoded/Patzibot`,ephemeral: true});
        }
    },
};