// Criar um modal onde o jogador insere os dados e obter o rating dele 
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rating')
    .setDescription('Esse comando ira lhe retornar seu rating'),
  async execute() {
  }
}
