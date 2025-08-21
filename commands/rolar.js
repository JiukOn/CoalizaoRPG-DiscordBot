// commands/rolar.js
const { EmbedBuilder } = require('discord.js');
const { rolarDados } = require('../utils/dice');
const { COR_PRINCIPAL } = require('../config');

module.exports = {
    name: 'rolar',
    aliases: ['r'],
    description: 'Rola um ou mais dados no formato XdY.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const rolagemTexto = args[0] ? args[0].toLowerCase() : '1d20';
        const match = rolagemTexto.match(/^(\d+)d(\d+)$/);
        if (!match) return message.reply('Formato de rolagem inválido. Use `!rolar XdY` (ex: `!rolar 3d6`).');
        
        const quantidade = parseInt(match[1]);
        const lados = parseInt(match[2]);
        if (quantidade < 1 || quantidade > 100 || lados < 1 || lados > 1000) return message.reply('Quantidade ou tipo de dado inválido.');

        const { soma, rolagens } = rolarDados(quantidade, lados);
        
        const embed = new EmbedBuilder()
            .setColor(COR_PRINCIPAL)
            .setAuthor({ name: `${apelido} rolou ${rolagemTexto}` })
            .setTitle(`🎲 Resultado Total: ${soma}`)
            .setDescription(`**Rolagens:** ${rolagens.join(', ')}`);

        // Classificação especial para 1d4
        if (lados === 4 && quantidade === 1) {
            let classificacao;
            const roll = rolagens[0];
            if (roll === 1) classificacao = 'Pior'; //
            else if (roll === 2) classificacao = 'Ruim'; //
            else if (roll === 3) classificacao = 'Bom'; //
            else if (roll === 4) classificacao = 'Melhor'; //
            embed.setFooter({ text: `Classificação da Rolagem: ${classificacao}` });
        }
        
        return message.reply({ embeds: [embed] });
    },
};