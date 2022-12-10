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
    "hostID":"",
    "powerList":["user", "ids", "here"],
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

| Key                         | Function                                                                                                                           | type   | Example                                                                                                          |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------|--------|------------------------------------------------------------------------------------------------------------------|
| hostID                      | The User ID of the instance host.                                                                                                  | string | 284804878604435476                                                                                               |
| powerList                   | An array of users who can use some more powerful commands.  **Note: You must also add yourself to this list!**                     | array  | ["1234567890", "0987654321", "9475867485"]                                                                       |
| clientId                    | The User ID of the bot.                                                                                                            | string | 876729461188464660                                                                                               |
| testGuildId                 | The ID of your testing server.  Can be ignored if you don't plan to use a test server.  Can be ignored if you use global commands. | string | 1040451939969798174                                                                                              |
| guildId                     | The ID of the main server your bot will be in.  Can be ignored if you use global commands.                                         | string | 909565157116608573                                                                                               |
| token                       | The token of your bot.                                                                                                             | string | 8t3gW-QPPA-spIreEfBcS9zvmLyCsnH9iNcwyLNxA5ZDxod3l50yqQfUtNIDKnl5pwgO                                             |
| suggestionHook              | The webhook URL for the suggestions channel.  If left blank, the suggestions feature will be disabled.                             | string | https://discord.com/api/webhooks/1234567890/8t3gW-QPPA-spIreEfBcS9zvmLyCsnH9iNcwyLNxA5ZDxod3l50yqQfUtNIDKnl5pwgO |
| logWebhookURL               | The webhook URL for the console output to go to.  To disable, set `redirectConsoleLogToWebhook` to `false`.                        | string | https://discord.com/api/webhooks/1234567890/8t3gW-QPPA-spIreEfBcS9zvmLyCsnH9iNcwyLNxA5ZDxod3l50yqQfUtNIDKnl5pwgO |
| redirectConsoleLogToWebhook | Enable/disable console output going to the `logWebhookURL`.                                                                        | bool   | true                                                                                                             |
| bankMaxBal                  | The max balance someone can have in their bank                                                                                     | int    | 2006                                                                                                             |
| useMarkov                   | Toggle the random message feature.                                                                                                 | bool   | true                                                                                                             |