const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription(`Executes JavaScript code. Only usable by the bot owner!`)
		.addStringOption(string =>
			string.setName("str")
				.setRequired(true)
				.setDescription("string 2 eval"))
		.addIntegerOption(option => 
				option.setRequired(true)
					.setName("showresult")
					.setDescription("is slef")
					.addChoice(`Show`, 1)
					.addChoice(`Hide`, 0)),
	async execute(interaction) {
		if (interaction.user.id == 284804878604435476) {
			var evl = eval(interaction.options.getString('str'));
			if(isJson(evl)){
				evl = JSON.parse(evl);
			} else {
				evl = evl.toString();
			}
			if (interaction.options.getInteger('showresult') == 1) {
				await interaction.reply({ content: `\`\`\`${evl}\`\`\``, ephemeral: false });
			} else {
				await interaction.reply({ content: `\`\`\`${evl}\`\`\``, ephemeral: true });
			}
		} else {
			await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
		}
	},
};

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}