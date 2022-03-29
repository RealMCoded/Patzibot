const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Collection } = require('discord.js')
const { SQL_USER, SQL_PASS } = require('../config.json');
const { Op } = require('sequelize');
const { Users, CurrencyShop } = require('../dbObjects.js');

const currency = new Collection();

Reflect.defineProperty(currency, 'add', {
	value: async (id, amount) => {
		const user = currency.get(id);

		if (user) {
			user.balance += Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);

		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: id => {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patzicoin')
		.setDescription(`patzicoin commands`)
		.addSubcommand(subcommand => 
			subcommand.setName("balance")
				.setDescription("view your patzicoin balance")
				.addUserOption(option => 
					option.setName("user")
						.setDescription("the user to view"))),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "balance") {
			const target = interaction.options.getUser('user') ?? interaction.user;

			return interaction.reply(`${target.tag} has ${currency.getBalance(target.id)}💰`);
		}
	},
};