const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const path = require("path")
const Jimp = require("jimp")
const fs = require("fs")
const font = path.join(__dirname, `/resources/font/Asimov.fnt`)
const fontmc = path.join(__dirname, `/resources/font/minecraft.fnt`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription(`Some fun image commands`)
		.addSubcommand(subcommand =>
			subcommand
			.setName("box-of-shame")
			.setDescription("Send a user to the Box of shame!")
			.addUserOption(string =>
				string.setName("user")
					.setRequired(true)
					.setDescription("the user to put in the box")))
		.addSubcommand(subcommand =>
			subcommand
			.setName("patzi")
			.setDescription("things patzi may or may not have said")
			.addStringOption(string =>
				string.setName("text")
					.setRequired(true)
					.setDescription("the text for patzi to say")))
		.addSubcommand(subcommand =>
			subcommand
			.setName("shoebird")
			.setDescription("things a shoebird may or may not have said")
			.addStringOption(string =>
				string.setName("text")
					.setRequired(true)
					.setDescription("the text for the shoebird to say")))
		.addSubcommand(subcommand =>
			subcommand
			.setName("minecraft-death")
			.setDescription("You died!")
			.addStringOption(string =>
				string.setName("text")
					.setRequired(true)
					.setDescription("the text for the death screen to show"))),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'box-of-shame') {

			const user = interaction.options.getUser('user').displayAvatarURL({ format: 'png' })

			Jimp.read(path.join(__dirname, `/resources/png/shame.png`))
				.then(lenna => {
					Jimp.read(user).then(pfp => {
						lenna.composite(pfp, 146, 55)
						.write(path.join(__dirname, `/resources/_TMP/_SHAME.png`)); // save
					})
				})
				.catch(err => {
					console.error(err);
			});
			await wait(500) //wait juuuuuust incase you know lol

			interaction.reply({ content:`${interaction.options.getUser('user').tag} has been sent to the Box of shame!`, files: [new MessageAttachment(fs.readFileSync(path.join(__dirname, `/resources/_TMP/_SHAME.png`)))] });
			await wait(500)
			fs.unlinkSync(path.join(__dirname, `/resources/_TMP/_SHAME.png`))

		} else if (subcommand === 'patzi') {

			const text = interaction.options.getString('text')

			Jimp.read(path.join(__dirname, `/resources/png/patzi.png`))
			.then(lenna => {
				//return lenna
				Jimp.loadFont(font).then (font => {
					lenna.print(font, 4, 8, {
						text: text,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    					//alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE //makes text invisible?
					}, 390, Number.MAX_SAFE_INTEGER)
					  .write(path.join(__dirname, `/resources/_TMP/_PATZI.png`)); // save
				})
			  })
				.catch(err => {
					console.error(err);
			});
			await wait(500) //wait juuuuuust incase you know lol

			interaction.reply({ files: [new MessageAttachment(fs.readFileSync(path.join(__dirname, `/resources/_TMP/_PATZI.png`)))] });
			await wait(500)
			fs.unlinkSync(path.join(__dirname, `/resources/_TMP/_PATZI.png`))

		} else if (subcommand === 'shoebird') {

			const text = interaction.options.getString('text')

			Jimp.read(path.join(__dirname, `/resources/png/shoebird.png`))
			.then(lenna => {
				//return lenna
				Jimp.loadFont(font).then (font => {
					lenna.print(font, 4, 8, {
						text: text,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    					//alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
					}, 390, Number.MAX_SAFE_INTEGER)
					  .write(path.join(__dirname, `/resources/_TMP/_SHOEBIRD.png`)); // save
				})
			  })
				.catch(err => {
					console.error(err);
			});
			await wait(500) //wait juuuuuust incase you know lol

			interaction.reply({ files: [new MessageAttachment(fs.readFileSync(path.join(__dirname, `/resources/_TMP/_SHOEBIRD.png`)))] });
			await wait(500)
			fs.unlinkSync(path.join(__dirname, `/resources/_TMP/_SHOEBIRD.png`))

		} else if (subcommand === 'minecraft-death') {

			const text = interaction.options.getString('text')

			Jimp.read(path.join(__dirname, `/resources/png/death.png`))
			.then(lenna => {
				//return lenna

				Jimp.loadFont(fontmc).then (font => {
					lenna.print(font, 240, 170, {
						text: text,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    					//alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
					}, 2006, Number.MAX_SAFE_INTEGER)
					  .write(path.join(__dirname, `/resources/_TMP/_DEATH.png`)); // save
				})
			  })
				.catch(err => {
					console.error(err);
			});
			await wait(500) //wait juuuuuust incase you know lol

			interaction.reply({ files: [new MessageAttachment(fs.readFileSync(path.join(__dirname, `/resources/_TMP/_DEATH.png`)))] });
			await wait(500)
			fs.unlinkSync(path.join(__dirname, `/resources/_TMP/_DEATH.png`))

		} else {
			await interaction.reply({content: 'Ultra rare error! The subcommand was not defined!', ephemeral: true})
		}
	},
};