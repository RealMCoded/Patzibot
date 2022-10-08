const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('./config.json');
const fs = require('node:fs');

console.log(`⚠️ You are refreshing commands for Patzi's World only!\n`);

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
//const clientId = '123456789012345678';
//const guildId = '909565157116608573';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log(`🔃 Refreshing ${commands.length} commands...`);

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`✅ Successfully refreshed ${commands.length} commands!`);
	} catch (error) {
		console.error(error);
	}
})();