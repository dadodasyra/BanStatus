# Ban Discord Statuses
### Introduction
This bot allows you to ban discord statuses.
You can configure the bot to ban a status if it is in the list of banned statuses.
The list is available in the config.json file at root of the bot.

### A bot who use it 
[BanSpammers](https://discord.com/api/oauth2/authorize?client_id=906170850217185281&permissions=2147486726&scope=bot) who ban user using the [Mass-DM-discord repository](https://github.com/hoemotion/mass-dm-discord). People with 'github.com/hoemotion' in their status are banned.

### Configuration
Default config
```json
{
  "sanction": "kick", //Here you can choose between kick or ban
  "dmSpammer": false, //Choose if you want to send a dm to the user who used status
  "dmMessage": "You've been banned from {server} beceause you're using a selfbot against Discord TOS.", //The msg sended if dmSpammer is true

  "botStatus": "Catching spammers for {user_count} members", //The bot status

  "bannedStatuses": { //An array who contains the banned statuses
    "status1": {
      "search": "EQUAL", //Choose between EQUAL or INCLUDE/CONTAINS
      "type": "WATCHING", //Status type (WATCHING, STREAMING, PLAYING, LISTENING, CUSTOM)
      "name": "github.com/hoemotion", //Status name
      "description": "This is ignored because check.description is currently false.", //Status description
    },
    "status2": {
      "search": "INCLUDE",
      "type": "It can be WATCHING, STREAMING, PLAYING, LISTENING, custom statuses aren't here, you must desactivate type and type Custom Status in name case",
      "name": "This is the name of the status, ig. for a spotify music it can be the music title, a twitch stream name, a game name etc",
      "description": "This is the description of the status, ig. for a spotify music it can be the artist and the album etc",
    } //If you want to not check something, just leave it empty or remove the variable
  }
}
```

### Utility
You can for example use this bot to ban people who hear a shitty music (like Wejdene), or a streamer who is playing a game you don't like (like League of Legends).

To catch custom statuses you have to set 'CUSTOM' in type and the name is the content of the custom status.