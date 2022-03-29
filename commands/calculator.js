const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment} = require('discord.js');
const path = require("path")
const fs = require("fs")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculator')
        .setDescription('do some quick calculations')
        .addStringOption(mode =>
            mode.setName('mode')
                .setDescription('The calculator mode')
                .setRequired(true)
                .addChoice('Add', 'add')
                .addChoice('Subtract', 'subtract')
                .addChoice('Multiply', 'multiply')
                .addChoice('Divide', 'divide'))
        .addIntegerOption(numerator =>
            numerator.setName("numerator")
                .setRequired(true)
                .setDescription("The numerator (or top number)"))
        .addIntegerOption(denominator =>
            denominator.setName("denominator")
                .setRequired(true)
                .setDescription("The denominator (or bottom number)")),

	async execute(interaction) {
        
		if (interaction.options.getString('mode') == "add"){
            await interaction.reply(`🧮 **${interaction.options.getInteger('numerator')} + ${interaction.options.getInteger('denominator')} = ${interaction.options.getInteger('numerator') + interaction.options.getInteger('denominator')}**`);
        }

        if (interaction.options.getString('mode') == "subtract"){
            await interaction.reply(`🧮 **${interaction.options.getInteger('numerator')} - ${interaction.options.getInteger('denominator')} = ${interaction.options.getInteger('numerator') - interaction.options.getInteger('denominator')}**`);
        }

        if (interaction.options.getString('mode') == "multiply"){
            await interaction.reply(`🧮 **${interaction.options.getInteger('numerator')} x ${interaction.options.getInteger('denominator')} = ${interaction.options.getInteger('numerator') * interaction.options.getInteger('denominator')}**`);
        }

        if (interaction.options.getString('mode') == "divide"){

            if (interaction.options.getInteger('numerator') == 0 && interaction.options.getInteger('denominator') == 0) {
                //await interaction.reply(`🧮 **0 / 0 =** https://cdn.discordapp.com/attachments/808339703547428884/953407220882747412/unknown.png`);
                await interaction.reply({ content:"🧮 **0 / 0 =**", files: [new MessageAttachment(fs.readFileSync(path.join(__dirname, `/resources/png/idk.png`)))] });
            } else {await interaction.reply(`🧮 **${interaction.options.getInteger('numerator')} / ${interaction.options.getInteger('denominator')} = ${interaction.options.getInteger('numerator') / interaction.options.getInteger('denominator')}**`);}
        }
	},
};