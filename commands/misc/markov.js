const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { markov } = require("../../config.json")
const jsMarkov = require('js-markov');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('markov')
        .setDescription('intro related commands')
        .addSubcommand(subcommand =>
            subcommand
            .setName("stats")
            .setDescription("view various markov stats"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("word-list")
            .setDescription("View all sentences i know"))
        .addSubcommand(subcommand =>
                subcommand
                .setName("generate")
                .setDescription("Generate a random sentence")),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "stats"){
            const embed = new EmbedBuilder()
                .setTitle("Markov Stats")
                .setColor("#0099ff")
                .addFields(
                    { name: 'Total messages saved', value: `${interaction.client.lastmessages.length}`},
                    { name: 'Max messages', value: `${markov.contextLength}`},
                    { name: 'Minimum messages required to generate', value: `${markov.minTokensToGenerate}`},
                    { name: 'Probability', value: `${markov.probability*100}% per message`,},
                )
                .setTimestamp()

            return interaction.reply({embeds: [embed]});
        } else if (subcommand == "word-list") {
            const dump = new AttachmentBuilder(Buffer.from(JSON.stringify(interaction.client.lastmessages, null, 2)), { name: 'words.json' })
		    interaction.reply({ content: `Markov word list`, files: [dump], ephemeral: false })
        } else if (subcommand == "generate") {
            const mymarkov = new jsMarkov();
		
			mymarkov.addStates(interaction.client.lastmessages);
		
			mymarkov.train();

			let genMessage = mymarkov.generateRandom(100)

			interaction.reply(genMessage)
        }
    },
};