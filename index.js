const {token, GuildID} = require("./config.json");
const {Client, GatewayIntentBits, Collection} = require("discord.js");
const {getVoiceConnection, joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus} = require("@discordjs/voice");
const fs = require("fs");

const ClientOptions ={
    presence:{
        status: "online",
        activities:[{
            name: "Trying to be a bot",
        }]
    },
    intents: Object.values(GatewayIntentBits)
}

const client = new Client(ClientOptions);
client.commands = new Collection();

let PlayerQueue = new Array(); // queue per audio player, condiviso tra file
const player = new createAudioPlayer(); // AudioPlayer
const ProcessQueue = require("./Utils/ProcessQueue.js");

client.once("ready", async ()=>{
    const fileComandi = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
    console.log("\nFound files:", fileComandi);

    for (let file of fileComandi) {
        const cmd = require(`./commands/${file}`);
        client.commands.set(cmd.data.name, cmd);
    }

    console.log("Ready! Logged in as: ", client.user.tag);  
    const guild = client.guilds.cache.get(GuildID);
    if(!guild)
        throw new Error("❌ Guild not found! Check the GUILD_ID in config.json.");

    console.log(`Actually logged in ${client.guilds.cache.size} guild(s):`);
    client.guilds.cache.forEach(g =>{
        console.log(`   - ${g.name}`);
    })
});

client.on("interactionCreate", async(interaction)=>{
    if(!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    if(!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    try{
        await command.execute(interaction, player, PlayerQueue, ProcessQueue);
    }
    catch(e){
        console.log(e);
        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "Something went wrong!", flags:"Ephemeral"});
            } else {
                await interaction.reply({ content: "Something went wrong!", flags:"Ephemeral"});
            }
        } catch (err) {
            console.error("Failed to send error message:", err);
        }
    }
});

player.on(AudioPlayerStatus.Idle, ()=>{
    const connection = getVoiceConnection(GuildID);
    if(!PlayerQueue.length && connection){
        setTimeout(()=> connection.destroy(), 1000);
    }
    ProcessQueue(player, PlayerQueue);
});

player.on("error", (error) => {
    console.error("❌ AudioPlayer error: ", error);
    if (PlayerQueue.length > 0) {
        console.log("🔄 Next track...");
        ProcessQueue(player, PlayerQueue);
    } else {
        console.log("🚪 The queue is empty");
        const connection = getVoiceConnection(GuildID);
        if (connection)
            connection.destroy();
    }
});

client.on("error", (error) =>{
    console.error("❌ Errore nel client:", error);
    const connection = getVoiceConnection(GuildID);
    if (connection) 
        connection.destroy();
    
});

client.login(token); 



