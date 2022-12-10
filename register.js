const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId, testGuildId } = require('./config.json');
const fs = require('node:fs');

const mode = process.argv[2]

if (mode == undefined) {console.log("❌ No option provided!\n\nTry:\n- global\n- patzi\n- test"); return;}

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({version:9}).setToken(token);

switch(mode){
    case "global": {global()} break;
    case "patzi": {patzi()} break;
    case "test": {test()} break;
    default: console.log("❌ Invalid option!\n\nTry:\n- global\n- patzi\n- test"); break;
}

async function global() {
    console.log(`⚠️ You are refreshing global commands!\n`);
    (async () => {
        try {
            console.log(`🔃 Refreshing ${commands.length} commands...`);
            await rest.put(
                Routes.applicationCommands(clientId),
                {body:commands},
            );
    
            console.log(`✅ Successfully refreshed ${commands.length} commands!`);
        } catch (error) {
            console.error(error);
        }
    })();
}

async function patzi() {
    console.log(`⚠️ You are refreshing commands for Patzi's World only!\n`);
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
}

async function test() {
    console.log(`⚠️ You are refreshing commands for the testing server only!\n`);
    (async () => {
        try {
            console.log(`🔃 Refreshing ${commands.length} commands...`);
    
            await rest.put(
                Routes.applicationGuildCommands(clientId, testGuildId),
                { body: commands },
            );
    
            console.log(`✅ Successfully refreshed ${commands.length} commands!`);
        } catch (error) {
            console.error(error);
        }
    })();
}