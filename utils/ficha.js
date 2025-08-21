// utils/ficha.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const path = require('path');

// --- CONFIGURAÇÕES ---
const creds = require(path.join(__dirname, '../root/google.json'));
const SHEET_ID = '1fL-x5SYB30raidDkOP0k2Ukqx7ZYMQSSxoEXzQlR9Vo';

// --- AUTENTICAÇÃO ---
const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

// === FUNÇÕES DE SUPORTE ===
function colLetraToIndex(letra) {
  return letra.toUpperCase().charCodeAt(0) - 65;
}

function getCellValue(sheet, col, row) {
  const cell = sheet.getCell(row, colLetraToIndex(col));
  return cell?.value ?? null;
}

// === FUNÇÕES DE LEITURA DE FICHA ===
function buscarInfoBase(sheet) {
  return {
    nome: getCellValue(sheet, 'B', 0),
    nivel: getCellValue(sheet, 'E', 2),
    xp: getCellValue(sheet, 'E', 3),
    dinheiro: getCellValue(sheet, 'E', 4),
    idade: getCellValue(sheet, 'B', 2),
    especie: getCellValue(sheet, 'B', 3),
    personalidade: getCellValue(sheet, 'B', 4),
    classe: getCellValue(sheet, 'B', 16),
    guilda: getCellValue(sheet, 'E', 8),
    aura: getCellValue(sheet, 'B', 8),
  };
}

function buscarAtributos(sheet) {
  const col = 'F';
  const map = { VIT: 18, DEX: 19, CRM: 20, FRC: 21, INT: 22, RES: 23, PRE: 24, ENR: 25 };
  return Object.fromEntries(Object.entries(map).map(([k, r]) => [k, parseInt(getCellValue(sheet, col, r)) || 0]));
}

function buscarBonus(sheet) {
  const col = 'G';
  const map = { VIT: 18, DEX: 19, CRM: 20, FRC: 21, INT: 22, RES: 23, PRE: 24, ENR: 25 };
  return Object.fromEntries(Object.entries(map).map(([k, r]) => [k, parseInt(getCellValue(sheet, col, r)) || 0]));
}

function buscarDetalhes(sheet) {
  return {
    fraseDeEfeito: getCellValue(sheet, 'B', 6),
    historia: `${getCellValue(sheet, 'B', 10) || ''} ${getCellValue(sheet, 'B', 11) || ''}`.trim(),
    tendencia: getCellValue(sheet, 'B', 13),
    efeito: getCellValue(sheet, 'B', 14),
    observacao: getCellValue(sheet, 'B', 15),
  };
}

function buscarInventario(sheet) {
  const items = [];
  const invalid = ['?', 'N/A', '!'];
  for (let r = 28; r < 33; r++) {
    for (let c = 0; c < 14; c += 2) {
      const val = sheet.getCell(r, c).value;
      if (val && !invalid.includes(val.toString().trim())) {
        items.push(val.toString().trim());
      }
    }
  }
  return items;
}

function buscarEquipamento(sheet) {
  const equip = {};
  const slots = {
    'Cabeça': 3, 'Rosto': 4, 'Pescoço': 6, 'Corpo': 7,
    'Mão Direita': 10, 'Mão Esquerda': 11, 'Acessório das Mãos': 12,
    'Pernas': 14, 'Pés': 15
  };
  const invalid = ['?', 'N/A', '!'];
  for (const [slot, row] of Object.entries(slots)) {
    equip[slot] = {
      nome: getCellValue(sheet, 'K', row - 1) || 'N/A',
      atributo: getCellValue(sheet, 'L', row - 1) || 'N/A',
      caracteristica: getCellValue(sheet, 'M', row - 1) || 'N/A'
    };
    for (let key in equip[slot]) {
      const val = equip[slot][key];
      equip[slot][key] = invalid.includes(val?.toString().trim()) ? 'N/A' : val.toString().trim();
    }
  }
  return equip;
}

async function buscarFicha(apelido) {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[apelido.trim()];
    if (!sheet) throw new Error(`Aba "${apelido}" não encontrada.`);
    await sheet.loadCells('A1:N33');
    return {
      infoBase: buscarInfoBase(sheet),
      atributos: buscarAtributos(sheet),
      bonus: buscarBonus(sheet),
      detalhes: buscarDetalhes(sheet),
      inventario: buscarInventario(sheet),
      equipamento: buscarEquipamento(sheet),
    };
  } catch (err) {
    console.error('❌ Erro ao buscar ficha:', err.message);
    return null;
  }
}

module.exports = { buscarFicha };
