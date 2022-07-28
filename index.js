const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, guildId, SQL_USER, SQL_PASS } = require('./config.json');
const Sequelize = require('sequelize');
const status = require('./commands/resources/json/status.json');
const rndmsg = require('./commands/resources/json/randommsg.json');

const client = new Client({ ws: { properties: { browser: "Discord iOS" }}, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const chattedRecently = new Set();

const sequelize = new Sequelize('database', SQL_USER, SQL_PASS, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
client.db = require('./models/database.js')

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	client.db.Tags.sync();
	client.db.Patzicoin.sync();
	
	console.log('==================================================================\nBOT IS ONLINE!\nAll errors and logs (soundboard, voicetts and say) will show here.\n==================================================================\n');

	 // generate random number between 1 and list length.
	 const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
	 //const newActivity = status[randomIndex].activity;
 
	 client.user.setPresence({
	   activities: [{
		   name: status[randomIndex].activity, 
		   type: status[randomIndex].type,
	   }],
		   //status: "idle"
	   });
});

client.on("ready", () => {
	//RUNS EVERY 60 SECONDS
	setInterval(() => {
	  // generate random number between 1 and list length.
	  const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
	  //const newActivity = status[randomIndex].activity;
  
	  client.user.setPresence({
		activities: [{
			name: status[randomIndex].activity, 
			type: status[randomIndex].type,
		}],
			//status: "idle"
		});
	}, 90000);

	//Random message
	setInterval(() => {
		let rnd = Math.floor(Math.random() * 551)
		if (rnd == 1) {
			const randomIndex = Math.floor(Math.random() * (rndmsg.length - 1) + 1);
			console.log(`[INFO] I sent the funny :)\n`)
			client.channels.cache.get("909565157846429809").send(rndmsg[randomIndex])
		}
		//console.log(rnd)
	  }, 60000);
});

//All slash commands. check "commands" folder
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(`${error}\n\n`)
		if (interaction.user.id !== "284804878604435476") {
            await interaction.reply({content: 'if you are seeing this, stuartt fucked up. please @ him with a screenshot of this error.\n\n\`\`\`${error}\`\`\`', ephemeral: true})
        } else {
            await interaction.reply({content: `wow good job you fucked something up (again)\n\n\`\`\`${error}\`\`\``, ephemeral: true})
        }
	}
});


//Message "commands"
client.on('messageCreate', async message => {

	if (message.author.bot) return

	if(message.guild.id !== guildId) return

	try {
		//gib parti coin for talkin :)
		if(!chattedRecently.has(message.author.id)){
			var dbusr = await client.db.Patzicoin.findOrCreate({
				where: { userID: message.author.id },
			});

			client.db.Patzicoin.increment('coins', { by: (Math.floor(Math.random() * (5 - 1 + 1)) + 5), where: { userID: message.author.id } });

			chattedRecently.add(message.author.id);
            setTimeout(() => {
                // Removes the user from the set after 60 seconds
                chattedRecently.delete(message.author.id);
                }, 60000);
		}

		if (message.content.toUpperCase().split(" ").includes("RATIO")) {
			message.react('💬')
				.then(() => message.react('<:retweet:950518370854379530>'))
				.then(() => message.react('❤️'))
				.catch(error => console.error('One of the emojis failed to react. This might be due to the user deleting their message.'));
		}
		//ender O block
		/*
		if (accents.remove(message.content.replace(/[^a-zA-Z]/g,"").toUpperCase().charAt(0)) === "O" ||message.content.charAt(0) === "0") {
			if (message.author.id == "889950256358375425") {
				await message.channel.send("H")
				message.guild.members.cache.get("889950256358375425").timeout(Math.floor(5 * 1000), `Saying O | Auto-Timeout`)
			}
		}*/
	} catch (e) {
		console.log(`${e}\n\n`)
	}

});

process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
	client.channels.cache.get("909565157846429809").send(`<@284804878604435476> [E]\n\`\`\`${error}\`\`\`\n\n\`\`\`${origin}\`\`\``)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
	client.channels.cache.get("909565157846429809").send(`<@284804878604435476> [R]\n\`\`\`${promise}\`\`\`\n\n\`\`\`${reason}\`\`\``)
})

client.login(token);