// ===================================
// CAMPO DE JOGO - GERENCIAMENTO DE BOTÕES E POSIÇÕES
// ===================================

/**
 * Posições dos botões sobre o mural
 * Baseado na imagem do mural com 3 níveis (N1, N2, N3)
 */
const POSICOES_MURAL = [
    // N3 - Linha Superior (4 pontos cada)
    { id: 1, nivel: 'n3', x: '15%', y: '20%', pontos: 4 },
    { id: 2, nivel: 'n3', x: '38%', y: '20%', pontos: 4 },
    { id: 3, nivel: 'n3', x: '62%', y: '20%', pontos: 4 },
    { id: 4, nivel: 'n3', x: '85%', y: '20%', pontos: 4 },
    
    // N2 - Linha Média (3 pontos cada)
    { id: 5, nivel: 'n2', x: '26%', y: '45%', pontos: 3 },
    { id: 6, nivel: 'n2', x: '50%', y: '45%', pontos: 3 }, // PINO CENTRAL COOPERATIVO
    { id: 7, nivel: 'n2', x: '74%', y: '45%', pontos: 3 },
    
    // N1 - Linha Inferior (2 pontos cada)
    { id: 8, nivel: 'n1', x: '15%', y: '70%', pontos: 2 },
    { id: 9, nivel: 'n1', x: '38%', y: '70%', pontos: 2 },
    { id: 10, nivel: 'n1', x: '62%', y: '70%', pontos: 2 },
    { id: 11, nivel: 'n1', x: '85%', y: '70%', pontos: 2 }
];

/**
 * Classe para gerenciar o campo de jogo de uma equipe
 */
export class CampoJogo {
    constructor(cor) {
        this.cor = cor; // 'verde' ou 'azul'
        this.posicaoAtual = null;
        this.containerBotoes = document.getElementById(`botoes${cor === 'verde' ? 'Verde' : 'Azul'}`);
        this.indicadorRobo = null;
        
        this.inicializar();
    }
    
    /**
     * Inicializa o campo de jogo
     */
    inicializar() {
        this.criarBotoes();
        this.criarIndicadorRobo();
    }
    
    /**
     * Cria os botões sobre o mural
     */
    criarBotoes() {
        console.log(`🎮 Criando ${POSICOES_MURAL.length} botões para equipe ${this.cor}`);
        POSICOES_MURAL.forEach(posicao => {
            const botao = document.createElement('button');
            botao.className = 'btn-posicao';
            botao.dataset.posicao = posicao.id;
            botao.dataset.nivel = posicao.nivel;
            botao.dataset.pontos = posicao.pontos;
            botao.style.left = posicao.x;
            botao.style.top = posicao.y;
            botao.textContent = posicao.pontos;
            botao.title = `${posicao.nivel.toUpperCase()}: ${posicao.pontos} pontos`;
            
            // Event listener
            botao.addEventListener('click', () => this.selecionarPosicao(posicao.id));
            
            this.containerBotoes.appendChild(botao);
        });
        console.log(`✅ Botões criados para equipe ${this.cor}`);
    }
    
    /**
     * Cria o indicador visual do robô
     */
    criarIndicadorRobo() {
        this.indicadorRobo = document.createElement('div');
        this.indicadorRobo.className = `robo-indicador ${this.cor}`;
        this.indicadorRobo.style.display = 'none'; // Inicialmente oculto
        this.containerBotoes.appendChild(this.indicadorRobo);
    }
    
    /**
     * Seleciona uma posição no mural
     */
    selecionarPosicao(posicaoId) {
        // Remover seleção anterior
        const botaoAnterior = this.containerBotoes.querySelector('.btn-posicao.active');
        if (botaoAnterior) {
            botaoAnterior.classList.remove('active');
        }
        
        // Adicionar nova seleção
        const botaoNovo = this.containerBotoes.querySelector(`[data-posicao="${posicaoId}"]`);
        if (botaoNovo) {
            botaoNovo.classList.add('active');
            this.posicaoAtual = posicaoId;
            
            // Mover indicador do robô
            this.moverIndicadorRobo(botaoNovo);
            
            // Disparar evento customizado para atualizar pontuação
            const evento = new CustomEvent('posicaoAlterada', {
                detail: {
                    cor: this.cor,
                    posicao: posicaoId,
                    pontos: parseInt(botaoNovo.dataset.pontos),
                    nivel: botaoNovo.dataset.nivel
                }
            });
            document.dispatchEvent(evento);
        }
    }
    
    /**
     * Move o indicador visual do robô para a posição selecionada
     */
    moverIndicadorRobo(botao) {
        const rect = botao.getBoundingClientRect();
        const containerRect = this.containerBotoes.getBoundingClientRect();
        
        // Calcular posição relativa
        const x = ((rect.left - containerRect.left) / containerRect.width) * 100;
        const y = ((rect.top - containerRect.top) / containerRect.height) * 100;
        
        this.indicadorRobo.style.left = `${x}%`;
        this.indicadorRobo.style.top = `${y}%`;
        this.indicadorRobo.style.display = 'block';
    }
    
    /**
     * Obtém os pontos da posição atual
     */
    getPontosAtual() {
        if (!this.posicaoAtual) return 0;
        
        const botao = this.containerBotoes.querySelector(`[data-posicao="${this.posicaoAtual}"]`);
        return botao ? parseInt(botao.dataset.pontos) : 0;
    }
    
    /**
     * Obtém o nível da posição atual
     */
    getNivelAtual() {
        if (!this.posicaoAtual) return null;
        
        const botao = this.containerBotoes.querySelector(`[data-posicao="${this.posicaoAtual}"]`);
        return botao ? botao.dataset.nivel : null;
    }
    
    /**
     * Reseta o campo de jogo
     */
    resetar() {
        // Remover seleção
        const botaoAtivo = this.containerBotoes.querySelector('.btn-posicao.active');
        if (botaoAtivo) {
            botaoAtivo.classList.remove('active');
        }
        
        // Ocultar indicador
        this.indicadorRobo.style.display = 'none';
        
        // Resetar posição
        this.posicaoAtual = null;
    }
}

/**
 * Verifica se duas equipes estão no mesmo pino N1 (para Coopetition)
 */
export function verificarCoopetition(campoVerde, campoAzul) {
    const nivelVerde = campoVerde.getNivelAtual();
    const nivelAzul = campoAzul.getNivelAtual();
    const posicaoVerde = campoVerde.posicaoAtual;
    const posicaoAzul = campoAzul.posicaoAtual;
    
    // Ambos devem estar no N1 e na mesma posição
    return nivelVerde === 'n1' && nivelAzul === 'n1' && posicaoVerde === posicaoAzul;
}

/**
 * Verifica se ambas equipes colocaram peça no pino central N2 (para Networking)
 */
export function verificarNetworking(campoVerde, campoAzul) {
    const posicaoVerde = campoVerde.posicaoAtual;
    const posicaoAzul = campoAzul.posicaoAtual;
    
    // Posição 6 é o pino central do N2
    return posicaoVerde === 6 || posicaoAzul === 6;
}
