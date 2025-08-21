// utils/helpers.js

/**
 * Normaliza uma string, removendo acentos e convertendo para minúsculas.
 * @param {string} str - A string a ser normalizada.
 * @returns {string} - A string normalizada.
 */
function normalizeString(str = '') {
    return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

/**
 * Remove os prefixos de aura de uma string.
 * @param {string} str - A string que pode conter um prefixo de aura.
 * @returns {string} - A string sem o prefixo, se houver.
 */
function removeAuraPrefix(str = '') {
    if (!str) return '';
    const lower = str.toLowerCase();
    const prefixes = ['aura do ', 'aura da ', 'aura do(a) '];
    for (const prefix of prefixes) {
        if (lower.startsWith(prefix)) {
            return str.substring(prefix.length);
        }
    }
    return str;
}

module.exports = {
    normalizeString,
    removeAuraPrefix
};