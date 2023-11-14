const { Events } = require('discord.js');
const { setStatus } = require("../util.js")

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.db.Patzicoin.sync()

        console.log(`Ready! Logged in as ${client.user.tag}`);

        let statusData = setStatus()

        client.user.setActivity(statusData.status, { type: statusData.type, url: statusData.url });

        setInterval(() => {
            let statusData = setStatus()

            client.user.setActivity(statusData.status, { type: statusData.type, url: statusData.url });
        }, 90000);
	},
};