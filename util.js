const { ActivityType } = require('discord.js');

function setStatus() {
    const statuses = require("./resources/json/status.json");
    const randomIndex = Math.floor(Math.random() * (statuses.length - 1) + 1);

    let activityData = {status: "PatziBot", type: ActivityType.Playing, url:"https://www.youtube.com/watch?v=GQ6rr1otWpg"};

    switch(statuses[randomIndex].type){
        case "PLAYING": {
            activityData = {
                status: statuses[randomIndex].activity,
                type: ActivityType.Playing
            }
        } break;

        case "LISTENING": {
            activityData = {
                status: statuses[randomIndex].activity,
                type: ActivityType.Listening
            }
        } break;

        case "WATCHING": {
            activityData = {
                status: statuses[randomIndex].activity,
                type: ActivityType.Watching
            }
        } break;

        case "COMPETING": {
            activityData = {
                status: statuses[randomIndex].activity,
                type: ActivityType.Competing
            }
        } break;

        case "STREAMING": {
            activityData = {
                status: statuses[randomIndex].activity,
                type: ActivityType.Streaming,
                url:"https://www.youtube.com/watch?v=GQ6rr1otWpg"
            }
        } break;

        case "CUSTOM": {
            activityData = {
                status: statuses[randomIndex].activity,
                type: ActivityType.Custom
            }
        } break;
    }

    return activityData;
}

function random_range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function random(number) {
    return Math.floor(Math.random() * number)
}

function formatUsername(user) {
    return user.discriminator == "0" ? `${user.username}` : user.tag
}

function validateExpression(number) {
    return /^[+\-/*^0-9().]+$/.test(number)
}

function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

function isBooster(member) {
    const roleID = require("./config.json").serverBoosterRoleID
    return member.roles.cache.has(roleID);
}

module.exports = { setStatus, formatUsername, random, random_range, validateExpression, getOccurrence, isBooster }