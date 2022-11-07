const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v9');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Patzicoin - User Stats')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const usr = interaction.targetUser

        const db = interaction.client.db.Patzicoin;

		const tag = await db.findOne({ where: { userID: usr.id } });

		await require(`../patzicoin-functions/userstats.js`).userstats(usr, tag, interaction)
    },
};