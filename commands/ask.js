const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;

const responces=[
	`I don't know.`,
	`That's why i hate humans.`,
	`Yes.`,
	`No.`,
	`The answer is ||NO||.`,
	`The answer is ||YES||.`,
	`100%`,
	`Sometime in 2022.`,
	`Maybe if you asked a less open-ended question, I'd actually bother coming up with a proper answer but it seems like you're too dumb to get that.`,
	`sorry got distracted, ask again.`,
	`i know where you live.`
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription(`Ask PatziBot a question!`)
		.addStringOption(question =>
			question.setName("question")
				.setRequired(true)
				.setDescription("The question to ask")),
	async execute(interaction) {
		const question = interaction.options.getString('question')
		if (question.toUpperCase().includes("HOMOPHOBIC") || question.toUpperCase().includes("TRANSPHOBIC")){
			await interaction.reply({content: 'if you are seeing this, <@284804878604435476> messed up somehow.', ephemeral: true})
		} else {
			await interaction.deferReply();
			await wait(1000);
			await interaction.editReply(`**${interaction.user.tag}**: "${interaction.options.getString('question')}"\n\n**PatziBot**: "${responces[Math.floor(Math.random() * responces.length)]}"`);
		}
	},
};