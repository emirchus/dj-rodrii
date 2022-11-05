const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pausar el bot"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply("no hay ninguna cancion")
			return;
		}

        // Pause the current song
		queue.setPaused(true);

        await interaction.reply("Bot pausado")
	},
}