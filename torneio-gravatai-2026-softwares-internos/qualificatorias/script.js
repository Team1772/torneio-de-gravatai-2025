// ===================================
// IMPORTS
// ===================================
import { carregarDadosMock } from '../utils/mock-data.js';
import { CampoJogo, verificarCoopetition, verificarNetworking } from './campo-jogo.js';

// ===================================
// ESTADO DA APLICAÇÃO
// ===================================
const estado = {
    juizSelecionado: null,
    jogoSelecionado: null,
    equipes: {
        verde: {
            nome: null,
            posicaoMural: null,
            chaoNoMural: 0,
            escalada: 0,
            pontosIndividuais: 0,
            pontosCooperacao: 0,
            pontosTotal: 0
        },
        azul: {
            nome: null,
            posicaoMural: null,
            chaoNoMural: 0,
            escalada: 0,
            pontosIndividuais: 0,
            pontosCooperacao: 0,
            pontosTotal: 0
        }
    },
    cooperacao: {
        coopetition: false,
        networking: false,
        integration: false
    }
};

// Instâncias dos campos de jogo
let campoVerde = null;
let campoAzul = null;

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicação...');
    
    try {
        // Carregar dados mock
        const dados = await carregarDadosMock();
        console.log('✅ Dados carregados:', dados);
        
        // Preencher dropdowns
        preencherDropdowns(dados);
        
        // Configurar event listeners
        configurarEventListeners();
        
        console.log('✅ Aplicação inicializada com sucesso!');
    } catch (erro) {
        console.error('❌ Erro ao inicializar:', erro);
        mostrarMensagem('Erro ao carregar dados. Recarregue a página.', 'erro');
    }
});

