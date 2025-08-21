// commands/inventario.js
const { EmbedBuilder } = require('discord.js');
const { buscarFicha } = require('../utils/ficha');
const { COR_PRINCIPAL } = require('../config');

module.exports = {
    name: 'inventario',
    aliases: ['inv'],
    description: 'Mostra o inventário do seu personagem.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const ficha = await buscarFicha(apelido);
        if (!ficha) {
            // Mensagem de erro aprimorada com sugestão para o usuário
            return message.reply('❌ Ficha não encontrada. Se você for um novo jogador, use `!novaficha` para criar uma.');
        }
        
        const inventario = ficha.inventario || [];
        let inventarioTexto = '*O inventário está vazio.*';
        if (inventario.length > 0) {
            const itemsPorLinha = 4;
            const linhas = [];
            for (let i = 0; i < inventario.length; i += itemsPorLinha) {
                linhas.push(inventario.slice(i, i + itemsPorLinha).join(' | '));
            }
            inventarioTexto = linhas.join('\n');
        }
        
        const embed = new EmbedBuilder()
            .setColor(COR_PRINCIPAL)
            .setTitle(`🎒 Inventário de ${ficha.infoBase.nome}`)
            .setDescription(inventarioTexto)
            .setFooter({ text: `${inventario.length} / 35 itens ocupados` });
            
        return message.reply({ embeds: [embed] });
    },
};