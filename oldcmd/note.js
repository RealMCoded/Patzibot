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

const Tags = sequelize.define('tags', {
	notename: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription(`note`)
		.addSubcommand(subcommand => 
			subcommand.setName("set")
				.setDescription("set your note lol")
				.addStringOption(option => 
					option.setRequired(true)
						.setName("string")
						.setDescription("your note text")))
		.addSubcommand(subcommand => 
			subcommand.setName("view")
				.setDescription("view a note")
				.addUserOption(option => 
					option.setRequired(true)
						.setName("user")
						.setDescription("the user to view a note")))
		.addSubcommand(subcommand => 
			subcommand.setName("modset")
				.setDescription("Force set a user's note (Moderator only!)")
				.addUserOption(option => 
					option.setRequired(true)
						.setName("user")
						.setDescription("the user to view a note"))
			.addStringOption(option => 
					option.setRequired(true)
						.setName("string")
						.setDescription("the new note text"))),
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
					console.log(`${interaction.user.tag} Set their note to "${tagName}".`)
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

		} else if (subcommand === 'view') {
			const tagName = interaction.options.getUser('user').id;

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const tag = await Tags.findOne({ where: { username: tagName } });

			if (tag) {
				return interaction.reply({content:`<@${tagName}>'s note:\n\n${tag.get('notename')}`,ephemeral: true});
			}

			return interaction.reply({content:`❌ **This user does not have a note!**`,ephemeral: true});
		} else if (subcommand === 'modset') {
		if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
			const tagName = interaction.options.getString('string');
			const tagUser = interaction.options.getUser("user").id
			//const tagOwner = interaction.options.getString('description');
			const fone = await Tags.findOne({ where: { username: tagUser } })
			//console.log(fone)
			if (!fone) {
				//console.log("NO TAG EXISTS, MAKING ONE!")
				try {
					// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
					const tag = await Tags.create({
						notename: tagName,
						username: tagUser,
					});
					console.log(`${interaction.user.tag} Set ${tagUser}'s note to "${tagName}".`)
					return interaction.reply({content:`Set <@${tagUser}>'s note to ${tag.notename}!`, ephemeral: true});
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
				const affectedRows = await Tags.update({ notename: tagName }, { where: { username: tagUser } });
				console.log(`${interaction.user.tag} Set ${tagUser}'s note to "${tagName}".`)
				if (affectedRows > 0) {return interaction.reply({content:`Set <@${tagUser}>'s note to ${tagName}!`, ephemeral: true})}
			}

		}
	} else {
		await interaction.reply({ content: "❌ **You cannot use this command!**", ephemeral: true });
	}
	},
};