// ===================================
// APLICAÇÃO COMPLETA - SEM MÓDULOS ES6
// ELIMINATÓRIAS - PONTOS DA ALIANÇA
// ===================================

// carregarDadosMock é definido em elim-mock-data.js
// (importado antes deste arquivo no index.html)

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
    aliancaSelecionada: null, // Nome da aliança avaliada (ex: "Aliança1")
    equipes: {
        verde: { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosTotal: 0 },
        azul: { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosTotal: 0 }
    },
    cooperacao: { 
        coopetition: false, 
        coopetitionPontos: 0,
        networking: false, 
        networkingPontos: 0,
        integration: false,
        integrationPontos: 0,
        networkingMsgMostrada: false 
    },
    // Pontos da aliança (cálculo agregado)
    pontosAlianca: {
        individuaisVerde: 0,
        individuaisAzul: 0,
        cooperacao: 0,
        total: 0
    }
};

const FORM_ENTRY_IDS = {
    juiz: 'entry.1046867752',
    jogoNumero: 'entry.595569872',
    alianca: 'entry.0000000000', // PLACEHOLDER: preencher com o entry real do form de eliminatórias
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
let dadosMock = null; // Dados carregados do elim-mock-data.js

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicação de Eliminatórias...');
    
    try {
        dadosMock = await carregarDadosMock();
        console.log('✅ Dados carregados:', dadosMock);
        preencherDropdowns(dadosMock);
        configurarEventListeners();
        console.log('✅ Aplicação inicializada com sucesso!');
    } catch (erro) {
        console.error('❌ Erro ao inicializar:', erro);
        mostrarMensagem('Erro ao carregar dados. Recarregue a página.', 'erro');
    }
});

function preencherDropdowns(dados) {
    // Juízes
    const selectJuiz = document.getElementById('selectJuiz');
    dados.juizes.forEach(juiz => {
        const option = document.createElement('option');
        option.value = juiz;
        option.textContent = juiz;
        selectJuiz.appendChild(option);
    });
    
    // Jogos (confrontos entre alianças)
    const selectJogo = document.getElementById('selectJogo');
    dados.jogos.forEach(jogo => {
        const option = document.createElement('option');
        option.value = jogo.numero;
        option.textContent = `N° ${jogo.numero}: ${jogo.alianca1} x ${jogo.alianca2}`;
        option.dataset.alianca1 = jogo.alianca1;
        option.dataset.alianca2 = jogo.alianca2;
        selectJogo.appendChild(option);
    });
}

