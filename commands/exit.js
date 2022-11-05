const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("exit").setDescription("apagar bot."),
  execute: async ({ client, interaction }) => {

    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      await interaction.reply("no hay canciones gil");
      return;
    }

    queue.destroy();

    await interaction.reply("CAÑO PUTO");
  },
};
