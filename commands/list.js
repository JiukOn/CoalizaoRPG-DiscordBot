// commands/list.js
const { EmbedBuilder } = require('discord.js');
// Removendo as importações diretas de arquivos JSON e importando do config.js
const { 
    aurasData, 
    personalidadesData, 
    efeitosIniciaisData, 
    classesIniciaisData, 
    COR_PRINCIPAL 
} = require('../config');

module.exports = {
    name: 'list',
    description: 'Lista auras, personalidades, efeitos e classes iniciais.',
    async execute(message, args) {
        const subCommand = args[0] ? args[0].toLowerCase() : null;

        if (!subCommand) {
            return message.reply('❌ Você precisa especificar o que deseja listar. Uso: `!list <aura|personalidade|efeitosiniciais|classes>`');
        }

        const embed = new EmbedBuilder().setColor(COR_PRINCIPAL);

        switch (subCommand) {
            case 'aura':
                embed.setTitle('✨ Lista de Auras');
                // Usando os dados já carregados do config
                aurasData.forEach(aura => {
                    embed.addFields({ name: aura.nome, value: aura.descricao });
                });
                break;
            case 'personalidade':
                embed.setTitle('🎭 Lista de Personalidades');
                // Usando os dados já carregados do config
                personalidadesData.forEach(p => {
                    embed.addFields({ name: p.nome, value: p.descricao });
                });
                break;
            case 'efeitosiniciais':
            case 'efeitos iniciais':
                embed.setTitle('💫 Lista de Efeitos Iniciais');
                // Usando os dados já carregados do config
                efeitosIniciaisData.forEach(e => {
                    embed.addFields({ name: e.nome, value: e.descricao });
                });
                break;
            case 'classesiniciais':
            case 'classes iniciais':
                embed.setTitle('🎓 Lista de Classes Iniciais');
                // Usando os dados já carregados do config
                classesIniciaisData.forEach(c => {
                    embed.addFields({ name: `**${c.classe}** - Habilidade Legado: ${c.habilidade_nome}`, value: c.habilidade_descricao });
                });
                break;
            default:
                return message.reply('❌ Subcomando inválido. Use: `!list <aura|personalidade|efeitos iniciais|classes iniciais>`');
        }

        return message.channel.send({ embeds: [embed] });
    },
};