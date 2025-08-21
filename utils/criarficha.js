// utils/criarficha.js

const { EmbedBuilder } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const path = require('path');
const creds = require(path.join(__dirname, '../root/google.json'));
const { 
    COR_PRINCIPAL, 
    emojiMap,
    aurasData,
    aurasList,
    personalidadesData,
    personalidadesList,
    efeitosIniciaisData,
    efeitosList,
    classesIniciaisData,
    classesList,
    especiesIniciaisData,
    especiesList,
    especiesIniciaisMap
} = require('../config');
const { normalizeString, removeAuraPrefix } = require('./helpers.js');

const SHEET_ID = '1fL-x5SYB30raidDkOP0k2Ukqx7ZYMQSSxoEXzQlR9Vo';
const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

const auras = aurasList;
const personalidades = personalidadesList;
const efeitos = efeitosList;
const classesIniciais = classesList;
const especies = especiesList;

const atributoNomes = {
    VIT: 'Vitalidade', DEX: 'Destreza', CRM: 'Carisma', FRC: 'Força',
    INT: 'Inteligência', RES: 'Resiliência', PRE: 'Precisão', ENR: 'Energia'
};

const etapas = [
    { pergunta: 'Qual o **nome completo** do personagem?', chave: 'nome' },
    { pergunta: 'Idade do personagem? (Apenas números)', chave: 'idade', tipo: 'numero' },
    { 
        pergunta: `Escolha a espécie do seu personagem. Você pode escolher uma espécie da lista abaixo ou criar uma espécie híbrida no formato \`Especie1/Especie2\`.`,
        chave: 'especie', 
        lista: especies, 
        dados: especiesIniciaisData 
    },
    { pergunta: `Escolha sua classe inicial na lista abaixo:`, chave: 'classe', lista: classesIniciais, dados: classesIniciaisData },
    { pergunta: `Escolha uma personalidade da lista abaixo:`, chave: 'personalidade', lista: personalidades, dados: personalidadesData },
    { pergunta: `Escolha uma aura da lista. Você pode digitar o nome completo ou apenas a última palavra (ex: 'Caos' para 'Aura do Caos').`, chave: 'aura', lista: auras, dados: aurasData },
    { pergunta: `Escolha um efeito da lista (ou digite 'nenhum'):`, chave: 'efeito', lista: efeitos, dados: efeitosIniciaisData, opcional: true },
    { pergunta: 'Conte a sua **história** em 1 ou 2 frases. Use um ponto final (`.`) para separar as frases.', chave: 'historia' },
    { pergunta: 'Você tem 25 pontos para distribuir (máximo de 5 por atributo).', chave: 'atributos', subchave: 'VIT', tipo: 'numero', max: 5 },
    { pergunta: `Quantos pontos em **DEX (Destreza)**?`, chave: 'atributos', subchave: 'DEX', tipo: 'numero', max: 5 },
    { pergunta: `Quantos pontos em **CRM (Carisma)**?`, chave: 'atributos', subchave: 'CRM', tipo: 'numero', max: 5 },
    { pergunta: `Quantos pontos em **FRC (Força)**?`, chave: 'atributos', subchave: 'FRC', tipo: 'numero', max: 5 },
    { pergunta: `Quantos pontos em **INT (Inteligência)**?`, chave: 'atributos', subchave: 'INT', tipo: 'numero', max: 5 },
    { pergunta: `Quantos pontos em **RES (Resiliência)**?`, chave: 'atributos', subchave: 'RES', tipo: 'numero', max: 5 },
    { pergunta: `Quantos pontos em **PRE (Precisão)**?`, chave: 'atributos', subchave: 'PRE', tipo: 'numero', max: 5 },
    { pergunta: `E quantos pontos em **ENR (Energia)**?`, chave: 'atributos', subchave: 'ENR', tipo: 'numero', max: 5 },
];

class SessaoCriacaoFicha {
    constructor(channel, userId) {
        this.channel = channel;
        this.userId = userId;
        this.etapaAtual = 0;
        this.dados = { atributos: {} };
        this.pontosRestantes = 25;
    }

    async iniciar() {
        const embed = new EmbedBuilder()
            .setColor(COR_PRINCIPAL)
            .setTitle('📝 Iniciando Criação de Ficha')
            .setDescription(`Olá! Vamos criar a ficha do seu personagem. Digite ` + "`cancelar`" + ` a qualquer momento para abortar o processo.`);
        await this.channel.send({ embeds: [embed] });
        await this.enviarProximaPergunta();
    }

