// chaveamento.js
// Monta o chaveamento (bracket) das eliminatórias a partir de 3 planilhas:
//  - Alianças:   nome da aliança -> [Equipa A, Equipe B]
//  - Jogos:      agenda das eliminatórias (numeroJogo, alianca) — define os
//                confrontos das quartas (2 linhas por jogo, uma por aliança)
//  - Resultados: respostas do formulário (numeroJogo, nomeAlianca, ptsTotais)
//
// Estrutura fixa (8 alianças), conforme a planilha de agenda das eliminatórias:
//   Quartas:  60(esq-topo) 61(esq-baixo) 62(dir-topo) 63(dir-baixo)
//   Semis:    64 = vencedor(60) x vencedor(61)   |   65 = vencedor(62) x vencedor(63)
//   Final:    vencedor(64) x vencedor(65)  (melhor de 3: 69, 70, 71)
//   3º lugar: perdedor(64) x perdedor(65)  (melhor de 3: 66, 67, 68)
//
// O vencedor de um jogo é a aliança com maior ptsTotais naquele numeroJogo.
// Final e 3º lugar podem ser "melhor de N" (série) — conta as vitórias.

export function normKey(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s_]/g, '').toLowerCase();
}

export function coluna(obj, ...nomes) {
    for (const nome of nomes) {
        const alvo = normKey(nome);
        for (const k of Object.keys(obj || {})) {
            if (normKey(k) === alvo) return obj[k];
        }
    }
    return '';
}

// Números dos jogos por fase (ajuste aqui se a planilha mudar).
export const CHAVE_CONFIG = {
    quartas: ['60', '61', '62', '63'], // ordem: esq-topo, esq-baixo, dir-topo, dir-baixo
    semis: { esq: '64', dir: '65' },
    final: ['69', '70', '71'],         // melhor de N
    terceiro: ['66', '67', '68']       // melhor de N
};

export function construirChaveamento(aliancasRows, jogosRows, resultadosRows, cfg = CHAVE_CONFIG) {
    // Alianças: nome -> [Equipa A, Equipe B]
    const aliancas = {};
    (aliancasRows || []).forEach(l => {
        const nome = String(coluna(l, 'Alianca', 'Aliança')).trim();
        if (!nome) return;
        aliancas[nome] = [
            String(coluna(l, 'Equipa A', 'Equipe A')).trim(),
            String(coluna(l, 'Equipe B', 'Equipa B')).trim()
        ].filter(Boolean);
    });

    // Agenda dos jogos: numeroJogo -> [aliancaA, aliancaB]
    const jogoAgenda = {};
    (jogosRows || []).forEach(l => {
        const num = String(coluna(l, 'numeroJogo')).trim();
        if (!num) return;
        const ali = String(coluna(l, 'alianca', 'aliança')).trim();
        if (!jogoAgenda[num]) jogoAgenda[num] = [];
        if (ali) jogoAgenda[num].push(ali);
    });

    // Resultados: numeroJogo -> { nomeAlianca: ptsTotais }
    const resJogo = {};
    (resultadosRows || []).forEach(l => {
        const num = String(coluna(l, 'numeroJogo')).trim();
        const nome = String(coluna(l, 'nomeAlianca')).trim();
        if (!num || !nome) return;
        const pts = Number(coluna(l, 'ptsTotais')) || 0;
        if (!resJogo[num]) resJogo[num] = {};
        resJogo[num][nome] = pts; // último envio vence (mapa)
    });

    const times = nome => (nome && aliancas[nome]) ? aliancas[nome] : [];

    // Resultado de UM jogo entre dois participantes conhecidos
    function resultadoJogo(jogo, participantes) {
        const [a, b] = participantes || [];
        const mapa = resJogo[jogo] || {};
        const pa = (a && a in mapa) ? mapa[a] : null;
        const pb = (b && b in mapa) ? mapa[b] : null;
        let vencedor = null, perdedor = null, definido = false;
        if (pa != null && pb != null && pa !== pb) {
            definido = true;
            if (pa > pb) { vencedor = a; perdedor = b; }
            else { vencedor = b; perdedor = a; }
        }
        return { jogo, aliancas: [a || null, b || null], times: [times(a), times(b)], pa, pb, vencedor, perdedor, definido };
    }

    // Resultado de uma SÉRIE (melhor de N) entre dois participantes
    function resultadoSerie(jogos, participantes) {
        const [a, b] = participantes || [];
        let vitA = 0, vitB = 0;
        (jogos || []).forEach(j => {
            const r = resultadoJogo(j, participantes);
            if (r.definido) { if (r.vencedor === a) vitA++; else vitB++; }
        });
        const definido = (a && b) && (vitA + vitB > 0) && (vitA !== vitB);
        const vencedor = !definido ? null : (vitA > vitB ? a : b);
        const perdedor = !definido ? null : (vitA > vitB ? b : a);
        return { jogos, aliancas: [a || null, b || null], times: [times(a), times(b)], vitA, vitB, vencedor, perdedor, definido };
    }

    // Quartas (participantes vêm da agenda)
    const quartas = cfg.quartas.map(jogo => resultadoJogo(jogo, (jogoAgenda[jogo] || []).slice(0, 2)));
    const venc = quartas.map(q => q.vencedor);

    // Semis (participantes = vencedores das quartas)
    const semiEsq = resultadoJogo(cfg.semis.esq, [venc[0], venc[1]]);
    const semiDir = resultadoJogo(cfg.semis.dir, [venc[2], venc[3]]);

    // Final (vencedores das semis) e 3º lugar (perdedores das semis)
    const final = resultadoSerie(cfg.final, [semiEsq.vencedor, semiDir.vencedor]);
    const terceiro = resultadoSerie(cfg.terceiro, [semiEsq.perdedor, semiDir.perdedor]);

    return {
        aliancas,
        quartas,                       // [55, 56, 57, 58]
        semis: { esq: semiEsq, dir: semiDir },
        final,
        terceiro
    };
}
