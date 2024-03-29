const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rockpaperscissors')
		.setDescription(`Play a game of Rock Paper Scissors against the bot!`),
	async execute(interaction) {

		//define the buttons
		const answerRock = new ButtonBuilder()
            .setCustomId('0')
			.setEmoji("🪨")
            .setLabel("Rock")
            .setStyle(ButtonStyle.Primary);
        const answerPaper = new ButtonBuilder()
            .setCustomId('1')
			.setEmoji("📄")
            .setLabel("Paper")
            .setStyle(ButtonStyle.Primary);
        const answerScissors = new ButtonBuilder()
            .setCustomId('2')
			.setEmoji("✂️")
            .setLabel("Scissors")
            .setStyle(ButtonStyle.Primary);
		let answers = [
            answerRock,
            answerPaper,
            answerScissors
        ];
		let timeoutResponses=[
			"Yo. This is getting boooring... Get going!",
			"Jeez! Wake me up when you're ready."
		]
		let answerASCII =["Rock", "Paper", "Scissors"]
		let botChoice = Math.floor(Math.random() * 3)
		let isWinner=false
		const answerButtons = new ActionRowBuilder().addComponents(answers);

		//console.log(botChoice)

		const message = await interaction.reply({content:"Choose one!\n\n*you have 30 seconds to select*", components: [answerButtons], fetchReply: true});
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000});
        collector.on('collect', i => {
			if (i.user.id === interaction.user.id) {
				answerRock.setDisabled(true)
				answerPaper.setDisabled(true)
				answerScissors.setDisabled(true)
				let answerButtonFinished = new ActionRowBuilder().addComponents(answers);

				if (parseInt(i.component.customId) === botChoice) { //TIE
					i.update({content:`You chose **${answerASCII[parseInt(i.component.customId)]}.**\nI chose **${answerASCII[botChoice]}.**\nIt's a **tie**!`, components: [answerButtonFinished]})
				} else {
					if (parseInt(i.component.customId) === 0) { //ROCK
						if (botChoice === 1) { //BOTPAPER
							isWinner=false
						} else if (botChoice === 2) { //BOTSCISSORS
							isWinner=true
						}
					} else if (parseInt(i.component.customId) === 1) { //PAPER
						if (botChoice === 0) { //BOTROCK
							isWinner=true
						} else if (botChoice === 2) { //BOTSCISSORS
							isWinner=false
						}
					} else if (parseInt(i.component.customId) === 2) { //Scissors
						if (botChoice === 0) { //BOTROCK
							isWinner=false
						} else if (botChoice === 1) { //BOTPAPER
							isWinner=true
					}
				}

				//console.log(isWinner)

				if (isWinner === true) {
					i.update({content:`You chose **${answerASCII[parseInt(i.component.customId)]}.**\nI chose **${answerASCII[botChoice]}.**\n**You win!**`, components: [answerButtonFinished]})
				} else {
					i.update({content:`You chose **${answerASCII[parseInt(i.component.customId)]}.**\nI chose **${answerASCII[botChoice]}.**\n**I win!**`, components: [answerButtonFinished]})
				}
			}
				collector.stop()
			} else {
				i.reply({content: 'This is not your game of Rock Paper Scissors. You can run one with `/rockpaperscissors`.', ephemeral: true})
			}
		});

		collector.on('end', collected => {
			if (collected.size === 0) {
				answerRock.setDisabled(true)
				answerPaper.setDisabled(true)
				answerScissors.setDisabled(true)
                let answerButtonFinished = new ActionRowBuilder().addComponents(answers);
                interaction.editReply({content:`❌ ***"${timeoutResponses[Math.floor(Math.random() * timeoutResponses.length)]}"***\n*Command timed out.*`, components: [answerButtonFinished]})
            } else {
                return;
            }});
	},
};