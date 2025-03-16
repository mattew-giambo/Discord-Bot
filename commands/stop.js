const {AudioPlayerStatus, getVoiceConnection} = require("@discordjs/voice");

module.exports = {
    data: {
        name: "stop",
        description: "Stop the bot",
    },
    async execute(interaction, player, PlayerQueue) {
        await interaction.deferReply();
        try{
            const connection = getVoiceConnection(interaction.guildId);
            if(!connection){
                await interaction.editReply("❌ I'm not in a channel");
                return;
            }
            if(player.state.status === AudioPlayerStatus.Idle) {
                await interaction.editReply("❌ There is nothing playing.");
                return;
            }
            PlayerQueue.length = 0;
            player.stop();
            interaction.editReply("⏹️ The player has been successfully stopped.");
        }
        catch(error){
            console.log(error);
            interaction.editReply("❌ An error occurred");
        }
        
    }
}