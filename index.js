// Importando dependências
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { token } = require("./config.json");

// Declarando Client e suas settings inciais
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(token);
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Mensagem avisando que o bot está online
client.once(Events.ClientReady, () => {
  console.log("Bot online");
});

// Transforma os códigos em interaçõestões 
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});

// Modal de preenchimento de stats
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rating') {
    const modal = new ModalBuilder()
      .setTitle('rating')
      .setCustomId('form-rating');

    // Criando campos
    const nick = new TextInputBuilder()
      .setLabel('Digite seu nick')
      .setStyle(TextInputStyle.Short)
      .setCustomId('form-rating-nick');

    const kills = new TextInputBuilder()
      .setLabel('Digite suas kills')
      .setStyle(TextInputStyle.Short)
      .setCustomId('form-rating-kills');

    const assists = new TextInputBuilder()
      .setLabel('Digite suas assistências')
      .setStyle(TextInputStyle.Short)
      .setCustomId('form-rating-assists');

    const deaths = new TextInputBuilder()
      .setLabel('Digite suas mortes')
      .setStyle(TextInputStyle.Short)
      .setCustomId('form-rating-deaths');

    const points = new TextInputBuilder()
      .setLabel('Digite seus pontos')
      .setStyle(TextInputStyle.Short)
      .setCustomId('form-rating-points');

    const rounds_win = new TextInputBuilder()
      .setLabel('Digite quantos rounds você ganhou')
      .setStyle(TextInputStyle.Short)
      .setCustomId('form-rating-rw');

    const rounds_lose = new TextInputBuilder()
      .setLabel('Digite quantos rounds você perdeu')
      .setStyle(TextInputStyle.Short)
      .setCustomId('form-rating-rl');


    // Criando as linhas
    const linha = new ActionRowBuilder().addComponents(nick);
    const linha1 = new ActionRowBuilder().addComponents(kills);
    const linha2 = new ActionRowBuilder().addComponents(assists);
    const linha3 = new ActionRowBuilder().addComponents(deaths);
    const linha4 = new ActionRowBuilder().addComponents(points);
    const linha5 = new ActionRowBuilder().addComponents(rounds_win);
    const linha6 = new ActionRowBuilder().addComponents(rounds_lose);

    // Adicionando as linhas ao modal
    modal.addComponents(
      linha,
      linha1,
      linha2,
      linha3,
      linha4
    );

    // Exibindo o modal
    await interaction.showModal(modal);
  }
});
