const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("poner cancione de yutub")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Buscar un tema y ponerlo")
        .addStringOption((option) =>
          option
            .setName("busqueda")
            .setDescription("titulo")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Añadir una playlist a la cola 7w7")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("link de la playlist")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Poner un tema de yutub")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("link de la cansion")
            .setRequired(true)
        )
    ),
  execute: async ({ client, interaction }) => {
    // Make sure the user is inside a voice channel
    if (!interaction.member.voice.channel)
      return interaction.reply(
        "Metete en llamaradas gil"
      );

    // Create a play queue for the server
    const queue = await client.player.createQueue(interaction.guild);

    // Wait until you are connected to the channel
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    const embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      // Search for the song using the discord-player
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      // finish if no tracks were found
      if (result.tracks.length === 0) return interaction.reply("sin resultados");

      // Add the track to the queue
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(
          `**[${song.title}](${song.url})** agregado a la lista`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duración: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === "playlist") {
      // Search for the playlist using the discord-player
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0)
        return interaction.reply(`no hay ninguna playlist en ese link`);

      // Add the tracks to the queue
      const playlist = result.playlist;
      await queue.addTracks(result.tracks);
      embed
        .setDescription(
          `**${result.tracks.length} canciones en [${playlist.title}](${playlist.url})** se agregaron a la lista`
        )
        .setThumbnail(playlist.thumbnail);
    } else if (interaction.options.getSubcommand() === "search") {
      // Search for the song using the discord-player
      let url = interaction.options.getString("searchterms");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      // finish if no tracks were found
      if (result.tracks.length === 0)
        return interaction.editReply("sin results");

      // Add the track to the queue
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(
          `**[${song.title}](${song.url})** agregado a la lista`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duración: ${song.duration}` });
    }

    // Play the song
    if (!queue.playing) await queue.play();

    // Respond with the embed containing information about the player
    await interaction.reply({
      embeds: [embed],
    });
  },
};
