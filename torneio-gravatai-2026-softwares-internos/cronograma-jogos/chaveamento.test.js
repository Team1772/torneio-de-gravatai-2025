// chaveamento.test.js
// Teste do chaveamento. Rode com:  node chaveamento.test.js
import { construirChaveamento } from './chaveamento.js';

let passou = 0, falhou = 0;
function ok(cond, msg) {
    if (cond) { passou++; console.log(`  ✅ ${msg}`); }
    else { falhou++; console.error(`  ❌ ${msg}`); }
}

// Alianças 1..8, cada uma com 2 equipes
const aliancasRows = [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
    Alianca: `Aliança ${n}`, 'Equipa A': `Time ${2 * n - 1}`, 'Equipe B': `Time ${2 * n}`
}));

// Agenda das quartas (2 linhas por jogo)
function ag(numeroJogo, alianca) { return { numeroJogo: String(numeroJogo), alianca }; }
const jogosRows = [
    ag(55, 'Aliança 1'), ag(55, 'Aliança 8'),
    ag(56, 'Aliança 3'), ag(56, 'Aliança 6'),
    ag(57, 'Aliança 2'), ag(57, 'Aliança 7'),
    ag(58, 'Aliança 4'), ag(58, 'Aliança 5')
];

// Resultados (uma linha por aliança por jogo)
function res(numeroJogo, nomeAlianca, ptsTotais) { return { numeroJogo: String(numeroJogo), nomeAlianca, ptsTotais }; }
const resultadosRows = [
    // Quartas
    res(55, 'Aliança 1', 72), res(55, 'Aliança 8', 50),   // A1
    res(56, 'Aliança 3', 60), res(56, 'Aliança 6', 40),   // A3
    res(57, 'Aliança 2', 55), res(57, 'Aliança 7', 65),   // A7
    res(58, 'Aliança 4', 70), res(58, 'Aliança 5', 30),   // A4
    // Semis: 59 = A1 x A3, 60 = A7 x A4
    res(59, 'Aliança 1', 80), res(59, 'Aliança 3', 70),   // A1
    res(60, 'Aliança 7', 60), res(60, 'Aliança 4', 90),   // A4
    // Final (A1 x A4) melhor de 3 -> A4 vence 2x1 (ex.: 1x0, 1x1, 1x2)
    res(64, 'Aliança 1', 55), res(64, 'Aliança 4', 45),   // A1 vence jogo 1
    res(65, 'Aliança 1', 52), res(65, 'Aliança 4', 53),   // A4 vence jogo 2
    res(66, 'Aliança 1', 49), res(66, 'Aliança 4', 52),   // A4 vence jogo 3
    // 3º lugar (A3 x A7) melhor de 3 -> A3 vence 2x1
    res(61, 'Aliança 3', 50), res(61, 'Aliança 7', 40),
    res(62, 'Aliança 3', 48), res(62, 'Aliança 7', 49),
    res(63, 'Aliança 3', 55), res(63, 'Aliança 7', 50)
];

console.log('\n▶ Teste 1: quartas (1 jogo) — vencedor por ptsTotais');
{
    const c = construirChaveamento(aliancasRows, jogosRows, resultadosRows);
    ok(c.quartas[0].vencedor === 'Aliança 1', 'jogo 55: A1 (72) vence A8 (50)');
    ok(c.quartas[1].vencedor === 'Aliança 3', 'jogo 56: A3 vence A6');
    ok(c.quartas[2].vencedor === 'Aliança 7', 'jogo 57: A7 (65) vence A2 (55)');
    ok(c.quartas[3].vencedor === 'Aliança 4', 'jogo 58: A4 vence A5');
    ok(c.quartas[0].times[0].join('/') === 'Time 1/Time 2', 'A1 mostra suas equipes');
}

console.log('\n▶ Teste 2: semis (1 jogo) — participantes = vencedores das quartas');
{
    const c = construirChaveamento(aliancasRows, jogosRows, resultadosRows);
    ok(c.semis.esq.aliancas[0] === 'Aliança 1' && c.semis.esq.aliancas[1] === 'Aliança 3', 'semi esq = A1 x A3');
    ok(c.semis.dir.aliancas[0] === 'Aliança 7' && c.semis.dir.aliancas[1] === 'Aliança 4', 'semi dir = A7 x A4');
    ok(c.semis.esq.vencedor === 'Aliança 1', 'semi esq: A1 avança');
    ok(c.semis.dir.vencedor === 'Aliança 4', 'semi dir: A4 avança');
    ok(c.semis.esq.perdedor === 'Aliança 3' && c.semis.dir.perdedor === 'Aliança 7', 'perdedores: A3 e A7');
}

console.log('\n▶ Teste 3: final (melhor de 3) — conta vitórias por jogo');
{
    const c = construirChaveamento(aliancasRows, jogosRows, resultadosRows);
    ok(c.final.aliancas[0] === 'Aliança 1' && c.final.aliancas[1] === 'Aliança 4', 'final = A1 x A4');
    ok(c.final.vitA === 1 && c.final.vitB === 2, 'série 1x2 (A4 vence 2 dos 3 jogos)');
    ok(c.final.vencedor === 'Aliança 4', 'campeão: A4');
}

console.log('\n▶ Teste 4: 3º lugar (melhor de 3)');
{
    const c = construirChaveamento(aliancasRows, jogosRows, resultadosRows);
    ok(c.terceiro.aliancas[0] === 'Aliança 3' && c.terceiro.aliancas[1] === 'Aliança 7', '3º = A3 x A7');
    ok(c.terceiro.vencedor === 'Aliança 3' && c.terceiro.vitA === 2 && c.terceiro.vitB === 1, 'A3 vence 2x1');
}

console.log('\n▶ Teste 5: estados pendentes (sem resultados)');
{
    const c = construirChaveamento(aliancasRows, jogosRows, []);
    ok(c.quartas[0].vencedor === null && c.quartas[0].definido === false, 'quarta sem resultado: pendente');
    ok(c.quartas[0].aliancas[0] === 'Aliança 1' && c.quartas[0].aliancas[1] === 'Aliança 8', 'mas mostra os participantes da agenda');
    ok(c.semis.esq.aliancas[0] === null, 'semi sem quartas decididas: participante "A definir"');
    ok(c.final.vencedor === null, 'final sem dados: sem campeão');
}

console.log('\n▶ Teste 6: quarta com apenas 1 aliança enviada continua pendente');
{
    const parcial = [res(55, 'Aliança 1', 72)]; // só A1 enviou
    const c = construirChaveamento(aliancasRows, jogosRows, parcial);
    ok(c.quartas[0].definido === false && c.quartas[0].vencedor === null, 'precisa das 2 alianças para decidir');
    ok(c.quartas[0].pa === 72 && c.quartas[0].pb === null, 'mostra o que já foi enviado (A1=72, A8 pendente)');
}

console.log(`\n────────────────────────────`);
console.log(`Resultado: ${passou} passou, ${falhou} falhou`);
if (falhou > 0) process.exit(1);
