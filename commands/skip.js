const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Saltá la canción actual perro"),

	execute: async ({ client, interaction }) => {

        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.reply("No hay ningun tema en la lista");
            return;
        }

        const currentSong = queue.current

        // Skip the current song
		queue.skip()

        // Return an embed to the user saying the song has been skipped
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`${currentSong.title} chau tema`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}