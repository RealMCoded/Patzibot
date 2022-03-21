const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll a die!')
		.addIntegerOption(sides =>
            sides.setName("sides")
                .setDescription("The sides of the die (default: 6)")),
	async execute(interaction) {

		var sides = interaction.options.getInteger('sides')
        if (!sides) {
            sides = 6
        } else {
            interaction.options.getInteger('sides')
        }

		await interaction.reply(`The die 🎲 landed on **${Math.floor(Math.random() * sides)}**`);
	},
};