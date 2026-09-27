// ===================================
// APLICAÇÃO COMPLETA (ES6 MODULE)
// ===================================
import { carregarSheetData } from "../../website/sheets-to-website/sheetUtils.js";
import { autenticar } from "../../website/utils/autenticacao.js";

// Senha de acesso (juizquadra2026) — validada por hash SHA-256
const SENHA_HASH = "649a0e35deb7de81cb07a5401d37fe92addfe8540541b88f534e00b7bfa36812";

// ===================================
// DADOS REAIS (Google Sheets 2026)
// ===================================
// Aba de jogos/agenda: numeroJogo, juiz, horario, equipe... (2 linhas por jogo)
const SHEET_JOGOS_URL = "https://docs.google.com/spreadsheets/d/1SW3MyTRQzhMUCHjvXLhrdTijCCtq1yfgv6RAHdV9QYs/edit?gid=2032908800#gid=2032908800";
// Aba de equipes: Ordem, Equipe, Escola
const SHEET_EQUIPES_URL = "https://docs.google.com/spreadsheets/d/1SW3MyTRQzhMUCHjvXLhrdTijCCtq1yfgv6RAHdV9QYs/edit?gid=421523644#gid=421523644";

// Equipe de treino: aparece na agenda como adversário em jogos de treino.
// Deve ser exibida normalmente no frontend, mas NUNCA enviada ao Google Forms.
const EQUIPE_TREINO = "Equipe Treino";
// Normaliza nome (sem acento, espa\u00e7os colapsados, min\u00fasculo) para compara\u00e7\u00f5es
function normNome(nome) {
    return String(nome || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ').trim().toLowerCase();
}
function isEquipeTreino(nome) {
    return normNome(nome) === 'equipe treino';
}

async function carregarDados() {
    const [linhasJogos, linhasEquipes] = await Promise.all([
        carregarSheetData(SHEET_JOGOS_URL),
        carregarSheetData(SHEET_EQUIPES_URL)
    ]);

    // Equipes (coluna "Equipe") — nomes usados nos dropdowns de equipe
    const equipes = linhasEquipes
        .map(linha => String(linha.Equipe ?? linha.equipe ?? '').trim())
        .filter(Boolean);

    // "Equipe Treino" não está na aba de equipes, mas aparece como adversário
    // nos jogos de treino da agenda — precisa estar disponível nos dropdowns.
    if (!equipes.some(isEquipeTreino)) equipes.push(EQUIPE_TREINO);

    // Jogos: agrupar por numeroJogo (cada jogo tem 2 linhas, uma por equipe)
    const jogosMap = {};
    linhasJogos.forEach(linha => {
        const numero = String(linha.numeroJogo ?? '').trim();
        if (!numero) return;
        if (!jogosMap[numero]) {
            jogosMap[numero] = { numero, juiz: String(linha.juiz ?? '').trim(), equipes: [] };
        }
        const equipe = String(linha.equipe ?? '').trim();
        if (equipe) jogosMap[numero].equipes.push(equipe);
    });

    const jogos = Object.values(jogosMap).map(jogo => ({
        numero: jogo.numero,
        equipe1: jogo.equipes[0] || '',
        equipe2: jogo.equipes[1] || '',
        juiz: jogo.juiz
    }));

    // Juízes: valores únicos vindos da agenda
    const juizes = [...new Set(jogos.map(jogo => jogo.juiz).filter(Boolean))];

    return { juizes, equipes, jogos };
}

// ===================================
// CAMPO DE JOGO - POSIÇÕES DOS PILARES
// ===================================
const POSICOES_MURAL = [
    // N3 - Linha Superior (4 pontos cada)
    { id: 1, nivel: 'n3', x: '15%', y: '20%', pontos: 4, central: false },
    { id: 2, nivel: 'n3', x: '38%', y: '20%', pontos: 4, central: false },
    { id: 3, nivel: 'n3', x: '62%', y: '20%', pontos: 4, central: false },
    { id: 4, nivel: 'n3', x: '85%', y: '20%', pontos: 4, central: false },
    
    // N2 - Linha Média (3 pontos cada)
    { id: 5, nivel: 'n2', x: '26%', y: '45%', pontos: 3, central: false },
    { id: 6, nivel: 'n2', x: '50%', y: '45%', pontos: 3, central: true }, // PINO CENTRAL COOPERATIVO
    { id: 7, nivel: 'n2', x: '74%', y: '45%', pontos: 3, central: false },
    
    // N1 - Linha Inferior (2 pontos cada)
    { id: 8, nivel: 'n1', x: '15%', y: '70%', pontos: 2, central: false },
    { id: 9, nivel: 'n1', x: '38%', y: '70%', pontos: 2, central: false },
    { id: 10, nivel: 'n1', x: '62%', y: '70%', pontos: 2, central: false },
    { id: 11, nivel: 'n1', x: '85%', y: '70%', pontos: 2, central: false }
];

// Limite máximo de pilares que cada equipe pode pontuar
// (soma de pilares no mural + pilares no chão)
const MAX_PILARES_POR_EQUIPE = 11;

class CampoJogo {
    constructor(cor) {
        this.cor = cor;
        this.containerBotoes = document.getElementById(`botoes${cor === 'verde' ? 'Verde' : 'Azul'}`);
        this.botoesAtivos = new Map(); // Map<posicaoId, {estado, cor}>
        this.inicializar();
    }
    
    inicializar() {
        this.criarBotoes();
    }
    
    criarBotoes() {
        console.log(`🎮 Criando ${POSICOES_MURAL.length} botões PILAR para equipe ${this.cor}`);
        
        POSICOES_MURAL.forEach(posicao => {
            const botao = document.createElement('button');
            botao.className = 'btn-pilar';
            botao.dataset.posicao = posicao.id;
            botao.dataset.nivel = posicao.nivel;
            botao.dataset.pontos = posicao.pontos;
            botao.dataset.central = posicao.central;
            botao.dataset.estado = 'off'; // off | propria | oposta
            botao.dataset.corAtiva = '';
            
            botao.style.left = posicao.x;
            botao.style.top = posicao.y;
            botao.textContent = '+';
            
            // Título diferente para botão central
            if (posicao.central) {
                botao.title = `PINO CENTRAL (${posicao.pontos}pts) - Clique: OFF → Própria → Oposta → OFF`;
            } else {
                botao.title = `${posicao.nivel.toUpperCase()} (${posicao.pontos}pts) - Clique para toggle`;
            }
            
            // Event listener
            botao.addEventListener('click', () => this.toggleBotao(posicao.id, posicao.central));
            
            this.containerBotoes.appendChild(botao);
        });
        
        console.log(`✅ Botões PILAR criados para equipe ${this.cor}`);
    }
    
    toggleBotao(posicaoId, isCentral) {
        const botao = this.containerBotoes.querySelector(`[data-posicao="${posicaoId}"]`);
        if (!botao) return;
        
        if (isCentral) {
            this.toggleBotaoCentral(botao, posicaoId);
        } else {
            this.toggleBotaoNormal(botao, posicaoId);
        }
        
        // Disparar evento de atualização
        this.dispararEventoAtualizacao();
    }
    
    toggleBotaoNormal(botao, posicaoId) {
        const estadoAtual = botao.dataset.estado;
        
        if (estadoAtual === 'off') {
            // Verificar limite de pilares antes de ativar
            const totalPilares = this.botoesAtivos.size + (estado.equipes[this.cor]?.chaoNoMural || 0);
            if (totalPilares >= MAX_PILARES_POR_EQUIPE) {
                alert(`⚠️ Limite de ${MAX_PILARES_POR_EQUIPE} pilares atingido para esta equipe!`);
                return;
            }
            
            // OFF → ON (cor própria)
            botao.dataset.estado = 'propria';
            botao.dataset.corAtiva = this.cor;
            botao.textContent = '●';
            botao.classList.add('ativo', this.cor);
            this.botoesAtivos.set(posicaoId, { estado: 'propria', cor: this.cor });
            
        } else {
            // ON → OFF
            botao.dataset.estado = 'off';
            botao.dataset.corAtiva = '';
            botao.textContent = '+';
            botao.classList.remove('ativo', 'verde', 'azul');
            this.botoesAtivos.delete(posicaoId);
        }
    }
    
    toggleBotaoCentral(botao, posicaoId) {
        const estadoAtual = botao.dataset.estado;
        const corOposta = this.cor === 'verde' ? 'azul' : 'verde';
        
        if (estadoAtual === 'off') {
            // Verificar limite de pilares antes de ativar
            const totalPilares = this.botoesAtivos.size + (estado.equipes[this.cor]?.chaoNoMural || 0);
            if (totalPilares >= MAX_PILARES_POR_EQUIPE) {
                alert(`⚠️ Limite de ${MAX_PILARES_POR_EQUIPE} pilares atingido para esta equipe!`);
                return;
            }
            
            // OFF → Cor Própria
            botao.dataset.estado = 'propria';
            botao.dataset.corAtiva = this.cor;
            botao.textContent = '●';
            botao.classList.add('ativo', this.cor);
            botao.classList.remove('cooperacao');
            this.botoesAtivos.set(posicaoId, { estado: 'propria', cor: this.cor });
            
        } else if (estadoAtual === 'propria') {
            // Cor Própria → Cor Oposta (NETWORKING)
            botao.dataset.estado = 'oposta';
            botao.dataset.corAtiva = corOposta;
            botao.textContent = '◉';
            botao.classList.remove(this.cor);
            botao.classList.add('ativo', corOposta, 'cooperacao');
            this.botoesAtivos.set(posicaoId, { estado: 'oposta', cor: corOposta });
            
            // Verificar NETWORKING
            verificarNetworking();
            
        } else {
            // Cor Oposta → OFF
            botao.dataset.estado = 'off';
            botao.dataset.corAtiva = '';
            botao.textContent = '+';
            botao.classList.remove('ativo', 'verde', 'azul', 'cooperacao');
            this.botoesAtivos.delete(posicaoId);
            
            // Verificar NETWORKING novamente
            verificarNetworking();
        }
    }
    
    dispararEventoAtualizacao() {
        const evento = new CustomEvent('pilaresAlterados', {
            detail: {
                cor: this.cor,
                pontos: this.calcularPontosTotais()
            }
        });
        document.dispatchEvent(evento);
    }
    
    calcularPontosTotais() {
        let total = 0;
        this.botoesAtivos.forEach((info, posicaoId) => {
            const botao = this.containerBotoes.querySelector(`[data-posicao="${posicaoId}"]`);
            if (botao) {
                // Se for botão central, usar validação especial
                if (botao.dataset.central === 'true') {
                    total += this.calcularPontosBotaoCentral();
                } else {
                    total += parseInt(botao.dataset.pontos);
                }
            }
        });
        return total;
    }
    
    calcularPontosBotaoCentral() {
        const botaoCentral = this.getBotaoCentral();
        if (!botaoCentral || botaoCentral.dataset.estado === 'off') {
            return 0;
        }
        
        const corAtiva = botaoCentral.dataset.corAtiva;
        
        // Se cor própria: sempre vale 3pts individuais
        if (corAtiva === this.cor) {
            return 3;
        }
        
        // Se cor oposta: NUNCA conta como pontos individuais
        // (só vale se NETWORKING completo, mas aí vai para cooperação)
        return 0;
    }
    
    getBotaoCentral() {
        return this.containerBotoes.querySelector('[data-central="true"]');
    }
    
    getBotoesAtivos(nivel = null) {
        const botoes = [];
        this.botoesAtivos.forEach((info, posicaoId) => {
            const botao = this.containerBotoes.querySelector(`[data-posicao="${posicaoId}"]`);
            if (botao) {
                if (!nivel || botao.dataset.nivel === nivel) {
                    botoes.push({
                        posicao: posicaoId,
                        nivel: botao.dataset.nivel,
                        pontos: parseInt(botao.dataset.pontos),
                        estado: info.estado,
                        cor: info.cor
                    });
                }
            }
        });
        return botoes;
    }
    
    resetar() {
        // Resetar todos os botões
        const botoes = this.containerBotoes.querySelectorAll('.btn-pilar');
        botoes.forEach(botao => {
            botao.dataset.estado = 'off';
            botao.dataset.corAtiva = '';
            botao.textContent = '+';
            botao.classList.remove('ativo', 'verde', 'azul', 'cooperacao');
        });
        
        this.botoesAtivos.clear();
        this.dispararEventoAtualizacao();
    }
}

// ===================================
// ESTADO DA APLICAÇÃO
// ===================================
const estado = {
    juizSelecionado: null,
    jogoSelecionado: null,
    equipes: {
        verde: { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosCooperacao: 0, pontosTotal: 0 },
        azul: { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosCooperacao: 0, pontosTotal: 0 }
    },
    cooperacao: { coopetition: false, networking: false, integration: false }
};

const FORM_ENTRY_IDS = {
    juiz: 'entry.1046867752',
    jogoNumero: 'entry.595569872',
    equipe: 'entry.643198029',
    escalada: 'entry.725367882',
    chao: 'entry.525146271',
    total: 'entry.1341637456',
    coop: 'entry.1066153371',
    n1: 'entry.1072194625',
    n2: 'entry.1124041468',
    n3: 'entry.1818679083'
};

let campoVerde = null;
let campoAzul = null;

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    autenticar(SENHA_HASH, async () => {
        console.log('🚀 Iniciando aplicação...');

        try {
            const dados = await carregarDados();
            console.log('✅ Dados carregados:', dados);
            preencherDropdowns(dados);
            configurarEventListeners();
            console.log('✅ Aplicação inicializada com sucesso!');
        } catch (erro) {
            console.error('❌ Erro ao inicializar:', erro);
            mostrarMensagem('Erro ao carregar dados. Recarregue a página.', 'erro');
        }
    });
});

