const config = require('./config.json');

class run {
    static async scanGuilds(guild = "all") {
        if(guild === "all"){
            let members = 0;
            run.client.guilds.cache.map(async guild => members += await run.scanMembers(guild));
            return members;
        } else {
            return await run.scanMembers(guild);
        }
    }

    static async scanMembers(guild) {
        let members = guild.members.cache;
        let i = 0;
        await members.map(async member => {
            await this.checkMember(member);
        });
        return i;
    }

    static async checkMember(member)
    {
        if(member.presence) {
            const activities = member.presence.activities;
            if (activities) {
                for (const activity of activities) {
                    if(!activity) continue;
                    if(await this.checkActivity(member, activity)) return;
                }
            }
        }
    }

    static async checkActivity(member, activity)
    {
        let bannedStatus = false;
        for(const toCheck of config.bannedStatuses){
            let name = activity.name === 'Custom Status' ? activity.state : activity.name;
            switch(toCheck.search.toLowerCase()){
                case 'include': case 'includes': case 'including':
                case 'contain': case 'contains': case 'containing':
                    if ((!toCheck.type || activity.type?.toLowerCase() === toCheck.type?.toLowerCase()) //if we dont check type OR we check type
                        && (!toCheck.name || name.includes(toCheck.name))
                        && (!toCheck.description || activity.description.includes(toCheck.description))) bannedStatus = true;
                    break;
                case 'equal': case 'equals':
                case '=':
                    if ((!toCheck.type || activity.type?.toLowerCase() === toCheck.type?.toLowerCase())
                        && (!toCheck.name ||name === toCheck.name)
                        && (!toCheck.description || activity.description === toCheck.description)) bannedStatus = true;
                    break;
            }
            if(bannedStatus){
                await this.sanctionMember(member);
                return true;
            }
        }
        return false;
    }

    static async sanctionMember(member)
    {
        let guild = member?.guild;
        if (config.dmSpammer) await member.send(config.dmMessage.replace("{server}", guild?.name)).catch(() => {});

        switch (config.sanction) {
            case 'kick':
                if (member.kickable) {
                    member.kick().then(() => {
                        run.client.spammersCount++;
                        console.log(member.user.tag + " has been kicked from " + guild?.name);
                    }).catch(error => {
                        console.error("Error on kicking " + member.user.tag + ", " + error)
                    });
                }
                break;
            case 'ban':
                if (member.bannable) {
                    member.ban().then(() => {
                        run.client.spammersCount++;
                        console.log(member.user.tag + " has been banned from " + guild?.name);
                    }).catch(error => {
                        console.error("Error on banning " + member.user.tag + ", " + error)
                    });
                }
                break;
        }
    }
    constructor(client) {
        run.client = client;
        setInterval(() => {
            const result = run.scanGuilds("all");
            if(result > 0) console.log("AutoScan sanctionned "+result+ " users");
        }, 180 * 1000); //3 min
    }
}
module.exports = run;
