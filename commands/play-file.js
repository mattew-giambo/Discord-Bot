const {getVoiceConnection, VoiceConnectionStatus} = require("@discordjs/voice");

module.exports = {
    data: {
        name: "play-file",
        description: "Reproduce an audio file",
        options:[
            {
                name: "query",
                description: "Insert the audio file",
                required: true,
                type: 11
            }
        ]
    },
    async execute(interaction, player, PlayerQueue, ProcessQueue) {
        await interaction.deferReply();
        try{
            if(!interaction.member.voice.channelId){
                interaction.editReply("❌ You are not in a voice channel!");
                return;
            }
            let connection = getVoiceConnection(interaction.guildId);

            if (connection && connection.state.status === VoiceConnectionStatus.Disconnected)
                connection.destroy();
                
            const attachment = interaction.options.getAttachment("query");
            
            const ValidExensions = [".mp3", ".wav"];
            if(!ValidExensions.some(ext => attachment.name.toLowerCase().endsWith(ext)))
                return interaction.editReply("❌ It is not an audio file!");
            
            file_url = attachment.url;
            const response = await fetch(file_url);
            if(!response.ok)
                interaction.editReply("❌ An error occurred");

            file_stream = (await response.blob()).stream();

            const Obj ={
                interaction: interaction,
                file_stream: file_stream,
                title: attachment.name
            }

            PlayerQueue.push(Obj);
            interaction.editReply(`⏏️ Added to queue: **${attachment.name}**`);

            ProcessQueue(player, PlayerQueue);
        }
        catch(error){
            console.log(error);
            interaction.followUp("❌ An error occurred");
        }
    }
}