    async enviarProximaPergunta() {
        if (this.etapaAtual >= etapas.length) {
            await this.confirmar();
            return;
        }
        const prox = etapas[this.etapaAtual];
        
        switch (prox.chave) {
            case 'nome':
            case 'idade':
            case 'historia':
            case 'atributos': {
                const embed = new EmbedBuilder().setColor(COR_PRINCIPAL);
                if (prox.chave === 'atributos') {
                    const emoji = emojiMap[prox.subchave] ?? '';
                    const nomeCompleto = atributoNomes[prox.subchave] ?? prox.subchave;
                    embed.setTitle('💪 Distribuição de Atributos')
                         .setDescription(`${emoji} Quantos pontos em **${prox.subchave} (${nomeCompleto})**? (**${this.pontosRestantes}** restantes)`);
                } else {
                     embed.setTitle(`Etapa ${this.etapaAtual + 1}/${etapas.length}`).setDescription(prox.pergunta);
                }
                await this.channel.send({ embeds: [embed] });
                break;
            }

            case 'personalidade':
            case 'aura':
            case 'efeito':
            case 'classe':
            case 'especie': {
                const dados = prox.dados;
                
                // Envia a mensagem de pergunta separadamente para melhor legibilidade
                await this.channel.send({
                    embeds: [new EmbedBuilder().setTitle(`Etapa ${this.etapaAtual + 1}/${etapas.length}`).setDescription(prox.pergunta).setColor(COR_PRINCIPAL)]
                });

                let embedFields = [];
                let currentEmbed = new EmbedBuilder().setColor(COR_PRINCIPAL);
                let currentFieldCount = 0;

                dados.forEach(item => {
                    let name, value;
                    if (prox.chave === 'aura') {
                        name = `✨ ${item.nome}`;
                        value = item.descricao;
                    } else if (prox.chave === 'personalidade') {
                        name = `🎭 ${item.nome}`;
                        value = item.descricao;
                    } else if (prox.chave === 'efeito') {
                        name = `💫 ${item.nome}`;
                        value = item.descricao;
                    } else if (prox.chave === 'classe') {
                        name = `🎓 **${item.classe}**`;
                        value = `Habilidade Legado: ${item.habilidade_nome}\n${item.habilidade_descricao || ''}`;
                    } else if (prox.chave === 'especie') {
                        name = `🧬 **${item.nome}**`;
                        value = item.descricao;
                    }
                    
                    // Adiciona o campo se couber no embed atual
                    if (currentFieldCount < 25) { // Discord max fields per embed is 25
                        currentEmbed.addFields({ name, value, inline: false });
                        currentFieldCount++;
                    } else {
                        // Se o limite for atingido, envia o embed atual e começa um novo
                        embedFields.push(currentEmbed);
                        currentEmbed = new EmbedBuilder().setColor(COR_PRINCIPAL).addFields({ name, value, inline: false });
                        currentFieldCount = 1;
                    }
                });

                // Adiciona o último embed à lista
                if (currentFieldCount > 0) {
                    embedFields.push(currentEmbed);
                }

                // Envia todos os embeds
                for (const embedToSend of embedFields) {
                     await this.channel.send({ embeds: [embedToSend] });
                }

                if (prox.chave === 'efeito' && prox.opcional) {
                    await this.channel.send({ embeds: [new EmbedBuilder().setColor(COR_PRINCIPAL).setDescription('**Ou digite `nenhum` para não selecionar um efeito.**')] });
                }

                break;
            }

            default:
                await this.channel.send({ embeds: [new EmbedBuilder().setTitle(`Etapa ${this.etapaAtual + 1}/${etapas.length}`).setDescription(prox.pergunta).setColor(COR_PRINCIPAL)] });
                break;
        }

    }

