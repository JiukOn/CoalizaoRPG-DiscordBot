// utils/dice.js

/**
 * Rola uma quantidade específica de um tipo de dado.
 * @param {number} quantidade - O número de dados a serem rolados.
 * @param {number} lados - O número de lados do dado (ex: 20 para um d20).
 * @returns {{soma: number, rolagens: number[], resultadoPrimeiroDado: string}}
 */
function rolarDados(quantidade, lados) {
    const rolagens = [];
    let soma = 0;

    for (let i = 0; i < quantidade; i++) {
        const roll = Math.floor(Math.random() * lados) + 1;
        rolagens.push(roll);
        soma += roll;
    }

    // Pega a classificação do primeiro dado para testes de Crítico/Desastre
    let resultadoPrimeiroDado = '';
    const primeiroRoll = rolagens[0];

    if (lados === 20) {
        if (primeiroRoll === 20) resultadoPrimeiroDado = 'Crítico!';
        else if (primeiroRoll >= 12) resultadoPrimeiroDado = 'Bom';
        else if (primeiroRoll >= 8) resultadoPrimeiroDado = 'Neutro';
        else if (primeiroRoll > 1) resultadoPrimeiroDado = 'Ruim';
        else resultadoPrimeiroDado = 'Desastre!';
    } else if (lados === 4) {
        resultadoPrimeiroDado = ['Pior', 'Ruim', 'Bom', 'Melhor'][primeiroRoll - 1];
    }
    
    return { soma, rolagens, resultadoPrimeiroDado };
}

module.exports = {
    rolarDados
};