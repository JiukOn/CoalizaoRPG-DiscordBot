// config.js

// Importando arquivos de dados estáticos
const aurasData = require('./data/auras.json');
const personalidadesData = require('./data/personalidades.json');
const efeitosIniciaisData = require('./data/efeitosiniciais.json');
const classesIniciaisData = require('./data/classesiniciais.json');
const especiesIniciaisData = require('./data/especiesiniciais.json');
const todosOsItensData = require('./data/itens.json');

// Criando mapeamentos para acesso rápido aos dados
const aurasMap = new Map(aurasData.map(a => [a.nome.toLowerCase(), a]));
const personalidadesMap = new Map(personalidadesData.map(p => [p.nome.toLowerCase(), p]));
const efeitosIniciaisMap = new Map(efeitosIniciaisData.map(e => [e.nome.toLowerCase(), e]));
const classesIniciaisMap = new Map(classesIniciaisData.map(c => [c.classe.toLowerCase(), c]));
const especiesIniciaisMap = new Map(especiesIniciaisData.map(e => [e.nome.toLowerCase(), e]));
const todosOsItensMap = new Map(todosOsItensData.map(i => [i.id, i]));
const todosOsItensPorNomeMap = new Map(todosOsItensData.map(i => [i.nome.toLowerCase(), i]));


module.exports = {
    // --- Configurações Gerais ---
    PREFIX: '!',
    REQUIRED_ROLE: 'jogador',
    MESTRE_ROLE: 'mestre',
    COR_PRINCIPAL: '#6730e6',

    // --- Mapeamentos de Atributos e Emojis ---
    ATRIBUTOS_VALIDOS: ['VIT', 'DEX', 'CRM', 'FRC', 'INT', 'RES', 'PRE', 'ENR'],
    ATRIBUTOS_FURTIVIDADE: ['DEX', 'PRE', 'CRM'],
    ATRIBUTOS_INVESTIGACAO: ['INT', 'PRE', 'CRM', 'RES'],
    emojiMap: {
        VIT: '💪', DEX: '🎯', CRM: '💬', FRC: '🗡️',
        INT: '🧠', RES: '🛡️', PRE: '👁️', ENR: '⚡'
    },
    // NOVO: Mapeamento de abreviações para nomes completos
    atributoNomes: {
        VIT: 'Vitalidade', DEX: 'Destreza', CRM: 'Carisma', FRC: 'Força',
        INT: 'Inteligência', RES: 'Resiliência', PRE: 'Precisão', ENR: 'Energia'
    },

    // --- Configurações de Comandos ---
    // NOVO: Classificação unificada para rolagens de 1d20
    classificacaoD20: {
        desastre: { range: [1, 1], name: 'Desastre', color: '#D92D43', text: 'Um fracasso catastrófico, com consequências graves e inesperadas.' },
        ruim: { range: [2, 9], name: 'Ruim', color: '#f54f51ff', text: 'Um fracasso claro ou um sucesso com custos significativos.' },
        normal: { range: [10, 12], name: 'Normal', color: '#FFA500', text: 'Um sucesso com pequenas imperfeições ou um resultado neutro.' },
        bom: { range: [13, 19], name: 'Bom', color: '#57F287', text: 'Um sucesso competente e eficaz na ação.' },
        critico: { range: [20, 20], name: 'Crítico', color: '#bb83fcff', text: 'Um sucesso extraordinário, geralmente com efeitos adicionais poderosos.' }
    },

    // NOVO: Classificação para rolagens de 1d4
    classificacao1d4: {
        1: 'Pior', 2: 'Ruim', 3: 'Bom', 4: 'Melhor'
    },

    // NOVO: Tabela de dificuldades para investigação
    dificuldadeInvestigacao: {
        8: 'Muito Fácil', 12: 'Comum', 16: 'Complexa', 18: 'Oculta/Proibida'
    },
    
    // NOVO: Mapeamento de atributos para testes contestados de furtividade
    furtividadeContest: {
        DEX: 'PRE ou INT', PRE: 'PRE ou INT', CRM: 'INT ou PRE'
    },
    
    // --- Dados do Jogo Pré-carregados ---
    aurasData: aurasData,
    personalidadesData: personalidadesData,
    efeitosIniciaisData: efeitosIniciaisData,
    classesIniciaisData: classesIniciaisData,
    especiesIniciaisData: especiesIniciaisData,
    todosOsItensData: todosOsItensData,

    // Mapeamentos para busca rápida
    aurasMap: aurasMap,
    personalidadesMap: personalidadesMap,
    efeitosIniciaisMap: efeitosIniciaisMap,
    classesIniciaisMap: classesIniciaisMap,
    especiesIniciaisMap: especiesIniciaisMap,
    todosOsItensMap: todosOsItensMap,
    todosOsItensPorNomeMap: todosOsItensPorNomeMap,
    
    // Listas de nomes para criação de ficha
    aurasList: aurasData.map(a => a.nome),
    personalidadesList: personalidadesData.map(p => p.nome),
    efeitosList: efeitosIniciaisData.map(e => e.nome),
    classesList: classesIniciaisData.map(c => c.classe),
    especiesList: especiesIniciaisData.map(e => e.nome),
};