function preencherDropdowns(dados) {
    const selectJuiz = document.getElementById('selectJuiz');
    dados.juizes.forEach(juiz => {
        const option = document.createElement('option');
        option.value = juiz;
        option.textContent = juiz;
        selectJuiz.appendChild(option);
    });
    
    const selectJogo = document.getElementById('selectJogo');
    dados.jogos.forEach(jogo => {
        const option = document.createElement('option');
        option.value = jogo.numero;
        option.textContent = `N° ${jogo.numero}: ${jogo.equipe1} x ${jogo.equipe2}`;
        option.dataset.equipe1 = jogo.equipe1;
        option.dataset.equipe2 = jogo.equipe2;
        selectJogo.appendChild(option);
    });
    
    const selectEquipe1 = document.getElementById('selectEquipe1');
    const selectEquipe2 = document.getElementById('selectEquipe2');
    dados.equipes.forEach(equipe => {
        const option1 = document.createElement('option');
        option1.value = equipe;
        option1.textContent = equipe;
        selectEquipe1.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = equipe;
        option2.textContent = equipe;
        selectEquipe2.appendChild(option2);
    });
}

function configurarEventListeners() {
    campoVerde = new CampoJogo('verde');
    campoAzul = new CampoJogo('azul');
    
    // Desabilitar checkbox Integration no início
    atualizarEstadoCheckboxIntegration();
    
    // Novo evento: pilaresAlterados (substitui posicaoAlterada)
    document.addEventListener('pilaresAlterados', (event) => {
        const { cor, pontos } = event.detail;
        estado.equipes[cor].posicaoMural = pontos;
        verificarTodasCooperacoes();
    });
    
    document.getElementById('selectJogo').addEventListener('change', aoSelecionarJogo);
    document.getElementById('selectEquipe1').addEventListener('change', () => atualizarNomeEquipe('verde'));
    document.getElementById('selectEquipe2').addEventListener('change', () => atualizarNomeEquipe('azul'));
    
    document.getElementById('btnChaoMaisVerde').addEventListener('click', () => alterarChao('verde', 1));
    document.getElementById('btnChaoMenosVerde').addEventListener('click', () => alterarChao('verde', -1));
    document.getElementById('btnChaoMaisAzul').addEventListener('click', () => alterarChao('azul', 1));
    document.getElementById('btnChaoMenosAzul').addEventListener('click', () => alterarChao('azul', -1));
    
    document.getElementById('selectEscaladaVerde').addEventListener('change', () => {
        atualizarEscalada('verde');
        atualizarEstadoCheckboxIntegration();
        verificarTodasCooperacoes();
    });
    document.getElementById('selectEscaladaAzul').addEventListener('change', () => {
        atualizarEscalada('azul');
        atualizarEstadoCheckboxIntegration();
        verificarTodasCooperacoes();
    });
    
    document.getElementById('checkIntegration').addEventListener('change', verificarTodasCooperacoes);
    
    document.getElementById('btnFinalizarPartida').addEventListener('click', finalizarPartida);
}

