const tasks = require("../checkStatuses");
module.exports.run = async(client, message) => {
    //Edit message after reply
    await message.reply("Scanning started !");
    let result = await tasks.scanGuilds(message.guild);
    await message.editReply("Scanning ended, " + result + " members were sanctioned");
}

module.exports.config = {
    name: "forcecheck",
    description: "Force checking users statuses",
    canBeUseByBot: true,
    permission: "MANAGE_MESSAGES",
};
