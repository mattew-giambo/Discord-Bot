const {chatInputApplicationCommandMention} = require("discord.js");
module.exports ={
    data:{
        name: "cmdlist",
        description: "get the commands list"
    },
    async execute(interaction){
        await interaction.deferReply();
        const commands = await interaction.guild.commands.fetch();

        let message = "\# Commands List\n"
        let i = 1;
        commands.forEach(cmd => {
            message = message.concat(`\*\*${i}.\*\* ${chatInputApplicationCommandMention(cmd.name, cmd.id)}\n`);
            i++;
        });
        await interaction.editReply(message);
    }   
}