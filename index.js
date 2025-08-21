require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { iniciarCriacaoFicha, sessoes } = require('./utils/criarficha.js');
const { PREFIX, REQUIRED_ROLE, MESTRE_ROLE } = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.name && typeof command.execute === 'function') {
        client.commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => client.commands.set(alias, command));
        }
    } else {
        console.warn(`[AVISO] O comando em ${filePath} está mal formatado e foi ignorado.`);
    }
}

client.once('ready', () => {
    console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (sessoes.has(message.author.id)) {
        const sessao = sessoes.get(message.author.id);
        return sessao.processarResposta(message);
    }

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const apelido = message.member?.nickname || message.author.username;
    const isMestre = message.member.roles.cache.some(role => role.name.toLowerCase() === MESTRE_ROLE.toLowerCase());

    const requiresRole = command.requiresRole ?? true;
    if (requiresRole && !message.member.roles.cache.some(role => role.name.toLowerCase() === REQUIRED_ROLE.toLowerCase())) {
        return message.reply(`❌ Você precisa ter o cargo **"${REQUIRED_ROLE}"** para usar esse comando.`);
    }

    try {
        await command.execute(message, args, { apelido, isMestre, client });
    } catch (error) {
        console.error(`Erro ao executar o comando ${commandName}:`, error);
        return message.reply('😕 Ocorreu um erro ao tentar executar esse comando.');
    }
});

client.login(process.env.DISCORD_TOKEN);