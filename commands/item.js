// commands/item.js

const { EmbedBuilder } = require('discord.js');
const { 
    todosOsItensData, 
    todosOsItensMap, 
    todosOsItensPorNomeMap, 
    COR_PRINCIPAL 
} = require('../config');
const { normalizeString } = require('../utils/helpers');

module.exports = {
    name: 'item',
    description: 'Mostra os detalhes de um item ou lista itens por tipo.',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Uso: `!item <nome do item | ID>` ou `!item list <tipo do item>`');
        }

        const subCommand = args[0].toLowerCase();
        
        if (subCommand === 'list') {
            const tipoDoItem = args.slice(1).join(' ');
            if (!tipoDoItem) {
                return message.reply('Por favor, especifique o tipo de item que deseja listar. Ex: `!item list arma`');
            }

            const normalizedTipo = normalizeString(tipoDoItem);
            const itensFiltrados = todosOsItensData.filter(item => normalizeString(item.tipo) === normalizedTipo);

            if (itensFiltrados.length === 0) {
                return message.reply(`❌ Não encontrei nenhum item do tipo "${tipoDoItem}".`);
            }

            const itensPorSubtipo = itensFiltrados.reduce((acc, item) => {
                const subtipo = item.subtipo || 'Diversos';
                if (!acc[subtipo]) {
                    acc[subtipo] = [];
                }
                acc[subtipo].push({ nome: item.nome, id: item.id });
                return acc;
            }, {});

            const mainEmbed = new EmbedBuilder()
                .setColor(COR_PRINCIPAL)
                .setTitle(`📋 Lista de Itens do Tipo: ${tipoDoItem.charAt(0).toUpperCase() + tipoDoItem.slice(1)}`);
            await message.reply({ embeds: [mainEmbed] });

            for (const subtipo in itensPorSubtipo) {
                const listaDeItensComId = itensPorSubtipo[subtipo].map(item => `\`${item.nome}\` (ID: **${item.id}**)`).join(', ');
                
                const partes = listaDeItensComId.match(/([\s\S]{1,1024})(?=, |$)/g) || [];
                
                for (let i = 0; i < partes.length; i++) {
                    const embedSubtipo = new EmbedBuilder()
                        .setColor(COR_PRINCIPAL)
                        .setTitle(`Subtipo: ${subtipo}${i > 0 ? ` (Continuação)` : ''}`)
                        .setDescription(partes[i]);
                    await message.channel.send({ embeds: [embedSubtipo] });
                }
            }
            
            return;

        } else {
            const buscaInput = args.join(' ');
            let itemEncontrado;

            const buscaPorId = parseInt(buscaInput);
            if (!isNaN(buscaPorId)) {
                itemEncontrado = todosOsItensMap.get(buscaPorId);
            } else {
                const normalizedNome = normalizeString(buscaInput);
                itemEncontrado = todosOsItensPorNomeMap.get(normalizedNome);
            }
            
            if (!itemEncontrado) {
                return message.reply(`❌ Não encontrei o item "${buscaInput}". Verifique o nome ou use o ID do item, ou use \`!item list\` para ver os tipos de itens disponíveis.`);
            }
            
            const embedItem = new EmbedBuilder().setColor(COR_PRINCIPAL).setTitle(`${itemEncontrado.nome} (ID: ${itemEncontrado.id})`)
                .addFields({ name: 'Tipo', value: `${itemEncontrado.tipo || 'N/A'}${itemEncontrado.subtipo ? ` (${itemEncontrado.subtipo})` : ''}`, inline: true });
            
            if (itemEncontrado.bonus) embedItem.addFields({ name: 'Bônus', value: itemEncontrado.bonus, inline: false });
            if (itemEncontrado.dano) embedItem.addFields({ name: 'Dano', value: itemEncontrado.dano, inline: true });
            if (itemEncontrado.defesa) embedItem.addFields({ name: 'Defesa', value: itemEncontrado.defesa, inline: true });
            if (itemEncontrado.modificacao) embedItem.addFields({ name: 'Modificação', value: itemEncontrado.modificacao, inline: false });
            if (itemEncontrado.efeito) embedItem.addFields({ name: 'Efeito', value: itemEncontrado.efeito, inline: false });
            if (itemEncontrado.habilidade) embedItem.addFields({ name: 'Habilidade', value: itemEncontrado.habilidade, inline: false });
            if (itemEncontrado.requisitos) embedItem.addFields({ name: 'Requisitos', value: itemEncontrado.requisitos, inline: false });
            
            if (itemEncontrado.durabilidade) embedItem.addFields({ name: 'Durabilidade', value: `${itemEncontrado.durabilidade} DP`, inline: true });
            if (itemEncontrado.custo) embedItem.addFields({ name: 'Custo', value: `${itemEncontrado.custo}`, inline: true });
            if (itemEncontrado.municao) embedItem.addFields({ name: 'Munição', value: `${itemEncontrado.municao}`, inline: true });

            return message.reply({ embeds: [embedItem] });
        }
    },
};