    async processarResposta(message) {
        const conteudo = message.content.trim();

        if (conteudo.toLowerCase() === 'cancelar') {
            sessoes.delete(this.userId);
            return message.reply('Criação de ficha cancelada.');
        }

        if (this.etapaAtual >= etapas.length) return;

        const etapa = etapas[this.etapaAtual];

        if (etapa.tipo === 'numero') {
            const valor = parseInt(conteudo, 10);
            if (isNaN(valor)) return message.reply('❌ Por favor, insira um valor numérico válido.');

            if (etapa.chave === 'atributos') {
                const etapasAtributos = etapas.filter(e => e.chave === 'atributos');
                const indexAtualAtributo = etapasAtributos.findIndex(e => e.subchave === etapa.subchave);
                const numAtributosRestantes = etapasAtributos.length - 1 - indexAtualAtributo;

                const pontosMinimosNecessarios = numAtributosRestantes;
                const pontosMaximosPermitidos = this.pontosRestantes - pontosMinimosNecessarios;

                if (valor < 1 || valor > etapa.max || valor > pontosMaximosPermitidos) {
                    return message.reply(`❌ Valor inválido. O valor deve ser entre 1 e ${Math.min(etapa.max, pontosMaximosPermitidos)}, e você tem **${this.pontosRestantes}** pontos restantes. Você precisa deixar no mínimo 1 ponto para cada atributo restante.`);
                }

                this.dados.atributos[etapa.subchave] = valor;
                this.pontosRestantes -= valor;
            } else {
                if (valor < 1 || valor > 999) return message.reply('❌ A idade deve ser um número entre 1 e 999.');
                this.dados[etapa.chave] = valor;
            }

        } else if (etapa.lista) {
            const normalizedConteudo = normalizeString(conteudo);
            let opcaoEncontrada;

            if (etapa.chave === 'especie' && normalizedConteudo.includes('/')) {
                const [especie1, especie2] = normalizedConteudo.split('/').map(s => s.trim());
                
                const normalizedEspecie1 = normalizeString(especie1);
                const normalizedEspecie2 = normalizeString(especie2);

                const existeEspecie1 = especiesIniciaisMap.has(normalizedEspecie1);
                const existeEspecie2 = especiesIniciaisMap.has(normalizedEspecie2);

                if (existeEspecie1 && existeEspecie2) {
                    const especie1Capitalized = especie1.charAt(0).toUpperCase() + especie1.slice(1);
                    const especie2Capitalized = especie2.charAt(0).toUpperCase() + especie2.slice(1);
                    this.dados[etapa.chave] = `${especie1Capitalized}/${especie2Capitalized}`;
                } else {
                    return message.reply('❌ Uma ou ambas as espécies híbridas não foram encontradas. Por favor, digite o nome correto (ex: `Humano/Elfo`).');
                }
            } else {
                if (etapa.chave === 'aura') {
                    const normalizedConteudoSemPrefix = removeAuraPrefix(normalizedConteudo);
                    opcaoEncontrada = etapa.lista.find(item => {
                        const normalizedItem = normalizeString(item);
                        const normalizedItemSemPrefix = removeAuraPrefix(normalizedItem);
                        return normalizedItem === normalizedConteudo || normalizedItemSemPrefix === normalizedConteudoSemPrefix;
                    });
                } else {
                    opcaoEncontrada = etapa.lista.find(item => normalizeString(item) === normalizedConteudo);
                }

                if (etapa.opcional && normalizedConteudo === 'nenhum') {
                    this.dados[etapa.chave] = 'Nenhum';
                } else if (!opcaoEncontrada) {
                    return message.reply(`❌ Escolha uma das opções válidas.`);
                } else {
                    this.dados[etapa.chave] = opcaoEncontrada;
                }
            }
        } else if (etapa.chave === 'historia') {
            const frases = conteudo.split('.').filter(s => s.trim() !== '');
            if (frases.length === 0 || frases.length > 2) return message.reply('❌ Por favor, insira 1 ou 2 frases para a sua história, separadas por um ponto final (`.`).');
            this.dados.historia1 = frases[0].trim() || '';
            this.dados.historia2 = frases[1] ? frases[1].trim() : '';
        } else {
            this.dados[etapa.chave] = conteudo;
        }

        this.etapaAtual++;

        if (this.etapaAtual < etapas.length) {
            await this.enviarProximaPergunta();
        } else {
            if (this.pontosRestantes !== 0) {
                await this.channel.send(`⚠️ Atenção: Você deve distribuir exatamente 25 pontos. Você deixou **${this.pontosRestantes}** pontos restantes. Por favor, recomece a distribuição de atributos.`);
                this.etapaAtual = etapas.findIndex(e => e.chave === 'atributos');
                this.pontosRestantes = 25;
                this.dados.atributos = {};
                await this.enviarProximaPergunta();
            } else {
                await this.confirmar(message);
            }
        }
    }

