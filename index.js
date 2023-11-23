// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials, WebhookClient } = require('discord.js');
const { token, logWebhookURL } = require('./config.json');

// Create a new client instance
const client = new Client({ 
	intents: [ GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction] 
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

//redefine some console functions here
console.log = async function(e) {
	try {
		if (logWebhookURL) {
			let webhookClient = new WebhookClient({ url: logWebhookURL });
			webhookClient.send(`\`\`\`\n${e}\n\`\`\``);
		}
	} catch(e) {
		process.stdout.write(`Unable to redirect output: ${e}\n`);
	}
	process.stdout.write(`${e}\n`);
}

console.warn = async function(e) {
	try {
		if (logWebhookURL) {
			let webhookClient = new WebhookClient({ url: logWebhookURL });
			webhookClient.send(`\`\`\`\n[WARN] ${e}\n\`\`\``);
		}
	} catch(e) {
		process.stdout.write(`Unable to redirect output: ${e}\n`);
	}
	process.stdout.write(`[WARN] ${e}\n`);
}

console.error = async function(e) {
	try {
		if (logWebhookURL) {
			let webhookClient = new WebhookClient({ url: logWebhookURL });
			webhookClient.send(`\`\`\`\n[ERROR] ${e}\n\`\`\``);
		}
	} catch(e) {
		process.stdout.write(`Unable to redirect output: ${e}\n`);
	}
	process.stdout.write(`[ERROR] ${e}\n`);
}

//Start database connection
client.db = require('./database.js')

client.lastmessages = []
client.chattedRecently = new Set()

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

process.on('uncaughtException', (error, origin) => {
	console.log(`❌ Uncaught exception\n-----\n${error}\n-----\nException origin\n${origin}`)
})

process.on('unhandledRejection', (reason, promise) => {
	console.log(`❌ Unhandled Rejection\n-----\n${promise}\n-----\nReason\n${reason}`)
})

// Log in to Discord with your client's token
client.login(token);