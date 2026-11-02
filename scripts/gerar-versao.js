// Grava em src/config/versao.ts o hash do commit atual (git).
// Uso: npm run versao
// A tela "Sobre o app" exibe esse hash para provar qual código gerou o APK publicado.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const hash = execSync('git rev-parse --short HEAD').toString().trim();
const completo = execSync('git rev-parse HEAD').toString().trim();

const destino = path.join(__dirname, '..', 'src', 'config', 'versao.ts');
const conteudo =
`// ARQUIVO GERADO por scripts/gerar-versao.js (npm run versao). Não edite à mão.
export const COMMIT_HASH = '${hash}';
export const COMMIT_HASH_COMPLETO = '${completo}';
`;

fs.writeFileSync(destino, conteudo);
console.log(`Hash do commit de referência gravado: ${hash}`);
