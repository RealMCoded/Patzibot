const { SlashCommandBuilder } = require('@discordjs/builders');
const cleverbot = require("cleverbot-free");
const wait = require('node:timers/promises').setTimeout;

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
		if (question.toUpperCase().includes("HOMOPHOBIC") || question.toUpperCase().includes("TRANSPHOBIC") || question.toUpperCase().includes("FAGGOT") || question.toUpperCase().includes("QUEER")){
			await interaction.reply({content: 'patzibot has chosen not to answer this.', ephemeral: true})
		} else if (question == "" || question =="‍" || question == "​" || question == "ㅤ" || question == "⠀" || question == "_ _" || question == "** **" || question == "*** ***"){
			await interaction.reply({content: `**Tip of the day:** try actually typing something`, ephemeral: true});
		} else {
			await interaction.deferReply();
			await wait(1000);
			await cleverbot(question).then(response => (interaction.editReply(`**${interaction.user.tag}**: "${question}"\n\n**PatziBot**: "${response}"`)));
			//await interaction.editReply(`**${interaction.user.tag}**: "${interaction.options.getString('question')}"\n\n**PatziBot**: "${responces[Math.floor(Math.random() * responces.length)]}"`);
		}
	},
};