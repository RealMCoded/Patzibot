# PatziBot

The official Discord Bot used in the [Patzi's World Discord server](https://discord.gg/pBFQPJQ5xd).

## Usage

Starting the bot is simple. All you need to have installed is [Node.js](https://nodejs.org/en/).

It's nothing that special. Just install requirements, edit `config.json` and run!

```
git clone https://github.com/RealMCoded/Patzibot
cd PatziBot
npm i
npm run start
```

## config.json

The bot requires a file called `config.json` to store the token and more info.

The file is gitignored (because it's my token and shit, hands off!) but i included a file called `config.template` with what the `config.json` file should look like.

Just rename `config.template` to `config.json` and just edit the variables in that.

if for some reason you want the template that isn't in `config.template`, here you go

```json
{
    "clientId":"",
    "testGuildId":"",
    "guildId":"",
    "token":"",
    "suggestionHook":"",
    "logWebhookURL":""
}
```