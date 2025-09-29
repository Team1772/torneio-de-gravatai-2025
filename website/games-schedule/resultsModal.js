// resultsModal.js
// Lógica para carregar e exibir resultados completos em modal reutilizando conceitos de qualificatorias
import { carregarSheetData } from "../sheets-to-website/sheetUtils.js";

let cacheResultados = null;
let cacheTimestamp = 0;
const CACHE_MS = 30 * 1000; // 30s
let matchesMap = {};

function normalizarChave(str) { return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase(); }
function getFlex(row, alvo) { const n = normalizarChave(alvo); for (const k of Object.keys(row)) { if (normalizarChave(k) === n) return row[k]; } }
function parseTimestamp(ts) { if (!ts) return 0; const m = ts.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/); if (!m) return 0; const [_, d, mo, y, h, mi, s] = m; return new Date(+y, +mo - 1, +d, +h, +mi, +(s || 0)).getTime(); }

function extrairPontuacoes(linha) {
    function num(v) { return Number(v || 0) || 0; }
    const pN1 = num(getFlex(linha, 'pontosN1') || linha['pontosN1']);
    const pN2 = num(getFlex(linha, 'pontosN2') || linha['pontosN2']);
    const pN3 = num(getFlex(linha, 'pontosN3') || linha['pontosN3']);
    const pMov = num(getFlex(linha, 'pontosMov') || linha['pontosMov']);
    const coop = num(getFlex(linha, 'Pontos de cooperação (equipe)') || linha['Pontos de cooperação (equipe)']);
    const totalSemCoop = pN1 + pN2 + pN3 + pMov; const total = totalSemCoop + coop;
    return { pN1, pN2, pN3, pMov, coop, totalSemCoop, total };
}

function agrupar(raw) {
    const jogos = {};
    raw.forEach(r => {
        const numero = (getFlex(r, 'Número de jogo') || getFlex(r, 'Numero de jogo') || r['Número de jogo'] || r['Numero de jogo'] || '').toString().trim();
        const equipe = getFlex(r, 'Equipe') || r['Equipe'];
        if (!numero || !equipe) return;
        const bucket = (jogos[numero] || (jogos[numero] = { numero, equipes: {} }));
        const equipeKey = equipe.trim();
        const ts = parseTimestamp(getFlex(r, 'Data e Hora') || r['Data e Hora']);
        const atual = bucket.equipes[equipeKey];
        if (!atual || ts >= (atual.__ts || 0)) {
            bucket.equipes[equipeKey] = { ...r, __ts: ts };
        }
    });
    return jogos;
}

function construirMatches(jogos) {
    const matches = {};
    Object.keys(jogos).forEach(num => {
        const nomes = Object.keys(jogos[num].equipes);
        if (nomes.length === 2) {
            const [e1, e2] = nomes;
            matches[num] = { numero: num, equipeA: jogos[num].equipes[e1], equipeB: jogos[num].equipes[e2] };
        }
    });
    return matches;
}

async function carregarResultados(url) {
    const agora = Date.now();
    if (cacheResultados && (agora - cacheTimestamp) < CACHE_MS) { return cacheResultados; }
    const linhas = await carregarSheetData(url);
    const jogos = agrupar(linhas);
    matchesMap = construirMatches(jogos);
    cacheResultados = matchesMap;
    cacheTimestamp = agora;
    return cacheResultados;
}

function criarMetricBox(label, val) {
    return `<div class="res-metric-box" aria-label="${label} ${val}"><span>${label}</span><strong data-valor-final="${val}">0</strong></div>`;
}

function renderMatch(match) {
    const nomeA = getFlex(match.equipeA, 'Equipe') || match.equipeA['Equipe'] || '(sem nome)';
    const nomeB = getFlex(match.equipeB, 'Equipe') || match.equipeB['Equipe'] || '(sem nome)';
    const pontA = extrairPontuacoes(match.equipeA);
    const pontB = extrairPontuacoes(match.equipeB);
    const winA = pontA.total > pontB.total;
    const winB = pontB.total > pontA.total;
    const cardA = `
    <div class="res-score-card red ${winA ? 'winner' : ''}">
      <div class="res-alliance-name">${nomeA}</div>
      <div class="res-score-big" data-valor-final="${pontA.total}">0</div>
      <div class="res-metrics-grid">
        ${criarMetricBox('N1', pontA.pN1)}
        ${criarMetricBox('N2', pontA.pN2)}
        ${criarMetricBox('N3', pontA.pN3)}
        ${criarMetricBox('Mov', pontA.pMov)}
      </div>
      <div class="res-coop-bar ${pontA.coop > 0 ? 'highlight' : ''}"><span>Cooperação</span><strong data-valor-final="${pontA.coop}">0</strong></div>
    </div>`;
    const cardB = `
    <div class="res-score-card blue ${winB ? 'winner' : ''}">
      <div class="res-alliance-name">${nomeB}</div>
      <div class="res-score-big" data-valor-final="${pontB.total}">0</div>
      <div class="res-metrics-grid">
        ${criarMetricBox('N1', pontB.pN1)}
        ${criarMetricBox('N2', pontB.pN2)}
        ${criarMetricBox('N3', pontB.pN3)}
        ${criarMetricBox('Mov', pontB.pMov)}
      </div>
      <div class="res-coop-bar ${pontB.coop > 0 ? 'highlight' : ''}"><span>Cooperação</span><strong data-valor-final="${pontB.coop}">0</strong></div>
    </div>`;
    return `<div class="resultado-cards">${cardA}${cardB}</div>`;
}

export async function abrirResultadoJogo(numero) {
    const modal = document.getElementById('resultadoModal');
    const tituloNum = document.getElementById('modalNumeroJogo');
    const conteudo = document.getElementById('modalConteudo');
    if (!modal) return;
    modal.style.display = 'block';
    requestAnimationFrame(() => modal.classList.add('mostrar'));
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    tituloNum.textContent = numero;
    conteudo.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        if (!matchesMap[numero]) {
            // força reload se match não está em cache
            await carregarResultados(configResultados.urlPlanilhaQuali);
        }
        const match = matchesMap[numero];
        if (!match) {
            conteudo.innerHTML = '<p style="padding:.5rem 0;">Resultado não encontrado.</p>';
            return;
        }
        conteudo.innerHTML = renderMatch(match);
        animarValores(conteudo);
    } catch (e) {
        conteudo.innerHTML = `<p style="color:#ffb3b3;">Erro ao carregar resultado: ${e}</p>`;
    }
}

// Fechamento global (caso a página deseje reaproveitar)
export function fecharResultadoJogo() {
    const modal = document.getElementById('resultadoModal');
    if (!modal) return;
    modal.classList.remove('mostrar');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

let configResultados = { urlPlanilhaQuali: '' };
export function inicializarResultadosSchedule(cfg) {
    configResultados = { ...configResultados, ...cfg };
    carregarResultados(configResultados.urlPlanilhaQuali).catch(() => { });
}

function animarValores(root) {
    const els = root.querySelectorAll('[data-valor-final]');
    els.forEach(el => {
        const final = Number(el.getAttribute('data-valor-final')) || 0;
        const dur = 700; const inicio = performance.now();
        function step(t) {
            const p = Math.min(1, (t - inicio) / dur); const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(final * eased);
            el.textContent = val;
            if (p < 1) requestAnimationFrame(step); else el.textContent = final;
        }
        requestAnimationFrame(step);
    });
}