// ===================================
// VERIFICAÇÕES AUTOMÁTICAS DE COOPERAÇÃO
// ===================================

function verificarCoopetition() {
    if (!campoVerde || !campoAzul) {
        return { ativo: false, posicoes: [false, false, false, false], pontos: 0 };
    }
    
    // Obter botões N1 ativos de ambas equipes
    const botoesN1Verde = campoVerde.getBotoesAtivos('n1');
    const botoesN1Azul = campoAzul.getBotoesAtivos('n1');
    
    const posicoesVerde = botoesN1Verde.map(b => b.posicao);
    const posicoesAzul = botoesN1Azul.map(b => b.posicao);
    
    // Posições N1: 8, 9, 10, 11 (4 posições)
    const posicoesN1 = [8, 9, 10, 11];
    const statusPosicoes = [];
    let pontosTotal = 0;
    
    posicoesN1.forEach(pos => {
        const ambosTemPilar = posicoesVerde.includes(pos) && posicoesAzul.includes(pos);
        statusPosicoes.push(ambosTemPilar);
        if (ambosTemPilar) {
            pontosTotal += 2; // 2 pontos por posição completada
        }
    });
    
    return {
        ativo: pontosTotal > 0,
        posicoes: statusPosicoes, // [pos8, pos9, pos10, pos11]
        pontos: pontosTotal // 0, 2, 4, 6 ou 8
    };
}