// ===================================
// PREENCHER DROPDOWNS
// ===================================
function preencherDropdowns(dados) {
    // Juízes
    const selectJuiz = document.getElementById('selectJuiz');
    dados.juizes.forEach(juiz => {
        const option = document.createElement('option');
        option.value = juiz;
        option.textContent = juiz;
        selectJuiz.appendChild(option);
    });
    
    // Jogos
    const selectJogo = document.getElementById('selectJogo');
    dados.jogos.forEach(jogo => {
        const option = document.createElement('option');
        option.value = jogo.numero;
        option.textContent = `N° ${jogo.numero}: ${jogo.equipe1} x ${jogo.equipe2}`;
        option.dataset.equipe1 = jogo.equipe1;
        option.dataset.equipe2 = jogo.equipe2;
        selectJogo.appendChild(option);
    });
    
    // Equipes
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

// ===================================
// CONFIGURAR EVENT LISTENERS
// ===================================
function configurarEventListeners() {
    // Inicializar campos de jogo
    campoVerde = new CampoJogo('verde');
    campoAzul = new CampoJogo('azul');
    
    // Listener para mudanças de posição no mural
    document.addEventListener('posicaoAlterada', (event) => {
        const { cor, pontos } = event.detail;
        estado.equipes[cor].posicaoMural = pontos;
        calcularPontos();
    });
    
    // Seleção de jogo
    document.getElementById('selectJogo').addEventListener('change', aoSelecionarJogo);
    
    // Seleção de equipes
    document.getElementById('selectEquipe1').addEventListener('change', () => atualizarNomeEquipe('verde'));
    document.getElementById('selectEquipe2').addEventListener('change', () => atualizarNomeEquipe('azul'));
    
    // Contadores de chão
    document.getElementById('btnChaoMaisVerde').addEventListener('click', () => alterarChao('verde', 1));
    document.getElementById('btnChaoMenosVerde').addEventListener('click', () => alterarChao('verde', -1));
    document.getElementById('btnChaoMaisAzul').addEventListener('click', () => alterarChao('azul', 1));
    document.getElementById('btnChaoMenosAzul').addEventListener('click', () => alterarChao('azul', -1));
    
    // Escalada
    document.getElementById('selectEscaladaVerde').addEventListener('change', () => atualizarEscalada('verde'));
    document.getElementById('selectEscaladaAzul').addEventListener('change', () => atualizarEscalada('azul'));
    
    // Cooperação
    document.getElementById('coopCoopetition').addEventListener('change', atualizarCooperacao);
    document.getElementById('coopNetworking').addEventListener('change', atualizarCooperacao);
    document.getElementById('coopIntegration').addEventListener('change', atualizarCooperacao);
    
    // Botão finalizar
    document.getElementById('btnFinalizarPartida').addEventListener('click', finalizarPartida);
}

// ===================================
// HANDLERS DE EVENTOS
// ===================================
function aoSelecionarJogo(event) {
    const select = event.target;
    const option = select.options[select.selectedIndex];
    
    if (option.value) {
        const equipe1 = option.dataset.equipe1;
        const equipe2 = option.dataset.equipe2;
        
        document.getElementById('selectEquipe1').value = equipe1;
        document.getElementById('selectEquipe2').value = equipe2;
        
        atualizarNomeEquipe('verde');
        atualizarNomeEquipe('azul');
        
        mostrarMensagem(`Jogo ${option.value} selecionado`, 'sucesso');
    }
}

function atualizarNomeEquipe(cor) {
    const selectId = cor === 'verde' ? 'selectEquipe1' : 'selectEquipe2';
    const select = document.getElementById(selectId);
    const nomeEquipe = select.value;
    
    if (nomeEquipe) {
        estado.equipes[cor].nome = nomeEquipe;
        
        // Atualizar UI
        document.getElementById(`nomeEquipe${cor === 'verde' ? 'Verde' : 'Azul'}`).textContent = nomeEquipe;
        document.getElementById(`labelEscalada${cor === 'verde' ? 'Verde' : 'Azul'}`).textContent = nomeEquipe;
        document.getElementById(`placarNome${cor === 'verde' ? 'Verde' : 'Azul'}`).textContent = nomeEquipe;
    }
}

function alterarChao(cor, delta) {
    const valorAtual = estado.equipes[cor].chaoNoMural;
    const novoValor = Math.max(0, valorAtual + delta);
    
    estado.equipes[cor].chaoNoMural = novoValor;
    
    // Atualizar UI
    const inputId = cor === 'verde' ? 'chaoValorVerde' : 'chaoValorAzul';
    document.getElementById(inputId).value = novoValor;
    
    // Recalcular pontos
    calcularPontos();
}

function atualizarEscalada(cor) {
    const selectId = cor === 'verde' ? 'selectEscaladaVerde' : 'selectEscaladaAzul';
    const select = document.getElementById(selectId);
    const valor = parseInt(select.value);
    
    estado.equipes[cor].escalada = valor;
    
    // Recalcular pontos
    calcularPontos();
}

function atualizarCooperacao() {
    estado.cooperacao.coopetition = document.getElementById('coopCoopetition').checked;
    estado.cooperacao.networking = document.getElementById('coopNetworking').checked;
    estado.cooperacao.integration = document.getElementById('coopIntegration').checked;
    
    // Calcular total de cooperação
    let totalCoop = 0;
    if (estado.cooperacao.coopetition) totalCoop += 2;
    if (estado.cooperacao.networking) totalCoop += 6;
    if (estado.cooperacao.integration) totalCoop += 4;
    
    document.getElementById('totalCooperacao').textContent = totalCoop;
    
    // Recalcular pontos
    calcularPontos();
}

// ===================================
// CÁLCULOS DE PONTUAÇÃO
// ===================================
function calcularPontos() {
    ['verde', 'azul'].forEach(cor => {
        const equipe = estado.equipes[cor];
        const campo = cor === 'verde' ? campoVerde : campoAzul;
        
        // Pontos do campo (baseado na posição no mural)
        const ptsCampo = campo ? campo.getPontosAtual() : 0;
        
        // Pontos de chão (1 ponto por PILAR)
        const ptsChao = equipe.chaoNoMural * 1;
        
        // Pontos de escalada
        const ptsEscalada = equipe.escalada;
        
        // Pontos de cooperação
        let ptsCoop = 0;
        if (estado.cooperacao.coopetition) ptsCoop += 2;
        if (estado.cooperacao.networking) ptsCoop += 6;
        if (estado.cooperacao.integration) ptsCoop += 4;
        
        // Total individual (sem cooperação)
        const totalIndividual = ptsCampo + ptsChao + ptsEscalada;
        
        // Total final (com cooperação)
        const totalFinal = totalIndividual + ptsCoop;
        
        // Atualizar estado
        equipe.pontosIndividuais = totalIndividual;
        equipe.pontosCooperacao = ptsCoop;
        equipe.pontosTotal = totalFinal;
        
        // Atualizar UI
        atualizarPontosUI(cor, ptsCampo, ptsChao, ptsEscalada, totalIndividual, totalFinal);
    });
}

function atualizarPontosUI(cor, ptsCampo, ptsChao, ptsEscalada, totalIndividual, totalFinal) {
    const sufixo = cor === 'verde' ? 'Verde' : 'Azul';
    
    // Pontos individuais
    document.getElementById(`ptsCampo${sufixo}`).textContent = ptsCampo;
    document.getElementById(`ptsChao${sufixo}`).textContent = ptsChao;
    document.getElementById(`ptsEscalada${sufixo}`).textContent = ptsEscalada;
    document.getElementById(`totalIndividual${sufixo}`).textContent = totalIndividual;
    
    // Placar final
    const placarElement = document.getElementById(`placar${sufixo}`);
    placarElement.textContent = totalFinal.toString().padStart(2, '0');
    placarElement.classList.add('updating');
    setTimeout(() => placarElement.classList.remove('updating'), 500);
}

// ===================================
// FINALIZAR PARTIDA
// ===================================
async function finalizarPartida() {
    // Validar dados
    const erros = validarPartida();
    
    if (erros.length > 0) {
        alert('Erros encontrados:\n' + erros.join('\n'));
        return;
    }
    
    // Confirmar
    const confirmar = confirm('Deseja finalizar a partida e enviar os resultados?');
    if (!confirmar) return;
    
    try {
        console.log('📤 Enviando resultado da partida:', estado);
        
        // PLACEHOLDER: Aqui será implementado o envio real
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Partida finalizada com sucesso!');
        
        // Resetar formulário
        resetarFormulario();
        
    } catch (erro) {
        console.error('❌ Erro ao finalizar partida:', erro);
        alert('Erro ao finalizar partida. Tente novamente.');
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
    // Resetar selects
    document.getElementById('selectJuiz').value = '';
    document.getElementById('selectJogo').value = '';
    document.getElementById('selectEquipe1').value = '';
    document.getElementById('selectEquipe2').value = '';
    
    // Resetar contadores
    document.getElementById('chaoValorVerde').value = '0';
    document.getElementById('chaoValorAzul').value = '0';
    
    // Resetar escalada
    document.getElementById('selectEscaladaVerde').value = '0';
    document.getElementById('selectEscaladaAzul').value = '0';
    
    // Resetar cooperação
    document.getElementById('coopCoopetition').checked = false;
    document.getElementById('coopNetworking').checked = false;
    document.getElementById('coopIntegration').checked = false;
    
    // Resetar campos de jogo
    if (campoVerde) campoVerde.resetar();
    if (campoAzul) campoAzul.resetar();
    
    // Resetar estado
    estado.equipes.verde = { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosCooperacao: 0, pontosTotal: 0 };
    estado.equipes.azul = { nome: null, posicaoMural: null, chaoNoMural: 0, escalada: 0, pontosIndividuais: 0, pontosCooperacao: 0, pontosTotal: 0 };
    estado.cooperacao = { coopetition: false, networking: false, integration: false };
    
    // Recalcular pontos
    calcularPontos();
}

// ===================================
// UTILITÁRIOS
// ===================================
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
