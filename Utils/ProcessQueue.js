const {getVoiceConnection, joinVoiceChannel, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, StreamType} = require("@discordjs/voice");

module.exports = async function ProcessQueue(player, PlayerQueue){
    if(player.state.status !== AudioPlayerStatus.Playing && PlayerQueue.length){
        const obj =  PlayerQueue.shift();
        const file_stream = obj.file_stream;
        const interaction = obj.interaction;
        try{
            if(!getVoiceConnection(interaction.guildId)){ // il bot non è in nessun canale vocale
                const joinConfig = {
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator        
                }
                const connection = joinVoiceChannel(joinConfig);
                connection.subscribe(player);

                connection.on(VoiceConnectionStatus.Disconnected, async ()=>{
                    player.stop();
                    PlayerQueue.length = 0;
                });
            }
            
            const file = createAudioResource(file_stream, {
                inputType: StreamType.Arbitrary // Usa un formato compatibile con YouTube
            });
            player.play(file);
            interaction.followUp(`▶️ Now playing: **${obj.title}**`);
        }
        catch(error){
            console.log(error);
            interaction.followUp("❌ An error occurred");
        }  
    }
}