const fs = require('fs');
const path = require('path')
const {Intents, Client, Collection} = require('discord.js');
const {token, botOwnerID, activity, activityType} = require('./config.json');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});

client.once('ready', () => {
    console.log("Logged in.");
});

client.login(token);

client.on('ready', () => progressDOS());
async function progressDOS() {
    const readline = require('readline')
    const cmd =
    readline.createInterface(process.stdin, process.stdout);
    cmd.setPrompt('> ')
    cmd.prompt();
    cmd.on('line', async line => {
        switch (line.split(' ')[0]) {
            case '':
                break;
            case 'help': 
                console.log('help - displays this\nexit - shuts down the bot\neval - evaluates code\nsend - sends a message\ndm - dm a user');
                break;
            case 'exit':
                cmd.close();
                process.exit(0);
            case 'eval':
                try {
                    eval(line.trim().substring(4))
                } catch (error) {
                    console.error(error)
                }
                break;
            case 'send':
                if (line.split(' ')[1] == "general") {
                    client.channels.cache.get('660753765049303041').send(line.split(' ').slice(2).join(' '))
                } else {
                    client.channels.cache.get(line.split(" ")[1]).send(line.split(" ").slice(2).join(" "))
                }
                break;
            case 'dm':
                let imp_user;
                try {
                    imp_user = await client.users.fetch(line.split(" ")[1])
                } catch (err) {
                    return console.log("invalid id")
                }

                imp_user.send(line.split(" ").slice(2).join(" "))

                break;
            default:
                console.log('Invalid command.')
        }
        cmd.prompt();
    })
}