function verificarNetworking() {
    if (!campoVerde || !campoAzul) return false;
    
    const botaoCentralVerde = campoVerde.getBotaoCentral();
    const botaoCentralAzul = campoAzul.getBotaoCentral();
    
    if (!botaoCentralVerde || !botaoCentralAzul) return false;
    
    // Verifica se ambos têm cor oposta
    const verdeTemAzul = botaoCentralVerde.dataset.estado === 'oposta' && 
                         botaoCentralVerde.dataset.corAtiva === 'azul';
    const azulTemVerde = botaoCentralAzul.dataset.estado === 'oposta' && 
                         botaoCentralAzul.dataset.corAtiva === 'verde';
    
    return verdeTemAzul && azulTemVerde;
}

function verificarIntegration() {
    const checkbox = document.getElementById('checkIntegration');
    const verdeEscalou = estado.equipes.verde.escalada === 8;
    const azulEscalou = estado.equipes.azul.escalada === 8;
    
    // Só vale se AMBOS escalaram E checkbox marcado
    return checkbox.checked && verdeEscalou && azulEscalou;
}

function atualizarEstadoCheckboxIntegration() {
    const checkbox = document.getElementById('checkIntegration');
    const label = document.querySelector('label[for="checkIntegration"]');
    const container = checkbox.closest('.integration-check');
    
    const verdeEscalou = estado.equipes.verde.escalada === 8;
    const azulEscalou = estado.equipes.azul.escalada === 8;
    
    const podeMarcar = verdeEscalou && azulEscalou;
    
    // Habilitar/desabilitar checkbox
    checkbox.disabled = !podeMarcar;
    
    // Se não pode marcar e está marcado, desmarcar automaticamente
    if (!podeMarcar && checkbox.checked) {
        checkbox.checked = false;
        verificarTodasCooperacoes();
    }
    
    // Atualizar visual
    if (podeMarcar) {
        container.classList.remove('disabled');
        checkbox.title = 'Marque se ambos robôs estão no mesmo fluxo';
    } else {
        container.classList.add('disabled');
        checkbox.title = 'Ambas equipes devem ter escalado (8pts) para marcar Integration';
    }
}

