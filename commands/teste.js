// commands/teste.js
const { EmbedBuilder } = require('discord.js');
const { rolarDados } = require('../utils/dice');
const { buscarFicha } = require('../utils/ficha');
const { ATRIBUTOS_VALIDOS, emojiMap } = require('../config');

module.exports = {
    name: 'teste',
    description: 'Realiza um teste de atributo contra uma dificuldade.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const atributoDesejado = args[0] ? args[0].toUpperCase() : null;
        const dificuldade = parseInt(args[1]);
        const modificador = args[2] ? args[2].toLowerCase() : null;

        if (!atributoDesejado || isNaN(dificuldade) || !ATRIBUTOS_VALIDOS.includes(atributoDesejado)) {
            return message.reply('Uso: `!teste <atributo> <dificuldade> [vantagem/desvantagem]`');
        }

        const ficha = await buscarFicha(apelido);
        if (!ficha) return message.reply('❌ Ficha não encontrada.');

        const bonus = ficha.bonus[atributoDesejado];
        let d20Roll, rollsTexto;
        const { rolagens } = rolarDados(modificador ? 2 : 1, 20);

        if (modificador === 'vantagem') d20Roll = Math.max(...rolagens);
        else if (modificador === 'desvantagem') d20Roll = Math.min(...rolagens);
        else d20Roll = rolagens[0];
        rollsTexto = `[${rolagens.join(', ')}]`;

        const resultadoFinal = d20Roll + bonus;
        const sucesso = resultadoFinal >= dificuldade;

        let resultadoTexto, corEmbed;
        
        // --- Lógica de classificação dos resultados (1d20) ---
        if (d20Roll === 1) {
            resultadoTexto = "💥 **Desastre:** Um fracasso catastrófico, com consequências graves e inesperadas.";
            corEmbed = '#D92D43';
        } else if (d20Roll >= 2 && d20Roll <= 9) {
             if (sucesso) {
                 resultadoTexto = "⚠️ **Ruim:** Um sucesso com custos significativos.";
                 corEmbed = '#FFD700';
             } else {
                 resultadoTexto = "❌ **Ruim:** Um fracasso claro.";
                 corEmbed = '#ED4245';
             }
        } else if (d20Roll >= 10 && d20Roll <= 12) {
             if (sucesso) {
                resultadoTexto = "🟡 **Normal:** Um sucesso com pequenas imperfeições ou um resultado neutro.";
                corEmbed = '#FFA500';
             } else {
                resultadoTexto = "❌ **Falha!**";
                corEmbed = '#ED4245';
             }
        } else if (d20Roll >= 13 && d20Roll <= 19) {
             if (sucesso) {
                resultadoTexto = "✅ **Bom:** Um sucesso competente e eficaz na ação.";
                corEmbed = '#57F287';
             } else {
                resultadoTexto = "❌ **Falha!**";
                corEmbed = '#ED4245';
             }
        } else if (d20Roll === 20) {
            resultadoTexto = "🌟 **Crítico!** Um sucesso extraordinário, geralmente com efeitos adicionais poderosos.";
            corEmbed = '#FFD700';
        }

        const embed = new EmbedBuilder()
            .setColor(corEmbed)
            .setTitle(`Teste de Atributo: ${emojiMap[atributoDesejado]} ${atributoDesejado}`)
            .addFields(
                { name: `Sua Rolagem (${apelido})`, value: `Rolagem ${rollsTexto} + ${bonus} (bônus) = **${resultadoFinal}**`},
                { name: 'Dificuldade', value: `**${dificuldade}**` },
                { name: 'Resultado', value: resultadoTexto }
            )
            .setFooter({ text: 'A Classificação dos resultados é baseada na rolagem do 1d20.'});
            
        return message.reply({ embeds: [embed] });
    },
};