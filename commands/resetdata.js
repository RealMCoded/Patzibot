const {SlashCommandBuilder} = require('@discordjs/builders');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

const time = 30000

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-patzicoin-data')
        .setDescription('Reset your PatziCoin data.'),
    async execute(interaction) {
        const answerCorrectButton = new MessageButton()
            .setCustomId('yes_delete_my_data')
            .setLabel("Yes, Delete my data.")
            .setStyle('DANGER');
        const answerWrong1Button = new MessageButton()
            .setCustomId('nevermind')
            .setLabel("Nevermind.")
            .setStyle('SUCCESS');

        let answers = [
            answerCorrectButton,
            answerWrong1Button
        ];
        const answerButtons = new MessageActionRow()
            .addComponents(answers);
        const questionEmbed = new MessageEmbed()
            .setTitle("Are you sure you want to reset your PatziCoin data?")
            .setDescription("**You are about to reset your PatziCoin data.**\n\nThis command will delete all your data from our database. This includes: Your User ID, Total PatziCoins, Your bank balance, When you last claimed your daily, the last time you begged for PatziCoins and your PatziCoin Inventory.\n\nClick on **\"Yes, Delete my data.\"** to delete this data, Click **\"Nevermind.\"** or wait 30 seconds to cancel this.\n\n**THIS IS IRREVERSIBLE. DO THIS AT YOUR OWN RISK!**")
            .setColor('#007f7f')
        const message = await interaction.reply({embeds: [questionEmbed], components: [answerButtons], fetchReply: true});
        const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: time});
        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if (i.component.customId === 'yes_delete_my_data') {
                    answerCorrectButton.setDisabled(true);
                    answerWrong1Button.setDisabled(true);
                    let answerButtonFinished = new MessageActionRow().addComponents(answers);
                    i.update({components: [answerButtonFinished]})
                    collector.stop();

                    const db = interaction.client.db.Patzicoin;
                    const [row,] = await db.findOrCreate({ where: { userID: interaction.user.id } })
                    await row.destroy({
						where: { userID: interaction.user.id },
					});
                    interaction.followUp("✅ **Your data has been cleared.**")
                    //clearUserData()
                } else {
                    answerCorrectButton.setDisabled(true);
                    answerWrong1Button.setDisabled(true);
                    answerButtonFinished = new MessageActionRow().addComponents(answers);
                    i.update({components: [answerButtonFinished]})
                    interaction.followUp("❌ **Cancelled - Cancelled by user.**")
                    collector.stop();
                }
            } else {
                i.reply({content: '❌ **This is not your prompt.**', ephemeral: true})
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                answerCorrectButton.setDisabled(true);
                answerWrong1Button.setDisabled(true);
                let answerButtonFinished = new MessageActionRow().addComponents(answers);
                interaction.editReply({components: [answerButtonFinished]})
                interaction.followUp("❌ **Cancelled - Timeout.**")
            } else {
                return;
            }
        });
    },
};