const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const { SQL_USER, SQL_PASS } = require('../config.json');
const { Op } = require('sequelize');
const { Tags } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription(`A note is a pre-made message that you can make the bot say!`)
		.addSubcommand(subcommand => 
			subcommand.setName("create")
				.setDescription("create a note")
				.addStringOption(option => 
					option.setRequired(true)
						.setName("tag")
						.setDescription("the note name"))
				.addStringOption(option => 
					option.setRequired(true)
						.setName("string")
						.setDescription("the note text")))
		.addSubcommand(subcommand => 
			subcommand.setName("view")
				.setDescription("view a note")
				.addStringOption(option => 
					option.setRequired(true)
						.setName("tag")
						.setDescription("the note to view")))
		.addSubcommand(subcommand => 
			subcommand.setName("list")
				.setDescription("get a list of all notes"))
		.addSubcommand(subcommand => 
			subcommand.setName("info")
				.setDescription("view a note's info")
				.addStringOption(option => 
					option.setRequired(true)
						.setName("tag")
						.setDescription("the note to view"))),
		/*.addSubcommand(subcommand => 
			subcommand.setName("delete")
				.setDescription("delete a tag you made")
				.addStringOption(option => 
					option.setRequired(true)
						.setName("tag")
						.setDescription("the tag to delete"))),*/
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "create") {
			const tagName = interaction.options.getString('tag');
			const tagDescription = interaction.options.getString('string');

			try {
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				const tag = await Tags.create({
					name: tagName,
					description: tagDescription,
					username: interaction.user.id,
				});

				return interaction.reply({content:`✅ **Note "${tagName}" created!**`,ephemeral: true});
			}
			catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply({content:`❌ **Note "${tagName}" already exists!**`,ephemeral: true});
				}

				return interaction.reply({content:`❌ **Something went wrong when adding this note.**`,ephemeral: true});
			}
		} else if (subcommand === "view") {
			const tagName = interaction.options.getString('tag');

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const tag = await Tags.findOne({ where: { name: tagName } });

			if (tag) {
				// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
				tag.increment('usage_count');

				//return interaction.reply(tag.get('description'));
				const embed = new MessageEmbed()
					.setTitle(`Note - ${tagName}`)
					.setDescription(tag.get('description'))
				return interaction.reply({embeds: [embed]});
			}

			return interaction.reply({content:`❌ **Could not find note: "${tagName}"**`,ephemeral: true});
		} else if (subcommand === "info") {
			const tagName = interaction.options.getString('tag');

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const tag = await Tags.findOne({ where: { name: tagName } });
		
			if (tag) {
				//return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
				const embed = new MessageEmbed()
					//.setThumbnail("https://media.discordapp.net/attachments/516435840130482216/687012987525136440/DynoTimer.png")
					.setTitle(`Note info - ${tagName}`)
					.setDescription(`**Note Name:** "${tagName}"\n\n**Note Creator:** <@${tag.username}>\n\n**Note Creation Date:** ${tag.createdAt}\n\n**Note Usage Count:** ${tag.usage_count}`)
					//.setColor(`${timestampColour}`);
				return interaction.reply({embeds: [embed]});
			}
		
			return interaction.reply({content:`❌ **Could not find note: "${tagName}"**`,ephemeral: true});
		} else if (subcommand === "list") {
			const tagList = await Tags.findAll({ attributes: ['name'] });
			const tagString = tagList.map(t => t.name).join(', ') || '[No notes have been created yet. Be the first to make a note!]';

			return interaction.reply(`List of notes:\n\n\`\`\`${tagString}\`\`\``);
		}
	},
};