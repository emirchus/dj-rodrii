const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Saltá la canción actual perro"),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      await interaction.reply("No hay ningun tema en la lista");
      return;
    }

    const currentSong = queue.current;

    queue.skip();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${currentSong.title} chau tema`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
