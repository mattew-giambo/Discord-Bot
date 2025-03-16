module.exports = {
    data:{
        name: "echo",
        description: "Echo message",
        options:[
            {
                name: "message",
                description: "Insert a message",
                required: true,
                type: 3
            }
        ]
    },
    async execute(interaction){
        await interaction.deferReply();
        setTimeout(()=> interaction.editReply(`\`${interaction.options.getString("message")}\` `), 500);
    }
}