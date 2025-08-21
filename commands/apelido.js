const { buscarFicha } = require('../utils/ficha');

module.exports = {
    name: 'apelido',
    description: 'Muda seu apelido no servidor para o de um personagem.',
    async execute(message, args) {
        const novoApelido = args[0];
        if (!novoApelido) return message.reply('Uso: `!apelido <nome-do-personagem>`');
        
        const fichaExiste = await buscarFicha(novoApelido);
        if (!fichaExiste) {
            return message.reply(`❌ Não encontrei ficha com o nome "${novoApelido}". Verifique se o nome foi digitado corretamente ou use \`!novaficha\` para criar uma.`);
        }
        
        if (!message.member.manageable) return message.reply('😕 Não tenho permissão para alterar o seu apelido.');
        
        await message.member.setNickname(novoApelido);
        return message.reply(`✅ Seu apelido foi alterado para **${novoApelido}**!`);
    },
};