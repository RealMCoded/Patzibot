const { SlashCommandBuilder } = require('@discordjs/builders');
const voiceDiscord = require('@discordjs/voice');
const { AsyncLocalStorage } = require('async_hooks');
const path = require("path")
const wait = require('node:timers/promises').setTimeout;
const { logChannel, guildId } = require("../config.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('soundboard')
        .setDescription('Joins the VC and plays a sound.')
        .addStringOption(option =>
            option.setName('sound')
                .setDescription('the funny')
                .setRequired(true)
                .addChoice('Bruh', 'bruh')
                .addChoice('Bruh-HD-4K-UHD-Dolby-Atmos', 'bruh-hd-real')
                .addChoice('Airhorn', 'airhorn')
                .addChoice('DJ-Airhorn', 'airhorn-dj')
                .addChoice('Bambi-break-phone', 'bambi')
                //.addChoice('bambi-break-phone-4k-uhd', 'bambi-hd-real') //REMOVED FOR NOW - WAV
                .addChoice('Ben-yes', 'ben_yes')
                .addChoice('Ben-no', 'ben_no')
                .addChoice('Ben-HangUp', 'ben_hang')
                .addChoice('FNAF-Jumpscare', 'jumpscare')
                .addChoice('FNAF-Musicbox', 'musicbox')
                .addChoice('FNAF-Bad-Ending', 'fnaf_bad_ending')
                .addChoice('Royalty-Free-Family-Guy-theme', 'familyguymidi')
                .addChoice('goanimate-vine-boom', 'goanimate_vine_boom')
                .addChoice('scream', 'scream')
                .addChoice('damn', 'damn')),

	async execute(interaction) {
        
        const channel = interaction.member.voice.channel;
		if(!channel) return await interaction.reply({ content: "❌ **You aren't in a voice channel!**", ephemeral: true });

		const connection = voiceDiscord.joinVoiceChannel({
			channelId: channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

        const player = voiceDiscord.createAudioPlayer();
		const resource = voiceDiscord.createAudioResource(path.join(__dirname, `/resources/sound/${interaction.options.getString('sound')}.mp3`))

        await wait(1000)

		player.play(resource);
		connection.subscribe(player);

        await interaction.reply({ content: "✅ **Played!**", ephemeral: true })
        await console.log(`${interaction.user.tag} requested that i play "${interaction.options.getString('sound')}"\n`)

		player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});

        /*if (Interaction.guild.id == guildId){
            logChannel.send(`\`\`\`diff\n- Sound requested: "${interaction.options.getString('sound')}"\n- was requested by ${interaction.member.tag}.\`\`\``)
        }*/
        
	},
};