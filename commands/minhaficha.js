const { EmbedBuilder } = require('discord.js');
const { buscarFicha } = require('../utils/ficha');
const { COR_PRINCIPAL, emojiMap } = require('../config');

module.exports = {
    name: 'minhaficha',
    aliases: ['ficha'],
    description: 'Exibe a ficha completa do seu personagem.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const ficha = await buscarFicha(apelido);
        if (!ficha) {
            // Mensagem de erro aprimorada com sugestão para o usuário
            return message.reply('❌ Sua ficha não foi encontrada. Se você for um novo jogador, use `!novaficha` para criar uma.');
        }

        const efeitosString = Array.isArray(ficha.detalhes.efeitos) ? ficha.detalhes.efeitos.join(', ') : ficha.detalhes.efeito;
        
        const embed = new EmbedBuilder()
            .setColor(COR_PRINCIPAL)
            .setTitle(`📜 Ficha de ${ficha.infoBase.nome}`)
            .setDescription(ficha.detalhes.fraseDeEfeito ? `*"${ficha.detalhes.fraseDeEfeito}"*` : ' ')
            .addFields(
                { name: 'Informações Básicas', value: [
                    `**Nome:** ${ficha.infoBase.nome}`,
                    `**Idade:** ${ficha.infoBase.idade} anos`,
                    `**Espécie:** ${ficha.infoBase.especie}`,
                    `**Personalidade:** ${ficha.detalhes.personalidade}`,
                    `**Efeitos Psicológicos:** ${efeitosString || 'Nenhum'}`,
                    `**História:** ${ficha.detalhes.historia}`
                ].join('\n')},
                { name: 'Atributos e Poderes', value: [
                    `**Classe:** ${ficha.infoBase.classe}`,
                    `**Aura:** ${ficha.detalhes.aura}`,
                    `**Atributos:**`
                ].join('\n')},
                { name: `${emojiMap.VIT} VIT`, value: `${ficha.atributos.VIT || 0} (${ficha.bonus.VIT >= 0 ? '+' : ''}${ficha.bonus.VIT})`, inline: true },
                { name: `${emojiMap.DEX} DEX`, value: `${ficha.atributos.DEX || 0} (${ficha.bonus.DEX >= 0 ? '+' : ''}${ficha.bonus.DEX})`, inline: true },
                { name: `${emojiMap.CRM} CRM`, value: `${ficha.atributos.CRM || 0} (${ficha.bonus.CRM >= 0 ? '+' : ''}${ficha.bonus.CRM})`, inline: true },
                { name: `${emojiMap.FRC} FRC`, value: `${ficha.atributos.FRC || 0} (${ficha.bonus.FRC >= 0 ? '+' : ''}${ficha.bonus.FRC})`, inline: true },
                { name: `${emojiMap.INT} INT`, value: `${ficha.atributos.INT || 0} (${ficha.bonus.INT >= 0 ? '+' : ''}${ficha.bonus.INT})`, inline: true },
                { name: `${emojiMap.RES} RES`, value: `${ficha.atributos.RES || 0} (${ficha.bonus.RES >= 0 ? '+' : ''}${ficha.bonus.RES})`, inline: true },
                { name: `${emojiMap.PRE} PRE`, value: `${ficha.atributos.PRE || 0} (${ficha.bonus.PRE >= 0 ? '+' : ''}${ficha.bonus.PRE})`, inline: true },
                { name: `${emojiMap.ENR} ENR`, value: `${ficha.atributos.ENR || 0} (${ficha.bonus.ENR >= 0 ? '+' : ''}${ficha.bonus.ENR})`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Ficha de ${apelido}` });

        return message.reply({ embeds: [embed] });
    },
};