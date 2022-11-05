const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Arranca con el tema actual"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      await interaction.reply("sin canciones en la lista");
      return;
    }

    queue.setPaused(false);

    await interaction.reply("seguimos con el tema perrooooo");
  },
};
