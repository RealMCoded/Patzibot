//https://discordjs.guide/sequelize/
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { SQL_USER, SQL_PASS } = require('../config.json');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', SQL_USER, SQL_PASS, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const PatziCoin = sequelize.define('patzicoin', {
	username: Sequelize.STRING,
	patzicoin: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patzicoin')
		.setDescription(`patzicoin`)
		.addSubcommand(subcommand => 
			subcommand.setName("set")
				.setDescription("set your note lol")
				.addIntegerOption(option => 
					option.setRequired(true)
						.setName("coin")
						.setDescription("your note text"))),
	async execute(interaction) {
		//await interaction.reply(`fart`);
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'set') {
		
			const tagName = interaction.options.getString('string');
			//const tagOwner = interaction.options.getString('description');
			const fone = await Tags.findOne({ where: { username: interaction.user.id } })
			//console.log(fone)
			if (!fone) {
				//console.log("NO TAG EXISTS, MAKING ONE!")
				try {
					// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
					const tag = await Tags.create({
						notename: tagName,
						username: interaction.user.id,
					});
					return interaction.reply({content:`Note set to ${tag.notename}!`, ephemeral: true});
				}
				catch (error) {
					/*if (error.name === 'SequelizeUniqueConstraintError') {
						await Tags.update({ where: { notename: tagName } });
						return interaction.reply({content:`Note set to ${tagName}!`, ephemeral: true});
					}*/
					console.log(`${error}\n`)
					return interaction.reply({content:'Something went wrong with adding your note.', ephemeral: true});
				}
			} else {
				//console.log("TAG EXISTS, EDITING!")
				const affectedRows = await Tags.update({ notename: tagName }, { where: { username: interaction.user.id } });
				console.log(`${interaction.user.tag} Set their note to "${tagName}".`)
				if (affectedRows > 0) {return interaction.reply({content:`Note set to ${tagName}!`, ephemeral: true})}
			}
		}
	},
};