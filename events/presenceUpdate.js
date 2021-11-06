const checkStatuses = require("../checkStatuses");
module.exports = async(oldPresence, newPresence) => {
    if(!newPresence) return;
    await checkStatuses.checkMember(newPresence.member);
}