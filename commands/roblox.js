const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('e')
        .setDescription('roblos')
        .addSubcommand(subcommand =>
            subcommand
            .setName("wave")
            .setDescription("wave"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("point")
            .setDescription("point"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("cheer")
            .setDescription("cheer"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("laugh")
            .setDescription("laugh"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("dance")
            .setDescription("dance"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("dance1")
            .setDescription("dance1"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("dance2")
            .setDescription("dance2"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("dance3")
            .setDescription("dance3")),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "wave"){
            interaction.reply(`${interaction.user} is waving!`);
        } else if (subcommand == "point"){
            interaction.reply(`${interaction.user} is pointing!`);
        } else if (subcommand == "cheer"){
            interaction.reply(`${interaction.user} is cheering!`);
        } else if (subcommand == "laugh"){
            interaction.reply(`${interaction.user} is laughing!`);
        } else if (subcommand == "dance"){
            interaction.reply(`${interaction.user} is dancing!`);
        } else if (subcommand == "dance1"){
            interaction.reply(`${interaction.user} is dancing!`);
        } else if (subcommand == "dance2"){
            interaction.reply(`${interaction.user} is dancing!`);
        } else if (subcommand == "dance3"){
            interaction.reply(`${interaction.user} is dancing!`);
        } 
    },
};
