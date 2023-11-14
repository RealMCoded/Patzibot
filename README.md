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

Running the following command will push your commands to the server defined in `guildId`
```
npm run deploy
```

## config.json

The bot requires a file called `config.json` to store the token and more info.

The file is gitignored (because it's my token, hands off!) but I included a file called `config.template` with what the `config.json` file should look like.

Just rename `config.template` to `config.json` and just edit the variables in that.

If for some reason you want the template that isn't in `config.template`, here you go

```json
{
    "hostID":"Your Discord ID",
    "powerList":["Your Discord ID", "Other peoples ID that you trust"],
    "clientId":"Bot Client ID",
    "guildId":"Active Guild ID",
    "token":"TOKEN HERE",
    "suggestionHook":"Webhook Link Here",
    "logWebhookURL":"Webhook Link Here",
    "joinleaveHook": "Webhook Link Here",
    "bankMaxBal":10000,
    "transferTax": 0.13,
    "markov": {
        "enabled": true,
        "sendChannel": "Channels where markovs send",
        "probability": 1,
        "contextLength": 250
    },
    "ignoreChannels": [],
    "specialReaction": {
        "triggerChars": ["P", "A", "T", "Z", "I"],
        "emojis": [
            "<:genocide:931832849169006652>",
            "<:noswearwords:909955005778366535>",
            "<:patzi_blunt:909580655510306846>",
            "<:raise_eyebrow:909593930021085234>"
        ]
    }
}
```

## quiz.json

In order for the `/quiz`command to work, you must make a file called `quiz.json` in `./resources/json/`. In that location, there is a file called `quiz.template`. You may rename that to `quiz.json`, or you may use the provided template below.

*note: `time` is in milliseconds.*

```json
{
    "questions":[
        {"question":"Question Text!", "answerCorrect": "This is the correct answer", "answerWrong1": "This is incorrect" , "answerWrong2": "This is also incorrect" , "answerWrong3": "This is another one that is incorrect", "time": 15000},
        {"question":"Click \"Yes\"", "answerCorrect": "Yes", "answerWrong1": "No" , "answerWrong2": "Maybe" , "answerWrong3": "Sure", "time": 15000}
    ]
}
```