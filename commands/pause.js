const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausar el bot"),
  execute: async ({ client, interaction }) => {

    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      await interaction.reply("no hay ninguna cancion");
      return;
    }

    queue.setPaused(true);

    await interaction.reply("Bot pausado");
  },
};
