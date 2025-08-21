// commands/iniciativa.js
const { EmbedBuilder } = require('discord.js');
const { rolarDados } = require('../utils/dice');
const { buscarFicha } = require('../utils/ficha');
const { COR_PRINCIPAL, MESTRE_ROLE } = require('../config');

// A lista de iniciativa precisa ser armazenada fora da função execute para persistir
let iniciativaLista = [];

module.exports = {
    name: 'iniciativa',
    description: 'Gerencia a ordem de iniciativa para o combate.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const isMestre = message.member.roles.cache.some(role => role.name.toLowerCase() === MESTRE_ROLE.toLowerCase());

        if (args[0] && args[0].toLowerCase() === 'reset') {
            if (!isMestre) return message.reply('❌ Apenas mestres podem resetar a iniciativa.');
            iniciativaLista = [];
            return message.reply('✅ A ordem de iniciativa foi limpa!');
        }

        if (isMestre && args.length > 0) {
            const fullArgsString = args.join(' ');
            const entries = fullArgsString.split(','); // Esta linha separa a entrada em massa por vírgulas
            const addedCharacters = [];
            for (const entry of entries) {
                const parts = entry.trim().split(/ +/);
                if (parts.length < 2) continue;
                const bonusString = parts.pop();
                const nome = parts.join(' ');
                const bonus = parseInt(bonusString);
                if (isNaN(bonus)) {
                    message.channel.send(`⚠️ Aviso: O bônus para "${nome}" não é um número válido e foi ignorado.`);
                    continue;
                }
                if (iniciativaLista.some(p => p.nome === nome)) continue;
                const { rolagens } = rolarDados(1, 20);
                iniciativaLista.push({ nome, resultado: rolagens[0] + bonus, rolagem: rolagens[0], bonus });
                addedCharacters.push(nome);
            }
            if (addedCharacters.length > 0) {
                message.reply(`✅ Personagens adicionados: **${addedCharacters.join(', ')}**.`);
            }
        } else if (args.length === 0) {
            if (iniciativaLista.some(p => p.nome === apelido)) return message.reply('Você já está na ordem de iniciativa.');
            const ficha = await buscarFicha(apelido);
            if (!ficha) return message.reply('❌ Ficha não encontrada.');
            const bonus = ficha.bonus.DEX;
            const { rolagens } = rolarDados(1, 20);
            iniciativaLista.push({ nome: apelido, resultado: rolagens[0] + bonus, rolagem: rolagens[0], bonus });
        } else {
            return message.reply('Jogadores devem usar apenas `!iniciativa`. Mestres usam `!iniciativa <nome> <bônus>, ...`');
        }

        iniciativaLista.sort((a, b) => b.resultado - a.resultado);
        const embed = new EmbedBuilder()
            .setColor(COR_PRINCIPAL)
            .setTitle('⚔️ Ordem de Iniciativa ⚔️')
            .setDescription(iniciativaLista.map((p, index) => `${index + 1}º: **${p.nome}** - Resultado: **${p.resultado}** (Dado: ${p.rolagem} + Bônus: ${p.bonus})`).join('\n') || 'Ninguém rolou iniciativa ainda.');
        
        return message.channel.send({ embeds: [embed] });
    },
};