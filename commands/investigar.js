// commands/investigar.js
const { EmbedBuilder } = require('discord.js');
const { buscarFicha } = require('../utils/ficha');
const { rolarDados } = require('../utils/dice');
const { ATRIBUTOS_INVESTIGACAO } = require('../config');

module.exports = {
    name: 'investigar',
    description: 'Realiza um teste de investigação contra uma dificuldade.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const atributoUsado = args[0] ? args[0].toUpperCase() : null;
        const dificuldade = parseInt(args[1]);

        if (!atributoUsado || isNaN(dificuldade) || !ATRIBUTOS_INVESTIGACAO.includes(atributoUsado)) {
            return message.reply('Uso: `!investigar <INT/PRE/CRM/RES> <dificuldade>`');
        }

        const ficha = await buscarFicha(apelido);
        if (!ficha) return message.reply('❌ Ficha não encontrada.');

        const bonusJogador = ficha.bonus[atributoUsado];
        const { rolagens } = rolarDados(1, 20);
        const roll = rolagens[0];
        const totalJogador = roll + bonusJogador;
        const sucesso = totalJogador >= dificuldade;

        let resultadoTexto;
        let corEmbed;
        
        // --- Lógica de falhas e sucesso ---
        if (roll === 1) {
            resultadoTexto = "💥 **Desastre:** Sua investigação leva a uma pista falsa, ativa uma armadilha inesperada ou causa um trauma psicológico.";
            corEmbed = '#D92D43';
        } else if (roll >= 2 && roll <= 5) {
            resultadoTexto = "🤔 **Ruim:** Você encontra uma pista, mas ela está incompleta ou foi mal interpretada, levando a conclusões erradas.";
            corEmbed = '#ED4245';
        } else if (roll >= 6 && roll <= 8) {
            resultadoTexto = "🔎 **Normal:** A pista encontrada é vaga, exigindo uma nova ação ou um esforço adicional para ser compreendida em sua totalidade.";
            corEmbed = '#ED4245';
        } else if (roll === 20) {
            resultadoTexto = "🌟 **Sucesso Crítico:** Sua investigação é perfeita e você descobre tudo o que precisa.";
            corEmbed = '#FFD700';
        } else if (sucesso) {
            resultadoTexto = "✅ **Sucesso!** Sua investigação foi bem-sucedida.";
            corEmbed = '#57F287';
        } else {
            resultadoTexto = "❌ **Falha!** Você não encontra nada relevante.";
            corEmbed = '#ED4245';
        }
        
        let dificuldadeTexto = `**${dificuldade}**`;
        if (dificuldade <= 8) dificuldadeTexto += " (Muito Fácil)";
        else if (dificuldade <= 12) dificuldadeTexto += " (Comum)";
        else if (dificuldade <= 16) dificuldadeTexto += " (Complexa)";
        else if (dificuldade >= 18) dificuldadeTexto += " (Oculta/Proibida)";

        const embed = new EmbedBuilder()
            .setColor(corEmbed)
            .setTitle(`🔍 Teste de Investigação (${atributoUsado})`)
            .addFields(
                { name: `Sua Rolagem (${apelido})`, value: `d20[${roll}] + ${bonusJogador} (bônus) = **${totalJogador}**` },
                { name: 'Dificuldade', value: dificuldadeTexto },
                { name: 'Resultado', value: resultadoTexto }
            )
            .setFooter({ text: 'A investigação pode ser influenciada por fatores como ambiente, texto ou lógica.' });

        return message.reply({ embeds: [embed] });
    },
};