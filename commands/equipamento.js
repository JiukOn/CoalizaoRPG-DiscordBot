// commands/equipamento.js
const { EmbedBuilder } = require('discord.js');
const { buscarFicha } = require('../utils/ficha');
const { COR_PRINCIPAL } = require('../config');

module.exports = {
    name: 'equipamento',
    aliases: ['equip'],
    description: 'Mostra os itens equipados do seu personagem.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const ficha = await buscarFicha(apelido);
        if (!ficha) {
            // Mensagem de erro aprimorada com sugestão para o usuário
            return message.reply('❌ Ficha não encontrada. Se você for um novo jogador, use `!novaficha` para criar uma.');
        }
        const equip = ficha.equipamento;
        if (!equip) return message.reply('❌ Não foi possível ler os dados de equipamento da ficha.');

        const formatItem = (slot) => {
            const item = equip[slot];
            if (!item || item.nome === 'N/A') return 'N/A';
            let itemString = `**${item.nome}**`;
            if (item.atributo !== 'N/A') itemString += `\n*Atributo:* ${item.atributo}`;
            if (item.caracteristica !== 'N/A') itemString += `\n*Característica:* ${item.caracteristica}`;
            return itemString;
        };

        const embed = new EmbedBuilder()
            .setColor(COR_PRINCIPAL).setTitle(`🛡️ Equipamento de ${ficha.infoBase.nome}`)
            .addFields(
                { name: '👤 Cabeça', value: formatItem('Cabeça'), inline: true },
                { name: '🎭 Rosto', value: formatItem('Rosto'), inline: true },
                { name: '📿 Pescoço', value: formatItem('Pescoço'), inline: true },
                { name: '👕 Corpo', value: formatItem('Corpo'), inline: false },
                { name: '🤚 Mão Direita', value: formatItem('Mão Direita'), inline: true },
                { name: '🤚 Mão Esquerda', value: formatItem('Mão Esquerda'), inline: true },
                { name: '💍 Acessório', value: formatItem('Acessório das Mãos'), inline: true },
                { name: '👖 Pernas', value: formatItem('Pernas'), inline: false },
                { name: '👢 Pés', value: formatItem('Pés'), inline: true }
            ).setFooter({ text: `Equipamento de ${apelido}` });
        
        return message.reply({ embeds: [embed] });
    },
};