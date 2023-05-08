const fs = require('node:fs');
const { Client, Collection, Intents, WebhookClient } = require('discord.js');
const { token, guildId, logWebhookURL, redirectConsoleOutputToWebhook, useMarkov, markovReadChannel, markovSendChannel, patziEmojis, secretEmoji } = require('./config.json');
const Sequelize = require('sequelize');
const status = require('./commands/resources/json/status.json');
const { generateMarkov, random_range, isLetterO } = require("./util.js")
var accents = require('remove-accents');
const { changePatzicoins } = require('./patzicoin-functions/coins.js')

const client = new Client({ ws: { properties: { browser: "Discord iOS" }}, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const chattedRecently = new Set();

const sequelize = new Sequelize('database', "", "", {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
client.db = require('./database.js')

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//redef some console functions here
console.log = async function(e) {
	try {
		if (redirectConsoleOutputToWebhook) {
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
		if (redirectConsoleOutputToWebhook) {
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
		if (redirectConsoleOutputToWebhook) {
			let webhookClient = new WebhookClient({ url: logWebhookURL });
			webhookClient.send(`\`\`\`\n[ERROR] ${e}\n\`\`\``);
		}
	} catch(e) {
		process.stdout.write(`Unable to redirect output: ${e}\n`);
	}
	process.stdout.write(`[ERROR] ${e}\n`);
}

function changeStatus(){
	// generate random number between 1 and list length.
	const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);

	if (status[randomIndex].type == "STREAMING"){
		client.user.setPresence({
			activities: [{
				name: status[randomIndex].activity, 
				type: status[randomIndex].type,
				url: "https://www.youtube.com/watch?v=GQ6rr1otWpg",
			}],
				//status: "idle"
		});
	} else {
		client.user.setPresence({
			activities: [{
				name: status[randomIndex].activity, 
				type: status[randomIndex].type,
			}],
				//status: "idle"
		});
	}
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	client.db.Patzicoin.sync();
	
	console.log(`✅ Signed in as ${client.user.tag}! \n`);

	changeStatus()
});

client.on("ready", () => {
	//RUNS EVERY 90 SECONDS
	setInterval(() => {
		changeStatus()
	}, 90000);

});

//All slash commands. check "commands" folder
client.on('interactionCreate', async interaction => {
	//if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(`${error}\n\n`)
		await interaction.reply({content: `⚠️Uh Oh! If you're reading this then something bad happened! We've logged the error and will investigate it as soon as possible!\n\n\`\`\`js\n${error}\`\`\``, ephemeral: true})
	}
});


//Message "commands"
client.on('messageCreate', async message => {

	if (message.author.bot) return

	if(message.guild.id !== guildId) return

	if (useMarkov){
		//1.5% chance of random message with markov
		if(Math.random() < 0.015 && message.channel.id == markovSendChannel){
			var msg = await generateMarkov()
			console.log(`New markov generated: "${msg}"\n`)
			client.channels.cache.get(markovSendChannel).send(msg);
		}

		//log message to markov.txt
		if(markovReadChannel.includes(message.channel.id)) {
			let msg = message.content
			if (msg.includes("@")) return;
			//if (msg.includes("<@!") || msg.includes("<@")) return;
			//remove any links
			msg = msg.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '')

			if (msg.length == 0) return;
			
			const allMessage = fs.readFileSync('markov.txt', 'utf8');

			//write message to file
			if (allMessage.includes(msg)) {
				return;
			} else {
				fs.appendFileSync('./markov.txt', `${msg}\n`)
			}
		}
	}

	try {
		//gib parti coin for talkin :)
		if(!chattedRecently.has(message.author.id)){
			changePatzicoins(client.db.Patzicoin, message.author.id, (random_range(1, 5)))

			chattedRecently.add(message.author.id);
            setTimeout(() => {
                // Removes the user from the set after 60 seconds
                chattedRecently.delete(message.author.id);
                }, 60000);
		}

		//Special message events
		let lookMessage = message.content.toUpperCase()

		if (lookMessage.split(" ").includes("RATIO")) {
			message.react('💬')
				.then(() => message.react('🔁'))
				.then(() => message.react('❤️'))
				.catch(error => console.error('One of the emojis failed to react. This might be due to the user deleting their message.'));
		}

		// if a message contains P, A, T, Z, and I react with this.
		if (lookMessage.includes("P") && lookMessage.includes("A") && lookMessage.includes("T") && lookMessage.includes("Z") && lookMessage.includes("I") && !lookMessage.includes("REACT")) {
			message.react(patziEmojis[Math.floor(Math.random()*patziEmojis.length)])
				.catch(error => console.error('One of the emojis failed to react. This might be due to the user deleting their message.'));
		}

		//1% chance of "secret" emoji
		if (Math.random() < 0.010) {
			message.react(secretEmoji)
				.catch(error => console.error('One of the emojis failed to react. This might be due to the user deleting their message.'));
		}

		//O blocker 9000
		if (message.author.id == "995497575337701436") {if (accents.remove(message.content.replace(/[^a-zA-Z]/g,"").toUpperCase().charAt(0)) === "O") message.delete()}
	} catch (e) {
		console.error(`${e}\n\n`)
	}

});

process.on('uncaughtException', (error, origin) => {
	console.log(`❌ Uncaught exception\n-----\n${error}\n-----\nException origin\n${origin}`)
})

process.on('unhandledRejection', (reason, promise) => {
	console.log(`❌ Unhandled Rejection\n-----\n${promise}\n-----\nReason\n${reason}`)
})

client.login(token);