function atualizarStatusCooperacao(tipo, ativo) {
    const statusElement = document.getElementById(`status${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (statusElement) {
        statusElement.textContent = ativo ? '✓' : '✗';
        statusElement.className = `coop-status ${ativo ? 'ativo' : 'inativo'}`;
    }
}

function atualizarStatusCoopetition(resultado) {
    // Atualizar os 4 quadrados das posições N1
    const posicoes = [8, 9, 10, 11];
    posicoes.forEach((pos, index) => {
        const element = document.getElementById(`coopPos${pos}`);
        if (element) {
            const ativo = resultado.posicoes[index];
            element.textContent = ativo ? '✓' : '✗';
            element.className = `coop-pos ${ativo ? 'ativo' : 'inativo'}`;
        }
    });
    
    // Atualizar pontos
    const ptsElement = document.getElementById('ptsCoopetition');
    if (ptsElement) {
        ptsElement.textContent = `${resultado.pontos} pts`;
    }
}

function verificarTodasCooperacoes() {
    // Verificar COOPETITION
    const coopetitionResultado = verificarCoopetition();
    estado.cooperacao.coopetition = coopetitionResultado.ativo;
    estado.cooperacao.coopetitionPontos = coopetitionResultado.pontos;
    atualizarStatusCoopetition(coopetitionResultado);
    
    // Verificar NETWORKING
    const networkingAtivo = verificarNetworking();
    estado.cooperacao.networking = networkingAtivo;
    estado.cooperacao.networkingPontos = networkingAtivo ? 6 : 0;
    atualizarStatusCooperacao('networking', networkingAtivo);
    
    // Atualizar pontos NETWORKING
    const ptsNetworking = document.getElementById('ptsNetworking');
    if (ptsNetworking) {
        ptsNetworking.textContent = `${estado.cooperacao.networkingPontos} pts`;
    }
    
    if (networkingAtivo && !estado.cooperacao.networkingMsgMostrada) {
        console.log('🤝 NETWORKING ativado automaticamente!');
        mostrarMensagem('NETWORKING ativado! +6pts cooperação', 'sucesso');
        estado.cooperacao.networkingMsgMostrada = true;
    } else if (!networkingAtivo) {
        estado.cooperacao.networkingMsgMostrada = false;
    }
    
    // Verificar INTEGRATION
    const integrationAtivo = verificarIntegration();
    estado.cooperacao.integration = integrationAtivo;
    estado.cooperacao.integrationPontos = integrationAtivo ? 4 : 0;
    atualizarStatusCooperacao('integration', integrationAtivo);
    
    // Atualizar pontos INTEGRATION
    const ptsIntegration = document.getElementById('ptsIntegration');
    if (ptsIntegration) {
        ptsIntegration.textContent = `${estado.cooperacao.integrationPontos} pts`;
    }
    
    // Calcular total de cooperação
    let totalCoop = 0;
    totalCoop += estado.cooperacao.coopetitionPontos || 0;
    totalCoop += estado.cooperacao.networkingPontos || 0;
    totalCoop += estado.cooperacao.integrationPontos || 0;
    
    document.getElementById('totalCooperacao').textContent = totalCoop;
    
    // Recalcular pontos
    calcularPontos();
}

// Seleciona no <select> a opção cujo valor bate com o nome (comparação
// normalizada: ignora acento/caixa/espaços extras). Evita que o auto-preenchimento
// do jogo falhe por diferença sutil entre o nome da agenda e a opção do dropdown.
function definirEquipeSelect(selectId, nome) {
    const select = document.getElementById(selectId);
    const alvo = normNome(nome);
    let valorEncontrado = '';
    for (const opt of select.options) {
        if (opt.value && normNome(opt.value) === alvo) {
            valorEncontrado = opt.value;
            break;
        }
    }
    select.value = valorEncontrado;
}

function aoSelecionarJogo(event) {
    const select = event.target;
    const option = select.options[select.selectedIndex];

    if (option.value) {
        const equipe1 = option.dataset.equipe1;
        const equipe2 = option.dataset.equipe2;

        definirEquipeSelect('selectEquipe1', equipe1);
        definirEquipeSelect('selectEquipe2', equipe2);

        atualizarNomeEquipe('verde');
        atualizarNomeEquipe('azul');
    }
}

function atualizarNomeEquipe(cor) {
    const selectId = cor === 'verde' ? 'selectEquipe1' : 'selectEquipe2';
    const select = document.getElementById(selectId);
    const nomeEquipe = select.value;
    const sufixo = cor === 'verde' ? 'Verde' : 'Azul';

    // Sempre atualiza a UI — inclusive quando vazio — para nunca manter o
    // nome de uma equipe de um jogo anterior (bug do "state antigo").
    const rotulo = nomeEquipe || `Equipe ${sufixo}`;
    estado.equipes[cor].nome = nomeEquipe || null;
    document.getElementById(`nomeEquipe${sufixo}`).textContent = rotulo;
    document.getElementById(`labelEscalada${sufixo}`).textContent = rotulo;
    document.getElementById(`placarNome${sufixo}`).textContent = rotulo;
}

function alterarChao(cor, delta) {
    const valorAtual = estado.equipes[cor].chaoNoMural;
    const novoValor = Math.max(0, valorAtual + delta);
    
    // Ao incrementar, verificar limite de pilares (mural + chão)
    const campo = cor === 'verde' ? campoVerde : campoAzul;
    const pilaresMural = campo ? campo.botoesAtivos.size : 0;
    if (delta > 0 && (pilaresMural + novoValor) > MAX_PILARES_POR_EQUIPE) {
        alert(`⚠️ Limite de ${MAX_PILARES_POR_EQUIPE} pilares atingido para esta equipe!`);
        return;
    }
    
    estado.equipes[cor].chaoNoMural = novoValor;
    const inputId = cor === 'verde' ? 'chaoValorVerde' : 'chaoValorAzul';
    document.getElementById(inputId).value = novoValor;
    calcularPontos();
}

function atualizarEscalada(cor) {
    const selectId = cor === 'verde' ? 'selectEscaladaVerde' : 'selectEscaladaAzul';
    const select = document.getElementById(selectId);
    const valor = parseInt(select.value);
    estado.equipes[cor].escalada = valor;
    calcularPontos();
}

function atualizarCooperacao() {
    estado.cooperacao.coopetition = document.getElementById('coopCoopetition').checked;
    estado.cooperacao.networking = document.getElementById('coopNetworking').checked;
    estado.cooperacao.integration = document.getElementById('coopIntegration').checked;
    
    let totalCoop = 0;
    if (estado.cooperacao.coopetition) totalCoop += 2;
    if (estado.cooperacao.networking) totalCoop += 6;
    if (estado.cooperacao.integration) totalCoop += 4;
    
    document.getElementById('totalCooperacao').textContent = totalCoop;
    calcularPontos();
}

function calcularPontos() {
    ['verde', 'azul'].forEach(cor => {
        const equipe = estado.equipes[cor];
        const campo = cor === 'verde' ? campoVerde : campoAzul;
        
        // Usar calcularPontosTotais() que soma todos os botões ativos
        const ptsCampo = campo ? campo.calcularPontosTotais() : 0;
        const ptsChao = equipe.chaoNoMural * 1;
        const ptsEscalada = equipe.escalada;
        
        // Usar pontos reais de cooperação (dinâmicos)
        const ptsCoop = (estado.cooperacao.coopetitionPontos || 0) + 
                        (estado.cooperacao.networkingPontos || 0) + 
                        (estado.cooperacao.integrationPontos || 0);
        
        const totalIndividual = ptsCampo + ptsChao + ptsEscalada;
        const totalFinal = totalIndividual + ptsCoop;
        
        equipe.pontosIndividuais = totalIndividual;
        equipe.pontosCooperacao = ptsCoop;
        equipe.pontosTotal = totalFinal;
        
        atualizarPontosUI(cor, ptsCampo, ptsChao, ptsEscalada, totalIndividual, totalFinal);
    });
}

function atualizarPontosUI(cor, ptsCampo, ptsChao, ptsEscalada, totalIndividual, totalFinal) {
    const sufixo = cor === 'verde' ? 'Verde' : 'Azul';
    
    document.getElementById(`ptsCampo${sufixo}`).textContent = ptsCampo;
    document.getElementById(`ptsChao${sufixo}`).textContent = ptsChao;
    document.getElementById(`ptsEscalada${sufixo}`).textContent = ptsEscalada;
    document.getElementById(`totalIndividual${sufixo}`).textContent = totalIndividual;
    
    const placarElement = document.getElementById(`placar${sufixo}`);
    placarElement.textContent = totalFinal.toString().padStart(2, '0');
    placarElement.classList.add('updating');
    setTimeout(() => placarElement.classList.remove('updating'), 500);
}

function obterPontuacaoPorNivel(campo, equipe) {
    if (!campo) {
        return { chao: Number(equipe?.chaoNoMural || 0), n1: 0, n2: 0, n3: 0 };
    }

    return {
        chao: Number(equipe?.chaoNoMural || 0),
        n1: campo.getBotoesAtivos('n1').reduce((total, botao) => total + Number(botao.pontos || 0), 0),
        n2: campo.getBotoesAtivos('n2').reduce((total, botao) => total + Number(botao.pontos || 0), 0),
        n3: campo.getBotoesAtivos('n3').reduce((total, botao) => total + Number(botao.pontos || 0), 0)
    };
}

function construirPayloadGoogleForms(equipe, juiz, jogoNumero, jogoTexto, campo) {
    const pontuacao = obterPontuacaoPorNivel(campo, equipe);
    const payload = [
        { key: FORM_ENTRY_IDS.juiz, label: 'Juiz', value: juiz },
        { key: FORM_ENTRY_IDS.jogoNumero, label: 'Número do Jogo', value: jogoNumero },
        { key: FORM_ENTRY_IDS.equipe, label: 'Equipe', value: equipe.nome },
        { key: FORM_ENTRY_IDS.escalada, label: 'Escalada', value: equipe.escalada },
        { key: FORM_ENTRY_IDS.chao, label: 'Chão no Mural', value: equipe.chaoNoMural },
        { key: FORM_ENTRY_IDS.total, label: 'Pontos Totais', value: equipe.pontosTotal },
        { key: FORM_ENTRY_IDS.coop, label: 'Pontos Cooperação', value: equipe.pontosCooperacao },
        { key: FORM_ENTRY_IDS.n1, label: 'N1 (um)', value: pontuacao.n1 },
        { key: FORM_ENTRY_IDS.n2, label: 'N2 (dois)', value: pontuacao.n2 },
        { key: FORM_ENTRY_IDS.n3, label: 'N3 (três)', value: pontuacao.n3 }
    ];

    return {
        equipeNome: equipe.nome,
        jogoTexto,
        payload
    };
}

function criarFormDataGoogleForms(payload) {
    const formData = new URLSearchParams();
    payload.forEach(field => {
        if (field.key) {
            formData.append(field.key, field.value);
        }
    });
    return formData;
}

function mostrarResumoEnvio(payloads) {
    const container = document.getElementById('formSubmissionSummary');
    const content = document.getElementById('formSubmissionSummaryContent');
    if (!container || !content) return;

    const html = payloads.map(({ cor, equipeNome, jogoTexto, payload }) => {
        const treino = isEquipeTreino(equipeNome);
        const linhas = payload.map(field => `
                <tr>
                    <td>${field.label}</td>
                    <td>${String(field.value)}</td>
                    <td><code>${field.key}</code></td>
                </tr>
            `).join('');

        return `
            <div class="mb-4">
                <h3 class="h6 mb-3">Equipe ${cor === 'verde' ? 'Verde' : 'Azul'} - ${equipeNome || 'Não definida'}${treino ? ' <span class="badge bg-warning text-dark">treino</span>' : ''}</h3>
                <p class="mb-2"><strong>Jogo:</strong> ${jogoTexto}</p>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered mb-0">
                        <thead>
                            <tr>
                                <th>Campo</th>
                                <th>Valor</th>
                                <th>Entry</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${linhas}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');

    content.innerHTML = html;
    container.style.display = 'block';
}

async function finalizarPartida() {
    const erros = validarPartida();
    
    if (erros.length > 0) {
        alert('Erros encontrados:\n' + erros.join('\n'));
        return;
    }
    
    const confirmar = confirm('Deseja finalizar a partida e enviar os resultados?');
    if (!confirmar) return;
    
    try {
        console.log('📤 Preparando dados para o Google Forms...');
        
        const juiz = document.getElementById('selectJuiz').value;
        const selectJogo = document.getElementById('selectJogo');
        const jogo = selectJogo.value;
        const jogoTexto = selectJogo.options[selectJogo.selectedIndex]?.textContent || jogo;

        const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScyTa5gnkymOJKRziR8cSqyYHkAZp2FYeMy0SOyl-8Fzy4__w/formResponse';
        const equipes = ['verde', 'azul'];

        const payloads = equipes.map(cor => {
            const campo = cor === 'verde' ? campoVerde : campoAzul;
            return {
                cor,
                ...construirPayloadGoogleForms(estado.equipes[cor], juiz, jogo, jogoTexto, campo)
            };
        });

        mostrarResumoEnvio(payloads);
        console.log('📄 Dados do formulário:', payloads);

        // Enviamos as DUAS equipes (inclusive a "Equipe Treino") para que o
        // cronograma reconheça o jogo como completo (ele exige 2 resultados).
        for (const { payload } of payloads) {
            const formData = criarFormDataGoogleForms(payload);
            await fetch(formUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });
        }
        
        alert('Partida finalizada e enviada para a nuvem com sucesso!');
        resetarFormulario();
        
    } catch (erro) {
        console.error('❌ Erro ao finalizar partida:', erro);
        alert('Erro ao enviar dados. Verifique a internet e tente novamente.');
    }
}

