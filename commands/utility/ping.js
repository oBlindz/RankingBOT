const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Vai dizer pongo'),
  async execute(interaction) {
    await interaction.reply('pongo');
  }
}
