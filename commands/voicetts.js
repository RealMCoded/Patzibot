const { SlashCommandBuilder } = require('@discordjs/builders');
const voiceDiscord = require('@discordjs/voice');
const googleTTS = require('google-tts-api');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { logWebhookURL } = require('../config.json')
const path = require("path")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('voicetts')
        .setDescription('Make the bot say something!')
        /*.addStringOption(option =>
            option.setName('voice')
                .setDescription('the voice to use')
                .setRequired(true)
                .addChoice('Dave', 'Adult%20Male%20%232%2C%20American%20English%20(TruVoice)')
				.addChoice('Microsoft-Sam', 'Sam')
				.addChoice('Microsoft-Mike', 'Mike')
				.addChoice('Microsoft-Mary', 'Mary'))*/
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
		/*.addIntegerOption(option =>
			option.setName("pitch")
				.setDescription('The pitch of the text the bot says. Min: 50, Max: 200'))
		.addIntegerOption(option =>
			option.setName("speed")
				.setDescription('The speed of the text the bot says. Min: 50, Max: 200')),*/

	async execute(interaction) {
        const channel = interaction.member.voice.channel;
		if(!channel) return await interaction.reply({ content: "❌ **You aren't in a voice channel!**", ephemeral: true });

		//some preparation

		/*
		const voice = interaction.options.getString('voice')
		const text = interaction.options.getString('text')
		let pitch = interaction.options.getInteger('pitch')
		let speed = interaction.options.getInteger('speed')

		if (!pitch) {
			if (voice == "Sam") {pitch = 100} else {pitch = 140}
		} else {
			if (pitch > 200) {pitch = 200} else if (pitch < 50) {pitch = 50}
		}

		if (!speed) {
			if (voice == "Sam") {speed=150} else {speed = 157}
		} else {
			if (speed > 200) {speed = 200} else if (speed < 50) {speed = 50}
		}*/

		//const url = `https://tetyys.com/SAPI4/SAPI4?text=\"${text}\"&voice=${voice}&pitch=${pitch}&speed=${speed}
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
		const webhookClient = new WebhookClient({ url: logWebhookURL });
        await interaction.editReply({ content: "✅ **Played!**", ephemeral: true })
		const embed = new MessageEmbed()
				.setTitle("Patzibot Logs - `/voicetts`")
				.setDescription(`${interaction.user.tag} requested to say "${text}"`)
				.setColor("#00ff00")
				.setTimestamp();
		webhookClient.send({embeds: [embed]});
		console.log(`${interaction.user.tag} requested to say "${text}"\n`)

		player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});
        
	},
};