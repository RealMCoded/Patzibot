# PatziBot

The official Discord Bot used in the [Patzi's World Discord server](https://discord.gg/pBFQPJQ5xd).

## Usage

Starting the bot is simple. All you need to have installed is [Node.js](https://nodejs.org/en/).

It's nothing that special. Just install requirements, edit `config.json` and run!

Here is a prebuilt script to get the bot running.
```bash
git clone https://github.com/RealMCoded/Patzibot
cd PatziBot
cp config.template config.json
$EDITOR config.json
npm i
npm run register global
npm run start
```

If you plan to use the Markov feature in your instance, make a file called `markov.txt` in the directory with the index.js file.

## Registering commands

Included is an npm script to register commands to 3 locations: `global`, `patzi`, and `test`.

- `global` registers commands as global commands.

- `patzi` registers commands to whatever server is in `guildId` in your config.

- `test` registers commands to whatever server is in `testGuildId` in your config.

## config.json

The bot requires a file called `config.json` to store the token and more info.

The file is gitignored (because it's my token, hands off!) but I included a file called `config.template` with what the `config.json` file should look like.

Just rename `config.template` to `config.json` and just edit the variables in that.

If for some reason you want the template that isn't in `config.template`, here you go

```json
{
    "clientId":"",
    "testGuildId":"",
    "guildId":"",
    "token":"",
    "suggestionHook":"",
    "logWebhookURL":"",
    "redirectConsoleOutputToWebhook":false,
    "bankMaxBal":2006,
    "useMarkov": false
}
```