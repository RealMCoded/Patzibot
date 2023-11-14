const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll a dice!')
		.addIntegerOption(sides =>
            sides.setName("sides")
                .setDescription("How many sides the dice has (default: 6)")),
	async execute(interaction) {
		var sides = interaction.options.getInteger('sides') || 6

		//await interaction.reply(`The die 🎲 landed on **${Math.floor(Math.random() * sides)}**`);
		const embed = new EmbedBuilder()
            .setTitle(`The dice landed on ${Math.floor(Math.random() * sides)}!`)
			.setThumbnail("https://em-content.zobj.net/source/apple/354/game-die_1f3b2.png")
            .setColor('#FFFFFF');
        await interaction.reply({embeds: [embed]});
	},
};