const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;
const { formatUsername } = require("../util.js")

const responses = [
	"It is certain",
	"It is decidedly so",
	"Without a doubt",
	"Yes definitely",
	"You may rely on it",
	"As I see it, yes",
	"Most likely",
	"Outlook good",
	"Yes",
	"Signs point to yes",
	"Reply hazy try again",
	"Ask again later",
	"Better not tell you now",
	"Cannot predict now",
	"Concentrate and ask again",
	"Don't count on it",
	"My reply is no",
	"My sources say no",
	"Outlook not so good",
	"Very doubtful"
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription(`Ask the 8-ball a question!`)
		.addStringOption(question =>
			question.setName("question")
				.setRequired(true)
				.setDescription("The question to ask")),
	async execute(interaction) {
		await interaction.reply("🎱 **Shaking the 8-Ball** <a:typing:944765274475864094>")
		await wait(2000);
		await interaction.editReply(`**${formatUsername(interaction.user)}**: "${interaction.options.getString('question')}"\n\n**The 8-Ball Says**: "${responses[Math.floor(Math.random() * responses.length)]}"`);
	},
};