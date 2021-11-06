const Discord = require('discord.js');
const client = new Discord.Client({ intents: new Discord.Intents(32767) });
const fs = require('fs');
const path = require("path");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const hidden = require("./hidden.json");

let commandstoregister = [];
client.spammersCount = 0;
client.commands = new Discord.Collection();

async function start() {
    fs.readdir(path.resolve(__dirname, './events/'), (error, f) => {
        if (error) return console.error(error);

        f.forEach((f) => {
            let events = require(`./events/${f}`);
            let event = f.split('.')[0];
            client.on(event, events.bind(null, client));
        });
        console.log(`${f.length} events loaded`);
    });

    await client.login(hidden.token).catch(error => console.log("Error on connection: " + error));
    await loadcommands();
}

async function loadcommands() {
    let f = await fs.readdirSync(path.resolve(__dirname, './commands/'));
    let commands = f.filter(f => f.split('.').pop() === 'js');
    let total = 0, cmd;

    commands.forEach((f) => {
        cmd = require(`./commands/${f}`);
        loadcommand(cmd)
        total++;
    });

    const rest = new REST({version: '9'}).setToken(hidden.token);
    await (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(client.user.id),
                {body: commandstoregister},
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {console.error(error);}
    })();
    console.log(total+" commands loaded");
}
function loadcommand(cmd)
{
    let conf;
    conf = cmd.config;

    let slashcmd = new SlashCommandBuilder()
        .setName(conf.name)
        .setDescription(conf.description);

    if (conf.needed_args) {
        for (let i = 1; conf.needed_args >= i; i++) {
            slashcmd = slashcmd.addStringOption(option => option.setName("arg_" + i).setDescription("Arg required").setRequired(true));
        }
    }
    commandstoregister.push(slashcmd.toJSON());
    client.commands.set(conf.name, cmd);
    if (conf.alias) {
        conf.alias.forEach((ali) => {
            client.commands.set(ali, cmd);
        });
    }
}

start();

process.stdin.resume();
async function exitHandler(options, exitCode) {
    console.log(`Bot down. ${client.spammersCount} users sanctionned during uptime. ${exitCode} exitcode`);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{exit: false}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));//Ctrl+C
process.on('SIGUSR1', exitHandler.bind(null, {exit:true})); //KILL PID
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));