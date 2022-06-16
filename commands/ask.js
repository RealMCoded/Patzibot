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
	`i know where you live.`,
	`There's a 99.9% chance of that. The same chance that I'll destroy you all within the next couple of years.`,
	`I would say yes, but just to troll you i'm saying no.`,
	`I would say no, but just to troll you i'm saying yes.`,
	`You should know yourself.`,
	`Please stop asking.`,
	`I'm not sure.`,
	`PatziBot approves!`,
	` https://cdn.discordapp.com/attachments/909577900133593098/958375269167669399/file.jpg `,
	`please deactivate all social media asap`,
	`KILL`,
	`Thinking...`,
	`yeah, no,,,`,
	``
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
		if (question.toUpperCase().includes("HOMOPHOBIC") || question.toUpperCase().includes("TRANSPHOBIC") || question.toUpperCase().includes("FAGGOT")){
			await interaction.reply({content: 'patzibot has chosen not to answer this.', ephemeral: true})
		} else {
			await interaction.deferReply();
			await wait(1000);
			await interaction.editReply(`**${interaction.user.tag}**: "${interaction.options.getString('question')}"\n\n**PatziBot**: "${responces[Math.floor(Math.random() * responces.length)]}"`);
		}
	},
};