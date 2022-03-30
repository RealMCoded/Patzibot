const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, randomMessage } = require('./config.json');
const status = require('./commands/resources/json/status.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('==================================================================\nBOT IS ONLINE!\nAll errors and logs (soundboard, voicetts and say) will show here.\n==================================================================\n');

	 // generate random number between 1 and list length.
	 const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
	 //const newActivity = status[randomIndex].activity;
 
	 client.user.setPresence({
	   activities: [{
		   name: status[randomIndex].activity, 
		   type: status[randomIndex].type,
	   }],
		   status: "idle"
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
			status: "idle"
		});
	}, 60000);

	//Random message
	setInterval(() => {
		let rnd = Math.floor(Math.random() * 501)
		if (rnd == 1) {
			console.log(`- I sent the funny :)\n`)
			client.channels.cache.get("909565157846429809").send(randomMessage)
		}
		//console.log(rnd)
	  }, 30000);
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
            await interaction.reply({content: 'if you are seeing this, <@284804878604435476> messed up somehow.', ephemeral: true})
        } else {
            await interaction.reply({content: `wow good job you fucked something up (again)\n\n\`\`\`${error}\`\`\``, ephemeral: true})
        }
	}
});


//Message "commands"
client.on('messageCreate', async message => {

	if (message.author.bot) return

	try {
		if (message.content.toUpperCase().split(" ").includes("RATIO")) {
			message.react('💬')
				.then(() => message.react('<:retweet:950518370854379530>'))
				.then(() => message.react('❤️'))
				.catch(error => console.error('One of the emojis failed to react. This might be due to the user deleting their message.'));
		}
		
		//ender O block
		if (message.content.replace(/[^a-zA-Z]/g,"").toUpperCase().split(" ").charAt(0).includes("O")) {
			if (message.author.id == "889950256358375425") {
				await message.channel.send("H")
				message.guild.members.cache.get("889950256358375425").timeout(Math.floor(5 * 1000), `Saying O | Auto-Timeout`)
			}
		}
	} catch (e) {
		console.log(`${e}\n\n`)
	}

});

client.login(token);