    async confirmar(message) {
        const { nome, idade, especie, classe, personalidade, aura, efeito, historia1, historia2, atributos } = this.dados;

        const idadeTxt = idade ?? 'N/A';
        const especieTxt = especie ?? 'N/A';
        const classeTxt = classe ?? 'N/A';
        const personalidadeTxt = personalidade ?? 'N/A';
        const auraTxt = aura ?? 'N/A';
        const efeitoTxt = efeito ?? 'N/A';

        const embed = new EmbedBuilder()
            .setColor(COR_PRINCIPAL)
            .setTitle(`✅ Ficha Finalizada: ${nome ?? 'Sem nome'}`)
            .setDescription('Confirma os dados abaixo? Responda `sim` ou `não`.')
            .addFields(
                { name: 'Básicos', value: `Idade: ${idadeTxt}\nEspécie: ${especieTxt}\nClasse: ${classeTxt}\nPersonalidade: ${personalidadeTxt}\nAura: ${auraTxt}\nEfeito: ${efeitoTxt}` },
                { name: 'História', value: `${historia1 ?? ''} ${historia2 ?? ''}`.trim() || 'N/A' },
                { name: 'Atributos', value: Object.entries(atributos ?? {}).map(([k, v]) => `${k}: ${v}`).join(' | ') || 'N/A' }
            );

        await message.channel.send({ embeds: [embed] });

        const filter = m => m.author.id === this.userId && ['sim', 'não', 'nao'].includes(m.content.toLowerCase());
        try {
            const coletado = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const confirmacao = coletado.first().content.toLowerCase();

            if (confirmacao === 'sim') {
                const sucesso = await this.salvarFichaNaPlanilha();
                if (sucesso) {
                    await message.channel.send('✅ Ficha criada com sucesso!');
                } else {
                    await message.channel.send('❌ Ocorreu um erro ao salvar a ficha.');
                }
            } else {
                await message.channel.send('Criação de ficha cancelada.');
            }
        } catch {
            await message.channel.send('Tempo esgotado. Ficha cancelada.');
        } finally {
            sessoes.delete(this.userId);
        }
    }

    async salvarFichaNaPlanilha() {
        try {
            await doc.loadInfo();
            const modelo = doc.sheetsByTitle['Base'];
            if (!modelo) return false;

            const nomeCompleto = this.dados.nome ?? 'SemNome';
            let nomeParaAba = nomeCompleto.trim().replace(/[\\?*/\\:]/g, '');

            if (!nomeParaAba) {
                nomeParaAba = 'Ficha';
            }
            nomeParaAba = nomeParaAba.substring(0, 100);

            if (doc.sheetsByTitle[nomeParaAba]) {
                let contador = 1;
                let novoNomeParaAba = nomeParaAba;
                while (doc.sheetsByTitle[novoNomeParaAba]) {
                    contador++;
                    novoNomeParaAba = `${nomeParaAba.substring(0, 95)}-${contador}`;
                }
                nomeParaAba = novoNomeParaAba;
                console.log(`Aviso: Ficha com o nome '${nomeCompleto}' já existia, a nova ficha foi renomeada para '${novoNomeParaAba}'.`);
            }

            const novaFicha = await modelo.duplicate({ title: nomeParaAba });
            await novaFicha.loadCells('A1:F26');

            let auraNomeParaPlanilha = this.dados.aura;
            if (auraNomeParaPlanilha && auraNomeParaPlanilha !== 'Nenhum') {
                auraNomeParaPlanilha = removeAuraPrefix(auraNomeParaPlanilha);
            }

            const especieFinal = this.dados.especie ?? '';

            novaFicha.getCellByA1('B1').value = this.dados.nome ?? '';
            novaFicha.getCellByA1('B3').value = this.dados.idade ?? '';
            novaFicha.getCellByA1('B4').value = especieFinal; // Salvando o nome formatado da espécie
            novaFicha.getCellByA1('B5').value = this.dados.personalidade ?? '';
            novaFicha.getCellByA1('B9').value = auraNomeParaPlanilha ?? '';
            novaFicha.getCellByA1('B7').value = this.dados.efeito ?? '';
            novaFicha.getCellByA1('B11').value = this.dados.historia1 ?? '';
            novaFicha.getCellByA1('B12').value = this.dados.historia2 ?? '';
            novaFicha.getCellByA1('B17').value = this.dados.classe ?? '';

            const linhaBase = 18;
            const ordem = ['VIT', 'DEX', 'CRM', 'FRC', 'INT', 'RES', 'PRE', 'ENR'];

            ordem.forEach((key, i) => {
                novaFicha.getCell(linhaBase + i, 2).value = this.dados.atributos?.[key] ?? 0;
            });

            await novaFicha.saveUpdatedCells();
            return true;
        } catch (err) {
            console.error('Erro ao salvar ficha:', err.message || err);
            return false;
        }
    }
}

const sessoes = new Map();

function iniciarCriacaoFicha(message) {
    if (sessoes.has(message.author.id)) {
        return message.reply('Você já está criando uma ficha. Digite `cancelar` para recomeçar.');
    }
    const sessao = new SessaoCriacaoFicha(message.channel, message.author.id);
    sessoes.set(message.author.id, sessao);
    sessao.iniciar();
}

module.exports = { iniciarCriacaoFicha, sessoes };