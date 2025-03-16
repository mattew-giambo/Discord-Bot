const {AudioPlayerStatus} = require("@discordjs/voice");
const {orderedList}= require("discord.js");

module.exports = {
    data: {
        name: "queue",
        description: "Show the queue",
    },
    async execute(interaction, player = undefined, PlayerQueue) {
        await interaction.deferReply();
        try{
            if(PlayerQueue.length == 0){
                await interaction.editReply("💿 The queue is empty");
                return;
            }
            let titles = [];
            for(let obj of PlayerQueue){
                titles.push(obj.title);
            }
            await interaction.editReply(orderedList(titles));
        }
        catch(error){
            console.log(error);
            interaction.editReply("❌ An error occurred");
        }
        
    }
}