const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Arranca con el tema actual"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
        {
            await interaction.reply("sin canciones en la lista");
            return;
        }

        // Pause the current song
		queue.setPaused(false);

        await interaction.reply("seguimos con el tema perrooooo")
	},
}