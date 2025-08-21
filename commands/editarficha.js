const { editarFicha } = require('../utils/ficha');
const { MESTRE_ROLE, ATRIBUTOS_VALIDOS } = require('../config');

module.exports = {
    name: 'editarficha',
    description: 'Edita um campo na sua ficha ou na ficha de um alvo (Mestre).',
    async execute(message, args) {
        const apelido = message.member?.nickname || message.author.username;
        const isMestre = message.member.roles.cache.some(role => role.name.toLowerCase() === MESTRE_ROLE.toLowerCase());
        let alvo, campo, valor;

        if (isMestre && args.length >= 3) {
            alvo = args.shift();
            campo = args.shift();
            valor = args.join(' ');
        } else {
            alvo = apelido;
            campo = args.shift();
            valor = args.join(' ');
        }

        if (!alvo || !campo || !valor) {
            let uso = 'Uso: `!editarficha <campo> <valor>`\n';
            uso += 'Mestres: `!editarficha <alvo> <campo> <valor>`';
            return message.reply(uso);
        }

        if (campo.toLowerCase() === 'atributo') {
            const attr = valor.split(' ')[0] ? valor.split(' ')[0].toUpperCase() : null;
            const attrValor = parseInt(valor.split(' ')[1]);
            if (!attr || isNaN(attrValor) || !ATRIBUTOS_VALIDOS.includes(attr)) {
                return message.reply('Uso: `... atributo <NOME> <valor>`');
            }
            const resultado = await editarFicha(alvo, attr, attrValor);
            if (resultado.sucesso) return message.reply(`✅ Atributo **${attr}** de **${alvo}** atualizado para **${attrValor}**.`);
            else return message.reply(`❌ **Erro:** ${resultado.erro}`);
        }

        const resultado = await editarFicha(alvo, campo, valor);
        if (resultado.sucesso) return message.reply(`✅ Campo **${resultado.campo}** de **${alvo}** atualizado para **"${resultado.valor}"**.`);
        else return message.reply(`❌ **Erro:** ${resultado.erro}`);
    },
};