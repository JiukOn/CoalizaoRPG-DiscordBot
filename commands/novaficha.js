// commands/novaficha.js
const { iniciarCriacaoFicha } = require('../utils/criarficha');

module.exports = {
    name: 'novaficha',
    aliases: ['criaricha'],
    description: 'Inicia o processo interativo de criação de um novo personagem.',
    requiresRole: false, 
    
    execute(message, args) {
        return iniciarCriacaoFicha(message);
    },
};