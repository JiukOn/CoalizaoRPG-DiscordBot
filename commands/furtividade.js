// commands/furtividade.js
const { EmbedBuilder } = require('discord.js');
const { buscarFicha } = require('../utils/ficha');
const { rolarDados } = require('../utils/dice');
const { ATRIBUTOS_FURTIVIDADE, furtividadeTextos } = require('../config');

// Mapeamento de atributos de furtividade para atributos de detecção do inimigo
const atributoInimigoRecomendado = {
    DEX: 'PRE ou INT', // Furtividade (agilidade) é oposta por Precisão ou Inteligência
    PRE: 'PRE ou INT', // Precisão (observação) é oposta por Precisão ou Inteligência
    CRM: 'INT ou PRE'  // Carisma (mentira/disfarce) é oposto por Inteligência ou Precisão
};

module.exports = {
    name: 'furtividade',
    description: 'Realiza um teste de furtividade contra um oponente.',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const atributoJogador = args[0] ? args[0].toUpperCase() : null;
        const nomeInimigo = args[1];
        const bonusInimigo = parseInt(args[2]);
        const modificador = args[3] ? args[3].toLowerCase() : null;

        // Verifica a sintaxe do comando e fornece instrução clara
        if (!atributoJogador || !nomeInimigo || isNaN(bonusInimigo) || !ATRIBUTOS_FURTIVIDADE.includes(atributoJogador)) {
            const exemploAtributoInimigo = atributoInimigoRecomendado[atributoJogador] || 'PRE ou INT';
            return message.reply(`Uso: \`!furtividade <DEX/PRE/CRM> <nome_inimigo> <bônus_do_inimigo> [vantagem/desvantagem]\`\n\nQuando o mestre pedir um teste, use este comando. O bônus do inimigo deve ser o do atributo de **${exemploAtributoInimigo}**.`);
        }

        // Busca a ficha do jogador
        const fichaJogador = await buscarFicha(apelido);
        if (!fichaJogador) {
            // Mensagem de erro aprimorada com sugestão para o usuário
            return message.reply(`❌ Ficha do jogador **${apelido}** não encontrada. Se você for um novo jogador, use \`!novaficha\` para criar uma.`);
        }
        
        const bonusJogador = fichaJogador.bonus[atributoJogador];

        // Rolagem do jogador
        const { rolagens: rolagensJogador } = rolarDados(modificador ? 2 : 1, 20);
        let d20Jogador, rollsTextoJogador;

        if (modificador === 'vantagem') d20Jogador = Math.max(...rolagensJogador);
        else if (modificador === 'desvantagem') d20Jogador = Math.min(...rolagensJogador);
        else d20Jogador = rolagensJogador[0];
        rollsTextoJogador = `[${rolagensJogador.join(', ')}]`;

        const totalJogador = d20Jogador + bonusJogador;
        
        // Rolagem do inimigo (aqui a "dificuldade" é gerada)
        const { rolagens: rolagensInimigo } = rolarDados(1, 20);
        const d20Inimigo = rolagensInimigo[0];
        const totalInimigo = d20Inimigo + bonusInimigo;

        let resultadoTexto, corEmbed;
        let sucesso = totalJogador > totalInimigo;
        
        // Lógica de falha e sucesso
        if (d20Jogador === 1) {
            sucesso = false;
            resultadoTexto = "💥 **Desastre Pessoal!** Sua ação falha catastroficamente.";
            corEmbed = '#D92D43';
        } else if (d20Jogador === 20) {
            sucesso = true;
            resultadoTexto = "🌟 **Crítico!** Sua ação é perfeita.";
            corEmbed = '#FFD700';
        } else {
            if (sucesso) {
                resultadoTexto = "✅ **Sucesso!**";
                corEmbed = '#57F287';
            } else {
                resultadoTexto = "❌ **Falha!**";
                corEmbed = '#ED4245';
                if (d20Jogador >= 2 && d20Jogador <= 5) {
                    resultadoTexto += "\n**Ruim:** Você é percebido, mas pode tentar se justificar utilizando um teste de Carisma (CRM).";
                } else if (d20Jogador >= 6 && d20Jogador <= 9) {
                    resultadoTexto += "\n**Normal:** Você permanece oculto apenas parcialmente, resultando em ações limitadas.";
                }
            }
        }
        
        const textos = furtividadeTextos[atributoJogador];
        const embed = new EmbedBuilder()
            .setColor(corEmbed)
            .setTitle(`Contestação de Furtividade vs. ${nomeInimigo}`)
            .addFields(
                { name: `${textos.fieldName} (${apelido})`, value: `Rolagem ${rollsTextoJogador} + ${bonusJogador} (bônus) = **${totalJogador}**` },
                { name: `Rolagem de Detecção (${nomeInimigo})`, value: `Rolagem [${d20Inimigo}] + ${bonusInimigo} (bônus) = **${totalInimigo}**` },
                { name: 'Resultado', value: resultadoTexto }
            )
            .setFooter({ text: 'A furtividade pode ser influenciada por fatores de dificuldade como iluminação, terreno e número de guardas.' });

        return message.reply({ embeds: [embed] });
    },
};