module.exports = (client, interaction) => {
    if(interaction.member.id === client.user.id) return;
    if (interaction.channel.type === 'DM') return;
    if (!interaction.isCommand()) return;

    let args = interaction.options;
    let commandname = interaction.commandName;
    let cmd = client.commands.get(commandname);

    if (!cmd) return;
    let conf = cmd.config;
    if (conf.permission && !interaction.member.permissions.has(conf.permission)) return interaction.reply("Vous n'avez pas la permission d'utiliser cette commande");
    if (interaction.member.bot && !conf.canBeUseByBot) return;

    if (conf.delete) interaction.delete();
    cmd.run(client, interaction, args);
};
