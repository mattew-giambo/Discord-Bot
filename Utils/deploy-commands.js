const fs = require("fs");
const { REST, Routes } = require("discord.js");
const { token, GuildID, ClientID } = require("../config.json")

let commands = [];
const rest = new REST();
rest.setToken(token);

(async () => {
    const fileComandi = fs.readdirSync("../commands").filter((file) => file.endsWith(".js"));
    console.log("\nFound files:", fileComandi);

    for (let file of fileComandi) {
        const cmd = require(`../commands/${file}`);
        commands.push(cmd.data);
    }

    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(ClientID, GuildID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}


    console.log("✅ All commands have been registered!");
})();


