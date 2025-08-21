// commands/ajuda.js
const { EmbedBuilder } = require('discord.js');
const { COR_PRINCIPAL } = require('../config');

module.exports = {
    name: 'ajuda',
    aliases: ['comandos'],
    description: 'Mostra a lista de todos os comandos do bot.',
    requiresRole: false, // Permite que qualquer pessoa use o comando de ajuda

    execute(message, args) {
        const embedAjuda = new EmbedBuilder()
            .setColor(COR_PRINCIPAL)
            .setTitle('📜 Lista de Comandos do Bot')
            .setDescription('Aqui estão todos os comandos disponíveis, com a sintaxe correta para cada um.')
            .addFields(
                { 
                    name: '🎲 Rolagens', 
                    value: '`!rolar <XdY>` ou `!r <XdY>`\n*Rola X dados de Y faces (padrão: `1d20`).*', 
                    inline: false 
                },
                { 
                    name: '👤 Personagem', 
                    value: '`!minhaficha` - Mostra sua ficha completa.\n`!inventario` ou `!inv` - Exibe seu inventário.\n`!equipamento` ou `!equip` - Mostra seus itens equipados.\n`!novaficha` - Inicia o processo de criação de personagem.\n`!editarficha <campo> <valor>` - Permite que jogadores editem sua própria ficha.', 
                    inline: false 
                },
                { 
                    name: '📖 Informações', 
                    value: '`!item <nome do item>` - Exibe detalhes de um item.\n`!lista <tipo>` - Lista auras, personalidades, classes ou efeitos.', 
                    inline: false 
                },
                { 
                    name: '⚔️ Ações', 
                    value: '`!teste <atr> <dif> [vantagem/desvantagem]`\n`!iniciativa`\n`!furtividade <atr> <dif> [vantagem/desvantagem]`\n`!investigar <atr> <dif>`', 
                    inline: false 
                },
                { 
                    name: '👑 Comandos do Mestre', 
                    value: '`!iniciativa <nome> <bônus>, ...`\n`!iniciativa reset`\n`!editarficha <alvo> <campo> <valor>`', 
                    inline: false 
                }
            );
            
        return message.channel.send({ embeds: [embedAjuda] });
    },
};