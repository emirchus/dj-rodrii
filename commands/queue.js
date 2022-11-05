const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Mostrar las primeras 10 canciones"),

    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue || !queue.playing)
        {
            await interaction.reply("No hay canciones en la lista");
            return;
        }

        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**reproduciendo**\n` +
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "nada?") +
                        `\n\n**Lista**\n${queueString}`
                    )
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}