function validarPartida() {
    const erros = [];
    
    const juiz = document.getElementById('selectJuiz').value;
    const jogo = document.getElementById('selectJogo').value;
    const equipe1 = document.getElementById('selectEquipe1').value;
    const equipe2 = document.getElementById('selectEquipe2').value;
    
    if (!juiz) erros.push('Selecione um juiz');
    if (!jogo) erros.push('Selecione um jogo');
    if (!equipe1) erros.push('Selecione a Equipe 1');
    if (!equipe2) erros.push('Selecione a Equipe 2');
    if (equipe1 && equipe2 && equipe1 === equipe2) {
        erros.push('As equipes devem ser diferentes');
    }
    
    return erros;
}

function resetarFormulario() {
    document.getElementById('selectJuiz').value = '';
    document.getElementById('selectJogo').value = '';
    document.getElementById('selectEquipe1').value = '';
    document.getElementById('selectEquipe2').value = '';
    
    document.getElementById('chaoValorVerde').value = '0';
    document.getElementById('chaoValorAzul').value = '0';
    
    document.getElementById('selectEscaladaVerde').value = '0';
    document.getElementById('selectEscaladaAzul').value = '0';
    
    document.getElementById('checkIntegration').checked = false;
    
    if (campoVerde) campoVerde.resetar();
    if (campoAzul) campoAzul.resetar();
    
    const summary = document.getElementById('formSubmissionSummary');
    const summaryContent = document.getElementById('formSubmissionSummaryContent');
    if (summary) {
        summary.style.display = 'none';
    }
    if (summaryContent) {
        summaryContent.innerHTML = '';
    }
    
    estado.equipes.verde = { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosCooperacao: 0, pontosTotal: 0 };
    estado.equipes.azul = { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosCooperacao: 0, pontosTotal: 0 };
    estado.cooperacao = { 
        coopetition: false, 
        coopetitionPontos: 0,
        networking: false, 
        networkingPontos: 0,
        integration: false,
        integrationPontos: 0,
        networkingMsgMostrada: false 
    };
    
    // Resetar status visuais de cooperação
    atualizarStatusCoopetition({ ativo: false, posicoes: [false, false, false, false], pontos: 0 });
    atualizarStatusCooperacao('networking', false);
    atualizarStatusCooperacao('integration', false);
    
    // Resetar pontos exibidos
    document.getElementById('ptsCoopetition').textContent = '0 pts';
    document.getElementById('ptsNetworking').textContent = '0 pts';
    document.getElementById('ptsIntegration').textContent = '0 pts';
    document.getElementById('totalCooperacao').textContent = '0';
    
    // Resetar estado do checkbox Integration
    atualizarEstadoCheckboxIntegration();
    
    calcularPontos();
}

function mostrarMensagem(mensagem, tipo = 'info') {
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.textContent = mensagem;
    statusMsg.className = `text-center small mt-3 text-${tipo === 'erro' ? 'danger' : tipo === 'sucesso' ? 'success' : 'muted'}`;
    
    if (tipo !== 'info') {
        setTimeout(() => {
            statusMsg.textContent = '';
        }, 3000);
    }
}
