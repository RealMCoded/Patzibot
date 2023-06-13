const { SlashCommandBuilder } = require('@discordjs/builders');
const voiceDiscord = require('@discordjs/voice');
const { AsyncLocalStorage } = require('async_hooks');
const path = require("path")
const wait = require('node:timers/promises').setTimeout;
const { powerList } = require('../config.json');
const { formatUsername } = require("../util.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('audio')
        .setDescription('does vc related things')
        .addSubcommand(subcommand => 
			subcommand.setName('playfile')
            .setDescription('Play an external file')
            .addStringOption(option =>
                option.setName('sound')
                    .setDescription('the funny')
                    .setRequired(true)))
        .addSubcommand(subcommand => 
			subcommand.setName('disconnect')
            .setDescription('Leaves the current VC')),
	async execute(interaction) {
        if (powerList.includes(interaction.user.id)) {
            const subcommand = interaction.options.getSubcommand();
            if (subcommand == "disconnect") {
                await interaction.reply({ content: "command not working", ephemeral: true })
            } else if (subcommand == "playfile") {
                const channel = interaction.member.voice.channel;
                if(!channel) return await interaction.reply({ content: "❌ **You aren't in a voice channel!**", ephemeral: true });

                const connection = voiceDiscord.joinVoiceChannel({
                    channelId: channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                const player = voiceDiscord.createAudioPlayer();
                const resource = voiceDiscord.createAudioResource(interaction.options.getString('sound'))

                await wait(500)

                player.play(resource);
                connection.subscribe(player);

                await interaction.reply({ content: "✅ **Played!**", ephemeral: true })
                await console.log(`${formatUsername(interaction.user)} requested that i play "${interaction.options.getString('sound')}"\n`)

                player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                });

                //stop player when bot disconnects
                player.on(voiceDiscord.VoiceConnectionStatus.Disconnected, () => {
                    connection.destroy();
                });
            }
        } else {
            await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
        }
	},
};