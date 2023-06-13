const { SlashCommandBuilder } = require('@discordjs/builders');
const voiceDiscord = require('@discordjs/voice');
const googleTTS = require('google-tts-api');
const path = require("path")
const wait = require('node:timers/promises').setTimeout;
const { formatUsername } = require("../util.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('voicetts')
        .setDescription('Make the bot say something!')
		.addStringOption(option =>
			option.setName("text")
				.setRequired(true)
				.setDescription('the text for the bot to say. Max string size: 1000'))
		.addIntegerOption(option =>
			option.setName('slow')
					.setDescription('Slow voice (Default: false)')
					.setRequired(false)
					.addChoice('True', 1)
					.addChoice('False', 0)),

	async execute(interaction) {
        const channel = interaction.member.voice.channel;
		if(!channel) return await interaction.reply({ content: "❌ **You aren't in a voice channel!**", ephemeral: true });

		const text = interaction.options.getString('text')
		const useSlow = Boolean(interaction.options.getInteger('slow') || 0)
		const url = googleTTS.getAudioUrl(text, {
			lang: 'en',
			slow: useSlow,
			host: 'https://translate.google.com',
		  });

		if (url.length > 4088) {await interaction.reply({ content: "❌ **Your text is too long! Try to keep it under 2500 characters!**", ephemeral: true })}

		const connection = voiceDiscord.joinVoiceChannel({
			channelId: channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

        const player = voiceDiscord.createAudioPlayer();
		const resource = voiceDiscord.createAudioResource(url) //stealing this api, try to locally host one later!

		//fake loading shh
		await interaction.deferReply({ephemeral: true});
		await wait(500);

		player.play(resource);
		connection.subscribe(player);
		console.log(`${formatUsername(interaction.user)} requested to say "${text}"\n`)

		player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});
        
	},
};