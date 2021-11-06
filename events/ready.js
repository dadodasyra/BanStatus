const config = require('../config.json');
module.exports = async(client) => {
    const checkStatuses = require('../checkStatuses.js');
    new checkStatuses(client);
    console.log(`Bot started with ${client.users.cache.size} users, in ${client.channels.cache.size} channels and ${client.guilds.cache.size} servers.`);
    client.user.setActivity(config.botStatus.replace("{user_count}", client.users.cache.size), {
        type: "STREAMING",
        url: "https://twitch.tv/dadodasyra"
    });
};