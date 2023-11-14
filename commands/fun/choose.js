const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { random_range } = require('../../util.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Picks an option from a list of provided options.')
		.addStringOption(sides =>
            sides.setName("options")
                .setDescription("Separate each option with a pipe (|). Example: Yes|No|Maybe")
				.setRequired(true)),
	async execute(interaction) {
		const options = interaction.options.getString('options').replaceAll("| ", "|").replaceAll(" |", "|")
		let opts = options.split("|")

		//console.log(JSON.stringify(opts))

		const embed = new EmbedBuilder()
            .setTitle(`I choose... "${opts[random_range(0, opts.length-1)]}"!`)
			.setFooter({text: `Options Provided: ${options.replaceAll("|", ", ")}.`})
            .setColor('#6394eb');
        await interaction.reply({embeds: [embed]});
	},
};