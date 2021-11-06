const checkStatuses = require("../checkStatuses");
module.exports = async (client, member) => {
    await require("../sleep")(2000);
    await checkStatuses.checkMember(member);
}