function configurarEventListeners() {
    campoVerde = new CampoJogo('verde');
    campoAzul = new CampoJogo('azul');
    
    // Desabilitar checkbox Integration no início
    atualizarEstadoCheckboxIntegration();
    
    // Evento: pilaresAlterados
    document.addEventListener('pilaresAlterados', (event) => {
        const { cor, pontos } = event.detail;
        estado.equipes[cor].posicaoMural = pontos;
        verificarTodasCooperacoes();
    });
    
    document.getElementById('selectJogo').addEventListener('change', aoSelecionarJogo);
    document.getElementById('selectAlianca').addEventListener('change', aoSelecionarAlianca);
    
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
// SELEÇÃO DE JOGO E ALIANÇA
// ===================================
function aoSelecionarJogo(event) {
    const select = event.target;
    const option = select.options[select.selectedIndex];
    
    if (option.value) {
        const alianca1 = option.dataset.alianca1;
        const alianca2 = option.dataset.alianca2;
        
        // Popular dropdown de aliança SOMENTE com as 2 alianças do jogo
        const selectAlianca = document.getElementById('selectAlianca');
        selectAlianca.innerHTML = '';
        
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Selecione a aliança';
        selectAlianca.appendChild(placeholder);
        
        [alianca1, alianca2].forEach(alianca => {
            const opt = document.createElement('option');
            opt.value = alianca;
            opt.textContent = alianca;
            selectAlianca.appendChild(opt);
        });
        
        // Limpar seleção de aliança
        estado.aliancaSelecionada = null;
        limparEquipesDaAlianca();
        
        mostrarMensagem(`Jogo ${option.value}: ${alianca1} x ${alianca2}. Selecione a aliança a avaliar.`, 'sucesso');
    }
}

function aoSelecionarAlianca(event) {
    const alianca = event.target.value;
    
    if (alianca) {
        estado.aliancaSelecionada = alianca;
        
        const equipes = dadosMock.aliancas[alianca];
        if (equipes && equipes.length === 2) {
            // Preencher automaticamente as 2 equipes da aliança
            const selectEquipe1 = document.getElementById('selectEquipe1');
            const selectEquipe2 = document.getElementById('selectEquipe2');
            
            // Limpar e popular com as equipes da aliança
            selectEquipe1.innerHTML = '';
            selectEquipe2.innerHTML = '';
            
            selectEquipe1.appendChild(new Option(equipes[0], equipes[0]));
            selectEquipe2.appendChild(new Option(equipes[1], equipes[1]));
            
            selectEquipe1.value = equipes[0];
            selectEquipe2.value = equipes[1];
            
            atualizarNomeEquipe('verde');
            atualizarNomeEquipe('azul');
            atualizarNomeAlianca(alianca);
            
            mostrarMensagem(`Avaliando ${alianca}: ${equipes[0]} + ${equipes[1]}`, 'sucesso');
        }
    } else {
        estado.aliancaSelecionada = null;
        limparEquipesDaAlianca();
    }
}

function limparEquipesDaAlianca() {
    const selectEquipe1 = document.getElementById('selectEquipe1');
    const selectEquipe2 = document.getElementById('selectEquipe2');
    
    selectEquipe1.innerHTML = '';
    selectEquipe2.innerHTML = '';
    
    const placeholder1 = document.createElement('option');
    placeholder1.value = '';
    placeholder1.textContent = 'Selecione a equipe';
    selectEquipe1.appendChild(placeholder1);
    
    const placeholder2 = document.createElement('option');
    placeholder2.value = '';
    placeholder2.textContent = 'Selecione a equipe';
    selectEquipe2.appendChild(placeholder2);
    
    estado.equipes.verde.nome = null;
    estado.equipes.azul.nome = null;
    
    // Resetar UI de nomes
    document.getElementById('nomeEquipeVerde').textContent = 'Equipe 1 (Verde)';
    document.getElementById('nomeEquipeAzul').textContent = 'Equipe 2 (Azul)';
    document.getElementById('labelEscaladaVerde').textContent = 'Equipe 1 (Verde)';
    document.getElementById('labelEscaladaAzul').textContent = 'Equipe 2 (Azul)';
    document.getElementById('placarNomeAlianca').textContent = 'Aliança';
}

function atualizarNomeAlianca(alianca) {
    document.getElementById('placarNomeAlianca').textContent = alianca;
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
    
    // Calcular total de cooperação (UMA ÚNICA VEZ - não duplicar)
    let totalCoop = 0;
    totalCoop += estado.cooperacao.coopetitionPontos || 0;
    totalCoop += estado.cooperacao.networkingPontos || 0;
    totalCoop += estado.cooperacao.integrationPontos || 0;
    
    document.getElementById('totalCooperacao').textContent = totalCoop;
    
    // Recalcular pontos
    calcularPontos();
}

// ===================================
// ATUALIZAÇÃO DE EQUIPES
// ===================================
function atualizarNomeEquipe(cor) {
    const selectId = cor === 'verde' ? 'selectEquipe1' : 'selectEquipe2';
    const select = document.getElementById(selectId);
    const nomeEquipe = select.value;
    
    if (nomeEquipe) {
        estado.equipes[cor].nome = nomeEquipe;
        document.getElementById(`nomeEquipe${cor === 'verde' ? 'Verde' : 'Azul'}`).textContent = nomeEquipe;
        document.getElementById(`labelEscalada${cor === 'verde' ? 'Verde' : 'Azul'}`).textContent = nomeEquipe;
    }
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

// ===================================
// CÁLCULO DE PONTOS
// ===================================
function calcularPontos() {
    let totalCoop = (estado.cooperacao.coopetitionPontos || 0) + 
                    (estado.cooperacao.networkingPontos || 0) + 
                    (estado.cooperacao.integrationPontos || 0);
    
    // Pontos individuais de cada equipe
    ['verde', 'azul'].forEach(cor => {
        const equipe = estado.equipes[cor];
        const campo = cor === 'verde' ? campoVerde : campoAzul;
        
        const ptsCampo = campo ? campo.calcularPontosTotais() : 0;
        const ptsChao = equipe.chaoNoMural * 1;
        const ptsEscalada = equipe.escalada;
        
        const totalIndividual = ptsCampo + ptsChao + ptsEscalada;
        equipe.pontosIndividuais = totalIndividual;
        
        atualizarPontosUI(cor, ptsCampo, ptsChao, ptsEscalada, totalIndividual);
    });
    
    // ==========================================
    // PONTOS DA ALIANÇA (cálculo agregado)
    // individuais somados + cooperação UMA VEZ
    // ==========================================
    const ptsVerde = estado.equipes.verde.pontosIndividuais;
    const ptsAzul = estado.equipes.azul.pontosIndividuais;
    
    estado.pontosAlianca.individuaisVerde = ptsVerde;
    estado.pontosAlianca.individuaisAzul = ptsAzul;
    estado.pontosAlianca.cooperacao = totalCoop;
    estado.pontosAlianca.total = ptsVerde + ptsAzul + totalCoop;
    
    atualizarPlacarAlianca();
}

function atualizarPontosUI(cor, ptsCampo, ptsChao, ptsEscalada, totalIndividual) {
    const sufixo = cor === 'verde' ? 'Verde' : 'Azul';
    
    document.getElementById(`ptsCampo${sufixo}`).textContent = ptsCampo;
    document.getElementById(`ptsChao${sufixo}`).textContent = ptsChao;
    document.getElementById(`ptsEscalada${sufixo}`).textContent = ptsEscalada;
    document.getElementById(`totalIndividual${sufixo}`).textContent = totalIndividual;
}

function atualizarPlacarAlianca() {
    const total = estado.pontosAlianca.total;
    
    const placarElement = document.getElementById('placarAlianca');
    placarElement.textContent = total.toString().padStart(2, '0');
    placarElement.classList.add('updating');
    setTimeout(() => placarElement.classList.remove('updating'), 500);
    
    // Nome da aliança
    const alianca = estado.aliancaSelecionada || 'Aliança';
    document.getElementById('placarNomeAlianca').textContent = alianca;
    
    // Composição: equipes da aliança
    const nomeEq1 = estado.equipes.verde.nome || 'Eq1';
    const nomeEq2 = estado.equipes.azul.nome || 'Eq2';
    document.getElementById('placarEquipe1').textContent = `${nomeEq1}: ${estado.pontosAlianca.individuaisVerde}`;
    document.getElementById('placarEquipe2').textContent = `${nomeEq2}: ${estado.pontosAlianca.individuaisAzul}`;
    
    // Badges de detalhe
    document.getElementById('badgeTotalVerde').textContent = `Eq1: ${estado.pontosAlianca.individuaisVerde}pts`;
    document.getElementById('badgeTotalAzul').textContent = `Eq2: ${estado.pontosAlianca.individuaisAzul}pts`;
    document.getElementById('badgeCoop').textContent = `Coop: ${estado.pontosAlianca.cooperacao}pts`;
}

// ===================================
// FINALIZAR PARTIDA (PLACEHOLDER)
// ===================================
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

function construirPayloadGoogleForms(equipe, juiz, jogoNumero, jogoTexto, campo, alianca) {
    const pontuacao = obterPontuacaoPorNivel(campo, equipe);
    const payload = [
        { key: FORM_ENTRY_IDS.juiz, label: 'Juiz', value: juiz },
        { key: FORM_ENTRY_IDS.jogoNumero, label: 'Número do Jogo', value: jogoNumero },
        { key: FORM_ENTRY_IDS.alianca, label: 'Aliança', value: alianca },
        { key: FORM_ENTRY_IDS.equipe, label: 'Equipe', value: equipe.nome },
        { key: FORM_ENTRY_IDS.escalada, label: 'Escalada', value: equipe.escalada },
        { key: FORM_ENTRY_IDS.chao, label: 'Chão no Mural', value: equipe.chaoNoMural },
        { key: FORM_ENTRY_IDS.total, label: 'Pontos Individuais', value: equipe.pontosIndividuais },
        { key: FORM_ENTRY_IDS.coop, label: 'Pontos Cooperação (Aliança)', value: estado.pontosAlianca.cooperacao },
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

    // Adicionar resumo da aliança no topo
    const resumoAlianca = `
        <div class="mb-4 p-3 bg-light rounded">
            <h3 class="h6 mb-2"><strong>ALIANÇA: ${estado.aliancaSelecionada || 'Não definida'}</strong></h3>
            <p class="mb-1">
                Individuais Eq1: <strong>${estado.pontosAlianca.individuaisVerde}pts</strong> + 
                Individuais Eq2: <strong>${estado.pontosAlianca.individuaisAzul}pts</strong> + 
                Cooperação: <strong>${estado.pontosAlianca.cooperacao}pts</strong>
            </p>
            <p class="mb-0 fs-5"><strong>TOTAL DA ALIANÇA: ${estado.pontosAlianca.total} pts</strong></p>
        </div>
    `;

    const html = resumoAlianca + payloads.map(({ cor, equipeNome, jogoTexto, payload }) => {
        const linhas = payload.map(field => `
                <tr>
                    <td>${field.label}</td>
                    <td>${String(field.value)}</td>
                    <td><code>${field.key}</code></td>
                </tr>
            `).join('');

        return `
            <div class="mb-4">
                <h3 class="h6 mb-3">Equipe ${cor === 'verde' ? '1 (Verde)' : '2 (Azul)'} - ${equipeNome || 'Não definida'}</h3>
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
    
    const confirmar = confirm(`Deseja finalizar a avaliação da ${estado.aliancaSelecionada} e enviar os resultados?`);
    if (!confirmar) return;
    
    try {
        console.log('📤 Preparando dados para o Google Forms...');
        
        const juiz = document.getElementById('selectJuiz').value;
        const selectJogo = document.getElementById('selectJogo');
        const jogo = selectJogo.value;
        const jogoTexto = selectJogo.options[selectJogo.selectedIndex]?.textContent || jogo;
        const alianca = estado.aliancaSelecionada || '';

        // PLACEHOLDER: URL do form de eliminatórias (será definida no backend)
        const formUrl = 'https://docs.google.com/forms/u/0/d/e/PLACEHOLDER_ELIMINATORIAS/formResponse';
        const equipes = ['verde', 'azul'];

        const payloads = equipes.map(cor => {
            const campo = cor === 'verde' ? campoVerde : campoAzul;
            return {
                cor,
                ...construirPayloadGoogleForms(estado.equipes[cor], juiz, jogo, jogoTexto, campo, alianca)
            };
        });

        mostrarResumoEnvio(payloads);
        console.log('📄 Dados do formulário:', payloads);
        console.log('🏆 Pontos da Aliança:', estado.pontosAlianca);

        /*
        // TODO Backend: descomentar quando a URL real do form estiver disponível
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
        */
        
        alert(`Avaliação da ${alianca} finalizada! (Simulação - envio real será implementado no backend)`);
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
    const alianca = estado.aliancaSelecionada;
    
    if (!juiz) erros.push('Selecione um juiz');
    if (!jogo) erros.push('Selecione um jogo');
    if (!alianca) erros.push('Selecione uma aliança para avaliar');
    
    // Verificar se as equipes da aliança foram preenchidas
    if (!estado.equipes.verde.nome) erros.push('Selecione a Equipe 1');
    if (!estado.equipes.azul.nome) erros.push('Selecione a Equipe 2');
    
    return erros;
}

function resetarFormulario() {
    document.getElementById('selectJuiz').value = '';
    document.getElementById('selectJogo').value = '';
    
    // Resetar dropdown de aliança
    const selectAlianca = document.getElementById('selectAlianca');
    selectAlianca.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione a aliança';
    selectAlianca.appendChild(placeholder);
    
    document.getElementById('chaoValorVerde').value = '0';
    document.getElementById('chaoValorAzul').value = '0';
    
    document.getElementById('selectEscaladaVerde').value = '0';
    document.getElementById('selectEscaladaAzul').value = '0';
    
    document.getElementById('checkIntegration').checked = false;
    
    if (campoVerde) campoVerde.resetar();
    if (campoAzul) campoAzul.resetar();
    
    limparEquipesDaAlianca();
    
    const summary = document.getElementById('formSubmissionSummary');
    const summaryContent = document.getElementById('formSubmissionSummaryContent');
    if (summary) {
        summary.style.display = 'none';
    }
    if (summaryContent) {
        summaryContent.innerHTML = '';
    }
    
    estado.aliancaSelecionada = null;
    estado.equipes.verde = { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosTotal: 0 };
    estado.equipes.azul = { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosTotal: 0 };
    estado.cooperacao = { 
        coopetition: false, 
        coopetitionPontos: 0,
        networking: false, 
        networkingPontos: 0,
        integration: false,
        integrationPontos: 0,
        networkingMsgMostrada: false 
    };
    estado.pontosAlianca = {
        individuaisVerde: 0,
        individuaisAzul: 0,
        cooperacao: 0,
        total: 0
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
    
    // Resetar placar da aliança
    document.getElementById('placarAlianca').textContent = '00';
    document.getElementById('placarNomeAlianca').textContent = 'Aliança';
    document.getElementById('placarEquipe1').textContent = 'Equipe 1: 0';
    document.getElementById('placarEquipe2').textContent = 'Equipe 2: 0';
    document.getElementById('badgeTotalVerde').textContent = 'Eq1: 0pts';
    document.getElementById('badgeTotalAzul').textContent = 'Eq2: 0pts';
    document.getElementById('badgeCoop').textContent = 'Coop: 0pts';
    
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