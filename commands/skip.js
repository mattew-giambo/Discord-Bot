const {AudioPlayerStatus} = require("@discordjs/voice");
const ProcessQueue = require("../Utils/ProcessQueue");

module.exports = {
    data: {
        name: "skip",
        description: "Skip the current audio",
    },
    async execute(interaction, player, PlayerQueue) {
        await interaction.deferReply();
        try{
            if(player.state.status === AudioPlayerStatus.Idle){
                interaction.editReply("❌ The queue is empty");
                return;
            }
            interaction.editReply("⏩ Song skipped!");
            player.stop();
            ProcessQueue(player, PlayerQueue);
        }catch(error){
            console.log(error);
            interaction.editReply("❌ An error occurred");
        }
        
    }
}