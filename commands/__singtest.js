const { SlashCommandBuilder } = require('@discordjs/builders');
const voiceDiscord = require('@discordjs/voice');
const { AsyncLocalStorage } = require('async_hooks');
const path = require("path")
const wait = require('node:timers/promises').setTimeout;
const perm = require('./powerList.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sing')
        .setDescription('Joins the VC and play song :)')
        .addStringOption(option =>
            option.setName('sound')
                .setDescription('the funny')
                .setRequired(true)),
	async execute(interaction) {

        if (perm.includes(interaction.user.id)) {
        
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
        await console.log(`${interaction.user.tag} requested that i play "${interaction.options.getString('sound')}"\n`)

		player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});

        /*if (Interaction.guild.id == guildId){
            logChannel.send(`\`\`\`diff\n- Sound requested: "${interaction.options.getString('sound')}"\n- was requested by ${interaction.member.tag}.\`\`\``)
        }*/
    } else {
        await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
    }
	},
};