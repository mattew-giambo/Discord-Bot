const {getVoiceConnection, VoiceConnectionStatus, OpusEncoder } = require("@discordjs/voice");
const ytdl = require('@distube/ytdl-core');
const play = require('play-dl');

module.exports = {
    data: {
        name: "play",
        description: "Reproduce a YouTube video as an audio",
        options:[
            {
                name: "query",
                description: "Insert the video url or the video name",
                required: true,
                type: 3
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

            if(connection && connection.state.status === VoiceConnectionStatus.Disconnected)
                connection.destroy();
                
            const query= interaction.options.getString("query");
            let videoURL;
            let title;

            const type = play.yt_validate(query);

            if(type === "playlist"){
                const playlist = await play.playlist_info(query);
                title = playlist.title;
                const videos = await playlist.all_videos();

                for(let v of videos){
                    const file_stream = ytdl(v.url, {
                        quality: 'highestaudio',
                        filter: 'audioonly'
                    });
            
                    const Obj ={
                        interaction: interaction,
                        file_stream: file_stream,
                        type: "play",
                        title: v.title,
                        url: v.url
                    }
                    PlayerQueue.push(Obj);
                }
                interaction.editReply(`⏏️ Added to queue: **${title}**`);

                ProcessQueue(player, PlayerQueue);
                return;
            }
            else if(type === "video"){
                videoURL = query;
                const video = (await play.video_basic_info(videoURL)).video_details;
                title = video.title;
            }
            else{ // type === "searched"
                const searched = await play.search(query, { source: { youtube: "video" }, limit: 1 });
        
                if (!searched.length) {
                    interaction.followUp("❌ No videos found");
                    return;
                }
                const video = searched[0];
                title = video.title;
                videoURL = video.url;
            }
            

            const file_stream = ytdl(videoURL, {
                quality: 'highestaudio',
                filter: 'audioonly',
                highWaterMark: 1 << 27,
                dlChunkSize: 0
            });
    
            const Obj ={
                interaction: interaction,
                file_stream: file_stream,
                type: "play",
                title: title,
                url: videoURL
            }
            
            PlayerQueue.push(Obj);
            interaction.editReply(`⏏️ Added to queue: **${title}**`);
    
            ProcessQueue(player, PlayerQueue);
            
        }
        catch(error){
            console.log(error);
            interaction.followUp("❌ An error occurred");
        }
        
    }
}
