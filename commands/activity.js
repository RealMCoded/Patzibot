//stolen from zai but with changes lol

const {SlashCommandBuilder} = require('@discordjs/builders');
const { DiscordTogether } = require('discord-together');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Play a game in the voice channel with activities!')
    .addStringOption(option => option
        .setName('type')
        .setDescription('The activity you want to play!')
        .setRequired(true)
        .addChoice('Watch Together (Unlimited Players)', 'youtube')
        .addChoice('Putt Party (Unlimited Players)', 'puttpartynew')
        .addChoice('Chess In The Park (Unlimited Players)', 'chess')
        .addChoice('Checkers In The Park (Unlimited Players)', 'checkers')
        .addChoice('Letter League (8 Players)', 'lettertile')
        .addChoice('Word Snacks (8 Players)', 'wordsnack')
        .addChoice('SpellCast (100 Players)', 'spellcast')
        .addChoice('Sketch Heads (16 Players)', 'sketchheads')
        .addChoice('Blazing 8s (8 Players)', 'ocho')
        .addChoice('Land-io (16 Players)', 'landio')
        .addChoice('Bobble League (8 Players)', 'bobble')
        .addChoice('Ask Away (10 Players)', 'askaway')
        .addChoice('Know What I Meme (8 Players)', 'meme')),
    async execute(interaction) {
        let activityStr = interaction.options.getString('type');
        let activityName;
        // Yes. I am YandereDev. Thanks for asking.
        switch (activityStr) {
            case 'youtube':
                activityName = "Watch Together";
                break;
            case 'chess':
                activityName = "Chess In The Park";
                break;
            case 'checkers':
                activityName = "Checkers In The Park";
                break;        
            case 'lettertile':
                activityName = "Letter League";
                break;        
            case 'wordsnack':
                activityName = "Word Snacks";
                break;        
            case 'spellcast':
                activityName = "SpellCast";
                break;
            case 'puttpartynew':
                activityName = "Putt Party";
                break;
            case 'sketchheads':
                activityName = "Sketch Heads";
                break;
            case 'ocho':
                activityName = "Blazing 8s";
                break;
            case 'landio':
                activityName = "Land-io";
                break;
            case 'bobble':
                activityName = "Bobble League";
                break;
            case 'askaway':
                activityName = "Ask Away";
                break;
            case 'meme':
                activityName = "Know What I Meme";
                break;
        }

        const myApps = {
            landio: '903769130790969345',
            bobble: '947957217959759964',
            puttpartynew: "945737671223947305",
            askaway: "976052223358406656",
            meme: "950505761862189096"
        }

        interaction.client.discordTogether = new DiscordTogether(interaction.client, myApps);

        if(interaction.member.voice.channel !== null) {
            interaction.client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, activityStr).then(async invite => {
                const embed = new MessageEmbed()
                    .setTitle(`Activity - ${activityName}`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/808339703547428884/999752316313927710/37f3ef42675d1e91462ad139e7e7b723.png")
                    .setDescription(`[Click here to join ${activityName}!](${invite.code})\n\n*invite valid for 10 minutes!*`)
                    .setColor("#0099ff")
                    .setTimestamp()
                return interaction.reply({embeds: [embed], ephemeral: false});
            });
        } else {
            const embed = new MessageEmbed()
                .setTitle("Error launching activity!")
                .setDescription("❌ **You must be in a voice channel to use this command.**")
                .setColor("#ff0000")
                .setTimestamp()
            return interaction.reply({embeds: [embed], ephemeral: true});
        }
    },
};