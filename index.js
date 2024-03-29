require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const {
  Client,
  GatewayIntentBits,
  Command,
  Collection,
  ActivityType,
  Events,
} = require("discord.js");
const { Player } = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");
const { hasUncaughtExceptionCaptureCallback } = require("node:process");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.on("trackStart", (queue, track) =>
  queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
);

player.on("trackEnd", (queue, track) => {
  queue.metadata.channel.send(`🎶 | **${track.title}** has ended!`);
});

player.on("error", (queue, error) => {
  console.error(error);
  queue.metadata.channel.send(`❌ | An error encountered: ${error.message}`);
});

player.on("debug", (queue, message) => {
  console.log(message);
});

client.player = player;

client.on(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guilds_ids = client.guilds.cache.map((guild) => guild.id);

  const rest = new REST({ version: "9" }).setToken(process.env.token);

  for (const guild_id of guilds_ids) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.client, guild_id),
        { body: commands }
      );

      console.log(`Registered application commands for ${guild_id}`);
    } catch (error) {
      console.error(error);
    }
  }

  client.user.setActivity({
    name: "a tu señora",
    type: ActivityType.Watching,
  });
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute({ client, interaction });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: error,
    });
  }
});

client.login(process.env.token);
