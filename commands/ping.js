module.exports = {
    data: {
        name: "ping",
        description: "Reply with Pong!"
    },
    async execute(interaction) {
        await interaction.deferReply();
        setTimeout(()=> interaction.editReply("🏓 Pong!"), 500);
    }
}
