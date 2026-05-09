# Planejamento de Desenvolvimento - Torneio de Gravataí 2026

## 📋 Índice
1. [Resumo Executivo para IAs](#resumo-executivo-para-ias)
2. [Visão Geral](#visão-geral)
3. [Análise Comparativa 2025 vs 2026](#análise-comparativa-2025-vs-2026)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Componentes e Funcionalidades](#componentes-e-funcionalidades)
6. [Especificações Técnicas](#especificações-técnicas)
7. [Integrações Backend (Placeholders)](#integrações-backend-placeholders)
8. [Checklist de Implementação](#checklist-de-implementação)
9. [Notas Técnicas](#notas-técnicas)

---

## 🤖 Resumo Executivo para IAs

### Objetivo do Software
Sistema web para registro de partidas qualificatórias do Torneio de Robótica de Gravataí 2026. Interface para juízes registrarem pontuações em tempo real.

### Mecânica do Jogo
- **Duração**: 2 minutos e 30 segundos por partida
- **Modo Inicial**: 45 segundos de modo autônomo obrigatório, depois pode alternar para teleoperado
- **Estrutura**: 2 equipes jogam simultaneamente, cada uma em sua quadra
- **Objetivo**: Coletar PILARES e encaixá-los no MURAL FINANCEIRO, depois escalar FLUXOS

### Distribuição de PILARES
Cada lado da quadra possui **11 PILARES**:
- **8 PILARES** distribuídos em 2 BASES PRODUTIVAS (4 em cada)
- **3 PILARES** no chão (marcados por círculos)

### Tabela Completa de Pontuação

#### Pontos Individuais (por equipe)
| Ação | Pontos | Regra |
|------|--------|-------|
| PILAR no CHÃO do mural (perímetro 10cm) | 1 pt | A3 |
| PILAR no N1 (primeira linha) | 2 pts | A4 |
| PILAR no N2 (segunda linha) | 3 pts | A5 |
| PILAR no N3 (terceira linha) | 4 pts | A6 |
| Robô pendurado em FLUXO (fim da partida) | 8 pts | A2 |

#### Pontos de Cooperação (somados para ambas equipes)
| Missão | Pontos | Condição | Regra |
|--------|--------|----------|-------|
| Coopetition | 2 pts | Ambas equipes preenchem os dois lados do mesmo PINO N1 | B2 |
| Networking | 6 pts | Cada equipe encaixa PILAR da cor oposta no PINO CENTRAL do N2 | B3 |
| Integration | 4 pts | Ambos robôs pendurados no mesmo FLUXO | B4 |

### Elementos do Jogo

**MURAL FINANCEIRO** (24cm altura × 60cm comprimento):
- **CHÃO**: Perímetro de 10cm na frente do mural (1 pt/PILAR)
- **N1**: Primeira linha de PINOS (2 pts/PILAR)
- **N2**: Segunda linha com PINO CENTRAL cooperativo (3 pts/PILAR)
- **N3**: Terceira linha (4 pts/PILAR)

**FLUXOS CRIATIVOS**: 2 estruturas para escalada (8 pts se pendurado)

**ZONA DE CARGA** (raio 45cm):
- Área onde robôs podem ser reposicionados
- Permite troca de programação
- Permite manipulação manual de PILARES
- PILARES que passam aqui ganham "checkpoint"

**BASES PRODUTIVAS**: 2 por lado, cada uma com 4 PILARES empilhados

### Conceito de "Checkpoint"
PILARES que foram levados à ZONA DE CARGA recebem um "checkpoint". Se o robô parar no meio da quadra:
- **Com checkpoint**: PILAR pode ser reposicionado na ZONA DE CARGA
- **Sem checkpoint**: PILAR deve ser reposicionado onde o robô parou

### Stack Técnico
- **Frontend**: HTML5, CSS3, Bootstrap 5.3.3, JavaScript ES6+ Modules
- **Backend**: Nenhum (fase inicial - usar dados mock)
- **Autenticação**: Nenhuma (fase inicial)
- **Imagens**: Campo de jogo visual com imagem do mural + botões overlay

### Escopo Inicial
✅ Página de registro de partidas qualificatórias  
❌ Integração com Google Sheets/Forms (placeholder)  
❌ Autenticação (placeholder)  
❌ Outras páginas (resultados, cronograma)

---

## 🎯 Visão Geral

### Objetivo
Desenvolver o sistema de gerenciamento de partidas qualificatórias para o Torneio de Robótica de Gravataí 2026, baseado na estrutura do sistema de 2025, com adaptações para as novas regras e mecânicas do jogo.

### Escopo Inicial
- **Página de Registro de Partidas Qualificatórias** (interface para juízes)
- **Sem integrações backend** (usar dados mock/placeholder)
- **Sem autenticação** (implementação futura)

### Tecnologias
- HTML5
- CSS3 (Bootstrap 5.3.3)
- JavaScript (ES6+ Modules)
- Imagens estáticas para o campo de jogo

---

## 🔄 Análise Comparativa 2025 vs 2026

### Mudanças Principais

#### 1. **Mecânica de Pontuação**

**2025:**
- N1 (Nível 1): 2 pontos
- N2 (Nível 2): 3 pontos
- N3 (Nível 3): 4 pontos
- Movimento (MV): 1 ponto
- Cooperação: Fundação + Níveis compartilhados

**2026:**
- Posições no Mural (campo visual interativo)
- Chão no Mural (substitui "Movimento")
- Escalada (nova mecânica com dropdown)
- Cooperação: COOPETITION, NETWORKING, INTEGRATION

#### 2. **Interface Visual**

**2025:**
- Contadores simples com botões +/-
- Layout baseado em texto e números
- Sem representação visual do campo

**2026:**
- Campo de jogo visual (imagem do mural)
- Botões interativos sobre o campo
- Indicadores visuais de posição dos robôs
- Layout mais gráfico e intuitivo

#### 3. **Fluxo de Pontuação**

**2025:**
```
Seleção → Contadores → Cooperação → Total
```

**2026:**
```
Seleção → Campo Visual → Chão → Escalada → Pontos Individuais → Cooperação → Total
```

---

## 📁 Estrutura de Arquivos

```
torneio-gravatai-2026-softwares-internos/
│
├── imagens-software/
│   ├── parte-1.png (referência Figma)
│   ├── parte-2.png (referência Figma)
│   └── mural.png (campo de jogo)
│
├── qualificatorias/
│   ├── index.html (página principal)
│   ├── styles.css (estilos customizados)
│   ├── script.js (lógica principal)
│   └── campo-jogo.js (lógica do campo visual)
│
├── assets/
│   ├── images/
│   │   └── mural.png (cópia para produção)
│   └── icons/
│       ├── robo-verde.svg (ícone robô equipe 1)
│       └── robo-azul.svg (ícone robô equipe 2)
│
├── utils/
│   ├── mock-data.js (dados mock para testes)
│   └── pontuacao.js (cálculos de pontuação)
│
└── PLANEJAMENTO-DESENVOLVIMENTO.md (este arquivo)
```

---

## 🧩 Componentes e Funcionalidades

### 1. **Cabeçalho e Seleção**

#### Elementos:
- **Dropdown Juiz**: Seleção do juiz responsável
- **Dropdown Próximo Jogo**: Lista de jogos disponíveis (formato: "N° X: Equipe1 - Equipe2")
- **Dropdown Equipe 1**: Seleção da primeira equipe (cor verde)
- **Dropdown Equipe 2**: Seleção da segunda equipe (cor azul)

#### Funcionalidades:
- Ao selecionar um jogo, preencher automaticamente as equipes
- Validação: não permitir mesma equipe em ambos os lados
- Indicadores visuais de cor (verde/azul) para cada equipe

#### Dados Mock:
```javascript
const juizes = ["Eduardo", "Maria", "João", "Ana"];
const equipes = [
  "Eletrobots",
  "Technoibots",
  "Robotic Warriors",
  "Tech Titans",
  // ... adicionar mais equipes mock
];
const jogos = [
  { numero: 1, equipe1: "Eletrobots", equipe2: "Technoibots" },
  { numero: 2, equipe1: "Robotic Warriors", equipe2: "Tech Titans" },
  // ... adicionar mais jogos mock
];
```

---

### 2. **Campo de Jogo Visual - Botões de PILARES**

#### ⚠️ IMPORTANTE: Lógica Correta dos Botões

**Cada botão representa 1 PILAR colocado naquela posição do mural, NÃO a posição do robô.**

#### Estrutura:
```html
<div class="campo-container">
  <div class="campo-equipe verde">
    <h3>Eletrobots</h3>
    <div class="campo-visual">
      <img src="../assets/images/mural.png" alt="Campo de jogo">
      <div class="botoes-overlay">
        <!-- Botões toggle ON/OFF para cada posição -->
        <button class="btn-pilar" data-posicao="1" data-nivel="n3" data-equipe="verde">+</button>
        <button class="btn-pilar" data-posicao="2" data-nivel="n3" data-equipe="verde">+</button>
        <!-- ... mais botões -->
        <!-- Botão central especial (3 estados) -->
        <button class="btn-pilar central" data-posicao="6" data-nivel="n2" data-equipe="verde">+</button>
      </div>
    </div>
    <div class="chao-contador">
      <span>CHÃO NO MURAL</span>
      <button class="btn-chao-add">+1</button>
      <span class="chao-valor">0</span>
    </div>
  </div>
  
  <div class="campo-equipe azul">
    <!-- Estrutura similar para equipe azul -->
  </div>
</div>
```

#### Funcionalidades dos Botões:

**Botões Normais (10 posições):**
- **Estado OFF (inicial)**: Mostra símbolo `+` (branco/cinza)
- **Estado ON (clicado)**: Mostra círculo preenchido com cor da equipe (🟢 verde ou 🔵 azul)
- **Toggle**: Clicar novamente desliga (volta para `+`)
- **Pontuação**: Soma pontos conforme nível (N1=2pts, N2=3pts, N3=4pts)

**Botão Central (Posição 6 - N2):**
- **3 Estados possíveis**:
  1. **OFF**: Mostra `+` (nenhum PILAR)
  2. **Cor Própria**: Círculo da cor da equipe (pontuação normal N2 = 3pts)
  3. **Cor Oposta**: Círculo da cor oposta (3pts + ativa NETWORKING cooperação)
- **Ciclo**: OFF → Própria Cor → Cor Oposta → OFF
- **Detecção Automática**: Sistema detecta quando ambas equipes têm cor oposta no central

#### Feedback Visual:
- **OFF**: `+` em branco/cinza claro
- **ON (própria cor)**: ● sólido verde ou azul
- **ON (cor oposta)**: ◉ com borda especial indicando cooperação
- **Sem indicador de robô**: Removido (não é necessário)

#### Coordenadas dos Botões (aproximadas):
```javascript
const posicoesMural = [
  // N3 - Linha superior (4 pontos cada)
  { id: 1, nivel: 'n3', x: '15%', y: '20%', pontos: 4 },
  { id: 2, nivel: 'n3', x: '38%', y: '20%', pontos: 4 },
  { id: 3, nivel: 'n3', x: '62%', y: '20%', pontos: 4 },
  { id: 4, nivel: 'n3', x: '85%', y: '20%', pontos: 4 },
  
  // N2 - Linha média (3 pontos cada)
  { id: 5, nivel: 'n2', x: '26%', y: '45%', pontos: 3 },
  { id: 6, nivel: 'n2', x: '50%', y: '45%', pontos: 3, central: true }, // PINO CENTRAL
  { id: 7, nivel: 'n2', x: '74%', y: '45%', pontos: 3 },
  
  // N1 - Linha inferior (2 pontos cada)
  { id: 8, nivel: 'n1', x: '15%', y: '70%', pontos: 2 },
  { id: 9, nivel: 'n1', x: '38%', y: '70%', pontos: 2 },
  { id: 10, nivel: 'n1', x: '62%', y: '70%', pontos: 2 },
  { id: 11, nivel: 'n1', x: '85%', y: '70%', pontos: 2 }
];
```

#### Exemplo Visual de Interação:

```
EQUIPE VERDE - Mural:

Estado Inicial (todos OFF):
[+] [+] [+] [+]  ← N3 (4pts cada)
  [+] [+] [+]    ← N2 (3pts cada, centro = cooperação)
[+] [+] [+] [+]  ← N1 (2pts cada)

Após clicar em 3 posições:
[+] [●] [+] [+]  ← N3: 1 PILAR = 4pts
  [+] [◉] [+]    ← N2: 1 PILAR cor oposta = 3pts + NETWORKING
[●] [+] [+] [+]  ← N1: 1 PILAR = 2pts

Total Mural: 4 + 3 + 2 = 9 pontos
Cooperação: NETWORKING detectado automaticamente
```

#### Lógica do Botão Central (Posição 6):

```javascript
// Estado do botão central
let estadoCentral = 'off'; // 'off' | 'propria' | 'oposta'

function clicarBotaoCentral(botao, corEquipe) {
  if (estadoCentral === 'off') {
    // Primeiro clique: ativa com cor própria
    estadoCentral = 'propria';
    botao.textContent = '●';
    botao.style.backgroundColor = corEquipe; // verde ou azul
    botao.dataset.cor = corEquipe;
    
  } else if (estadoCentral === 'propria') {
    // Segundo clique: muda para cor oposta
    estadoCentral = 'oposta';
    const corOposta = corEquipe === 'verde' ? 'azul' : 'verde';
    botao.textContent = '◉';
    botao.style.backgroundColor = corOposta;
    botao.style.border = '3px solid gold'; // destaque cooperação
    botao.dataset.cor = corOposta;
    
    // Verificar se ativa NETWORKING
    verificarNetworking();
    
  } else {
    // Terceiro clique: desliga
    estadoCentral = 'off';
    botao.textContent = '+';
    botao.style.backgroundColor = 'white';
    botao.style.border = '2px solid #333';
    botao.dataset.cor = '';
  }
}
```

---

### 3. **Escalada**

#### Estrutura:
```html
<div class="escalada-section">
  <h3>Escalada</h3>
  <div class="escalada-equipes">
    <div class="escalada-equipe verde">
      <label>Eletrobots</label>
      <select class="escalada-select" data-equipe="verde">
        <option value="0">0pts - Robô não se suspendeu nos fluxos</option>
        <option value="8">8pts - Robô se suspendeu nos fluxos</option>
      </select>
    </div>
    <div class="escalada-equipe azul">
      <label>Technoibots</label>
      <select class="escalada-select" data-equipe="azul">
        <option value="0">0pts - Robô não se suspendeu nos fluxos</option>
        <option value="8">8pts - Robô se suspendeu nos fluxos</option>
      </select>
    </div>
  </div>
</div>
```

#### Funcionalidades:
- Dropdown com opções de pontuação
- Atualizar total ao mudar seleção
- Valores mock (ajustar conforme regras reais)

---

### 4. **Pontos Individuais**

#### Estrutura:
```html
<div class="pontos-individuais">
  <h3>Pontos individuais</h3>
  <div class="pontos-display">
    <div class="pontos-equipe verde">
      <span id="pts-campo-verde">0</span> + 
      <span id="pts-chao-verde">0</span> + 
      <span id="pts-escalada-verde">0</span> + 
      <span id="pts-bonus-verde">0</span> = 
      <strong id="total-individual-verde">0</strong>
    </span>
    </div>
    <div class="pontos-equipe azul">
      <span id="pts-campo-azul">0</span> + 
      <span id="pts-chao-azul">0</span> + 
      <span id="pts-escalada-azul">0</span> + 
      <span id="pts-bonus-azul">0</span> = 
      <strong id="total-individual-azul">0</strong>
    </div>
  </div>
</div>
```

#### Cálculo:
```javascript
function calcularPontosIndividuais(equipe) {
  const ptsCampo = calcularPontosCampo(equipe); // baseado na posição no mural
  const ptsChao = getChaoValor(equipe);
  const ptsEscalada = getEscaladaValor(equipe);
  const ptsBonus = 0; // placeholder para bônus futuros
  
  return ptsCampo + ptsChao + ptsEscalada + ptsBonus;
}
```

---

### 5. **Cooperação - Sistema Automático e Manual**

#### ✅ IMPLEMENTADO: Sistema de Detecção Automática

#### Estrutura:
```html
<div class="cooperacao-section">
  <h3>Cooperação</h3>
  
  <!-- Display Read-Only para COOPETITION -->
  <div class="cooperacao-item">
    <div class="coop-label">
      <strong>COOPETITION</strong>
      <span class="text-muted small">Ambas equipes preenchem os dois lados do N1 (2pts cada)</span>
    </div>
    <div class="coop-status-container">
      <div class="coop-positions">
        <span class="coop-pos" id="coopPos8">✗</span>
        <span class="coop-pos" id="coopPos9">✗</span>
        <span class="coop-pos" id="coopPos10">✗</span>
        <span class="coop-pos" id="coopPos11">✗</span>
      </div>
      <span class="coop-pontos" id="ptsCoopetition">0 pts</span>
    </div>
  </div>
  
  <!-- Display Read-Only para NETWORKING -->
  <div class="cooperacao-item">
    <div class="coop-label">
      <strong>NETWORKING</strong>
      <span class="text-muted small">Cada equipe encaixa PILAR da cor oposta no pino central</span>
    </div>
    <div class="coop-status-container">
      <span class="coop-status" id="statusNetworking">✗</span>
      <span class="coop-pontos" id="ptsNetworking">0 pts</span>
    </div>
  </div>
  
  <!-- Checkbox Manual para INTEGRATION -->
  <div class="integration-check">
    <input type="checkbox" id="checkIntegration">
    <label for="checkIntegration">Ambos robôs no mesmo fluxo (Integration +4pts)</label>
    <small>Marque apenas se ambos robôs escalaram E estão no mesmo fluxo</small>
  </div>
  
  <div class="cooperacao-total">
    <strong>Total Cooperação: <span id="total-cooperacao">0</span> pts</strong>
    <small>(pontos somados para ambas as equipes)</small>
  </div>
</div>
```

#### Funcionalidades Implementadas:

**COOPETITION (Automático - 0 a 8pts)**:
- ✅ Detecta automaticamente quando ambas equipes têm PILAR na mesma posição N1
- ✅ Mostra 4 quadrados representando as 4 posições N1 (8, 9, 10, 11)
- ✅ Cada posição vale 2pts se ambas equipes tiverem PILAR
- ✅ Máximo: 8 pontos (4 posições × 2pts)
- ✅ Display read-only com status visual (✓ verde ou ✗ vermelho)
- ✅ Pontuação dinâmica (mostra pontos reais: 0, 2, 4, 6 ou 8pts)

**NETWORKING (Automático - 0 ou 6pts)**:
- ✅ Detecta automaticamente quando ambas equipes têm cor oposta no botão central
- ✅ Mostra mensagem de sucesso quando ativado
- ✅ Display read-only com status visual (✓ verde ou ✗ vermelho)
- ✅ Pontuação dinâmica (0pts ou 6pts)
- ✅ **REGRA ESPECIAL**: Botão central com cor oposta só vale se NETWORKING completo
  - Se NETWORKING completo: 0pts individuais + 6pts cooperação
  - Se NETWORKING incompleto: 0pts (INVÁLIDO)

**INTEGRATION (Manual com Validação - 0 ou 4pts)**:
- ✅ Checkbox abaixo da seção Escalada
- ✅ **Validação automática**: Só pode ser marcado se ambas equipes escalaram (8pts)
- ✅ Desabilita automaticamente se requisitos não atendidos
- ✅ Desmarca automaticamente se escalada mudar
- ✅ Feedback visual (cinza quando desabilitado)
- ✅ Tooltip explicativo
- ✅ Display read-only com status visual (✓ verde ou ✗ vermelho)
- ✅ Pontuação dinâmica (0pts ou 4pts)

#### Regras de Cooperação:

**B2 - Coopetition (+2 pontos CO-OP)**
- Condição: No nível 1 (N1) do mural, ambas equipes devem preencher os dois lados correspondentes com seus pilares
- Pontuação: 2 pontos CO-OP para cada pilar colocado em ambos lados
- Aplicação: Pontos somados ao total de ambas as equipes

**B3 - Networking (+6 pontos CO-OP)**
- Condição: No nível 2 (N2), existe um pino central cooperativo
- Requisito: Cada time deve encaixar uma peça da cor oposta (do outro time) nesse pino
- Pontuação: 6 pontos CO-OP ao completar
- Aplicação: Pontos somados ao total de ambas as equipes

**B4 - Integration (+4 pontos CO-OP)**
- Condição: Ao final da partida, ambos robôs devem subir e permanecer pendurados no mesmo fluxo
- Requisitos para validação:
  - Encostar diretamente no fluxo
  - Não tocar o chão
  - Permanecer válido por pelo menos 5 segundos após o fim da partida
- Pontuação: 4 pontos CO-OP
- Aplicação: Pontos somados ao total de ambas as equipes

#### Nota Importante:
> Os pontos de cooperação são somados ao total de **ambas as equipes**. Isso significa que se Coopetition for marcado, tanto a equipe verde quanto a azul recebem +2 pontos em seus totais finais.

---

### 6. **Placar Final**

#### Estrutura:
```html
<div class="placar-final">
  <div class="placar-equipe verde">
    <div class="placar-numero" id="placar-verde">00</div>
    <div class="placar-nome">Eletrobots</div>
  </div>
  <div class="placar-equipe azul">
    <div class="placar-numero" id="placar-azul">06</div>
    <div class="placar-nome">Technoibots</div>
  </div>
</div>
```

#### Estilo:
```css
.placar-numero {
  font-size: 6rem;
  font-weight: 800;
  line-height: 1;
}

.placar-equipe.verde .placar-numero {
  color: #4CAF50;
}

.placar-equipe.azul .placar-numero {
  color: #2196F3;
}
```

#### Funcionalidades:
- Atualização em tempo real
- Animação de transição ao mudar valor
- Formatação com zero à esquerda (00, 01, 02, etc.)

---

### 7. **Botão Finalizar**

#### Estrutura:
```html
<button class="btn-finalizar" id="btn-finalizar-partida">
  FINALIZAR PARTIDA
</button>
```

#### Funcionalidades:
- Validar dados antes de finalizar
- Mostrar resumo da partida
- **PLACEHOLDER**: Enviar dados para backend (implementação futura)
- Resetar formulário após confirmação

#### Validações:
```javascript
function validarPartida() {
  const erros = [];
  
  if (!juizSelecionado) erros.push("Selecione um juiz");
  if (!jogoSelecionado) erros.push("Selecione um jogo");
  if (!equipe1Selecionada) erros.push("Selecione a Equipe 1");
  if (!equipe2Selecionada) erros.push("Selecione a Equipe 2");
  if (equipe1Selecionada === equipe2Selecionada) {
    erros.push("As equipes devem ser diferentes");
  }
  
  return erros;
}
```

---

## 🔧 Especificações Técnicas

### Estrutura de Dados

#### Objeto Partida:
```javascript
const partida = {
  numeroJogo: 3,
  juiz: "Eduardo",
  dataHora: new Date().toISOString(),
  equipes: {
    verde: {
      nome: "Eletrobots",
      posicaoMural: 8, // ID da posição no campo
      chaoNoMural: 0,
      escalada: 0,
      pontosIndividuais: 0,
      pontosCooperacao: 0,
      pontosTotal: 0
    },
    azul: {
      nome: "Technoibots",
      posicaoMural: 6,
      chaoNoMural: 0,
      escalada: 8,
      pontosIndividuais: 6,
      pontosCooperacao: 0,
      pontosTotal: 6
    }
  },
  cooperacao: {
    coopetition: false,
    networking: false,
    integration: false
  }
};
```

### Cálculos de Pontuação

#### 1. Pontos do Mural - Sistema de PILARES:
```javascript
// Valores oficiais conforme manual do torneio
const pontosPorNivel = {
  'n1': 2,    // A4: PILAR encaixado no N1
  'n2': 3,    // A5: PILAR encaixado no N2
  'n3': 4     // A6: PILAR encaixado no N3
};

// Função para calcular pontos baseado em PILARES ativos
function calcularPontosMural(botoesAtivos) {
  let total = 0;
  botoesAtivos.forEach(botao => {
    const nivel = botao.dataset.nivel;
    total += pontosPorNivel[nivel];
  });
  return total;
}

// Exemplo de uso:
// Se equipe verde tem 2 botões N3 ativos, 1 botão N2 ativo:
// Total = (4 + 4) + 3 = 11 pontos
```

#### 2. Pontos de Chão:
```javascript
// Valor oficial: 1 ponto por PILAR no perímetro de 10cm do chão (Regra A3)
const PONTOS_POR_CHAO = 1;

function calcularPontosChao(quantidade) {
  return quantidade * PONTOS_POR_CHAO;
}
```

#### 3. Pontos de Escalada:
```javascript
// Valor oficial: 8 pontos por robô pendurado em FLUXO (Regra A2)
const PONTOS_ESCALADA = 8;

function calcularPontosEscalada(pendurado) {
  return pendurado ? PONTOS_ESCALADA : 0;
}
```

#### 4. Detecção Automática de COOPETITION:
```javascript
// Verifica cada uma das 4 posições N1 (8, 9, 10, 11)
function verificarCoopetition() {
  const botoesN1Verde = campoVerde.getBotoesAtivos('n1');
  const botoesN1Azul = campoAzul.getBotoesAtivos('n1');
  
  const posicoesVerde = botoesN1Verde.map(b => b.posicao);
  const posicoesAzul = botoesN1Azul.map(b => b.posicao);
  
  const posicoesN1 = [8, 9, 10, 11];
  const statusPosicoes = [];
  let pontosTotal = 0;
  
  posicoesN1.forEach(pos => {
    const ambosTemPilar = posicoesVerde.includes(pos) && posicoesAzul.includes(pos);
    statusPosicoes.push(ambosTemPilar);
    if (ambosTemPilar) {
      pontosTotal += 2; // 2 pontos por posição
    }
  });
  
  return {
    ativo: pontosTotal > 0,
    posicoes: statusPosicoes, // [pos8, pos9, pos10, pos11]
    pontos: pontosTotal // 0, 2, 4, 6 ou 8
  };
}
```

#### 5. Detecção Automática de NETWORKING:
```javascript
// Verifica se ambas equipes têm o botão central (posição 6) com cor oposta
function verificarNetworking() {
  const botaoCentralVerde = campoVerde.getBotaoCentral();
  const botaoCentralAzul = campoAzul.getBotaoCentral();
  
  // Verifica se ambos estão ativos com cor oposta
  const verdeTemAzul = botaoCentralVerde.dataset.estado === 'oposta' && 
                       botaoCentralVerde.dataset.corAtiva === 'azul';
  const azulTemVerde = botaoCentralAzul.dataset.estado === 'oposta' && 
                       botaoCentralAzul.dataset.corAtiva === 'verde';
  
  return verdeTemAzul && azulTemVerde;
}
```

#### 6. Validação do Botão Central:
```javascript
// ⚠️ REGRA ESPECIAL: Botão central com cor oposta só vale se NETWORKING completo
function calcularPontosBotaoCentral() {
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
```

**Tabela de Validação do Botão Central:**

| Verde Central | Azul Central | Verde Pts Individual | Azul Pts Individual | NETWORKING | Verde Total | Azul Total |
|---------------|--------------|----------------------|---------------------|------------|-------------|------------|
| OFF           | OFF          | 0                    | 0                   | ❌ 0pts    | 0           | 0          |
| Verde         | OFF          | 3                    | 0                   | ❌ 0pts    | 3           | 0          |
| **Azul**      | OFF          | **0** ❌             | 0                   | ❌ 0pts    | **0**       | 0          |
| OFF           | Azul         | 0                    | 3                   | ❌ 0pts    | 0           | 3          |
| OFF           | **Verde**    | 0                    | **0** ❌            | ❌ 0pts    | 0           | **0**      |
| Verde         | Azul         | 3                    | 3                   | ❌ 0pts    | 3           | 3          |
| **Azul**      | Azul         | **0** ❌             | 3                   | ❌ 0pts    | **0**       | 3          |
| Verde         | **Verde**    | 3                    | **0** ❌            | ❌ 0pts    | 3           | **0**      |
| **Azul**      | **Verde**    | **0**                | **0**               | **✅ 6pts** | **6**       | **6**      |

#### 5. Total da Equipe:
```javascript
function calcularTotalEquipe(equipe) {
  // Soma todos os botões ativos no mural
  const ptsMural = calcularPontosMural(equipe.botoesAtivos);
  
  // Pontos de chão (contador manual)
  const ptsChao = calcularPontosChao(equipe.chaoNoMural);
  
  // Pontos de escalada (dropdown)
  const ptsEscalada = equipe.escalada;
  
  // Pontos de cooperação (somados para ambas equipes)
  const ptsCoop = equipe.pontosCooperacao;
  
  return ptsMural + ptsChao + ptsEscalada + ptsCoop;
}
```

### Estilos CSS

#### Cores do Sistema:
```css
:root {
  /* Cores das equipes */
  --cor-verde: #4CAF50;
  --cor-verde-escuro: #388E3C;
  --cor-azul: #2196F3;
  --cor-azul-escuro: #1976D2;
  
  /* Cores neutras */
  --cor-fundo: #f4f5f7;
  --cor-texto: #333;
  --cor-borda: #ddd;
  
  /* Cores de destaque */
  --cor-sucesso: #4CAF50;
  --cor-alerta: #FF9800;
  --cor-erro: #F44336;
}
```

#### Layout Responsivo:
```css
/* Desktop */
@media (min-width: 992px) {
  .campo-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

/* Tablet */
@media (max-width: 991px) and (min-width: 576px) {
  .campo-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

/* Mobile */
@media (max-width: 575px) {
  .placar-numero {
    font-size: 4rem;
  }
  
  .campo-visual {
    max-width: 100%;
  }
}
```

---

## 🔌 Integrações Backend (Placeholders)

### 1. **Carregamento de Dados**

#### Função Mock:
```javascript
// PLACEHOLDER: Substituir por chamada real à API/Google Sheets
async function carregarDadosJogos() {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    juizes: ["Eduardo", "Maria", "João", "Ana"],
    equipes: [
      "Eletrobots",
      "Technoibots",
      "Robotic Warriors",
      "Tech Titans",
      "Cyber Dragons",
      "Mech Masters"
    ],
    jogos: [
      { numero: 1, equipe1: "Eletrobots", equipe2: "Technoibots", juiz: "Eduardo" },
      { numero: 2, equipe1: "Robotic Warriors", equipe2: "Tech Titans", juiz: "Maria" },
      { numero: 3, equipe1: "Cyber Dragons", equipe2: "Mech Masters", juiz: "João" }
    ]
  };
}

// TODO: Implementar integração real
// async function carregarDadosJogos() {
//   const sheetUrl = "URL_DA_PLANILHA_2026";
//   return await carregarSheetData(sheetUrl);
// }
```

### 2. **Envio de Resultados**

#### Função Mock:
```javascript
// PLACEHOLDER: Substituir por envio real ao Google Forms/API
async function enviarResultadoPartida(partida) {
  console.log("📤 Enviando resultado da partida:", partida);
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular sucesso
  return {
    sucesso: true,
    mensagem: "Partida registrada com sucesso!",
    timestamp: new Date().toISOString()
  };
}

// TODO: Implementar envio real
// async function enviarResultadoPartida(partida) {
//   const formUrl = "URL_DO_GOOGLE_FORM_2026";
//   const formData = converterParaFormData(partida);
//   return await submitToGoogleForms({ url: formUrl, data: formData });
// }
```

### 3. **Autenticação**

#### Placeholder:
```javascript
// PLACEHOLDER: Implementar autenticação futura
async function autenticar() {
  console.log("🔐 Autenticação desabilitada (modo desenvolvimento)");
  return { autenticado: true, usuario: "dev" };
}

// TODO: Implementar autenticação real
// async function autenticar() {
//   const hash = "HASH_SENHA_2026";
//   return await autenticar(hash, callback);
// }
```

### 4. **Estrutura de Dados para Backend**

#### Formato Google Forms (Futuro):
```javascript
// PLACEHOLDER: Estrutura para envio ao Google Forms
const googleFormData = {
  "entry.XXXXX": partida.numeroJogo,        // Número do jogo
  "entry.XXXXX": partida.juiz,              // Nome do juiz
  "entry.XXXXX": partida.equipes.verde.nome, // Equipe 1
  "entry.XXXXX": partida.equipes.azul.nome,  // Equipe 2
  "entry.XXXXX": partida.equipes.verde.pontosTotal, // Pontos Equipe 1
  "entry.XXXXX": partida.equipes.azul.pontosTotal,  // Pontos Equipe 2
  // ... adicionar mais campos conforme necessário
};

// TODO: Obter IDs reais dos campos do Google Form 2026
```

---

## ✅ Checklist de Implementação

### Fase 1: Estrutura Base
- [ ] Criar estrutura de diretórios
- [ ] Copiar imagem do mural para pasta assets
- [ ] Criar arquivo HTML base com Bootstrap
- [ ] Configurar arquivos CSS e JS
- [ ] Implementar layout responsivo básico

### Fase 2: Componentes de Seleção
- [ ] Implementar dropdown de Juiz
- [ ] Implementar dropdown de Próximo Jogo
- [ ] Implementar dropdowns de Equipes
- [ ] Criar dados mock para testes
- [ ] Implementar lógica de auto-preenchimento

### Fase 3: Campo de Jogo Visual
- [ ] Posicionar imagem do mural
- [ ] Criar overlay para botões
- [ ] Calcular e posicionar botões sobre os fluxos
- [ ] Implementar indicador visual do robô
- [ ] Adicionar feedback visual ao clicar
- [ ] Implementar lógica de movimentação

### Fase 4: Contador de Chão
- [ ] Criar interface do contador
- [ ] Implementar botões +1/-1
- [ ] Adicionar validações (não permitir negativos)
- [ ] Integrar com cálculo de pontos

### Fase 5: Escalada
- [ ] Criar dropdowns de escalada
- [ ] Adicionar opções de pontuação
- [ ] Implementar lógica de seleção
- [ ] Integrar com cálculo de pontos

### Fase 6: Pontos Individuais
- [ ] Criar display de pontos individuais
- [ ] Implementar cálculo de pontos do campo
- [ ] Implementar cálculo de pontos de chão
- [ ] Integrar pontos de escalada
- [ ] Adicionar animação de atualização

### Fase 7: Cooperação
- [ ] Criar interface de cooperação
- [ ] Implementar checkboxes
- [ ] Adicionar lógica de pontuação (placeholder)
- [ ] Integrar com total final

### Fase 8: Placar Final
- [ ] Criar display do placar
- [ ] Implementar atualização em tempo real
- [ ] Adicionar animação de transição
- [ ] Formatar números com zero à esquerda

### Fase 9: Finalização
- [ ] Implementar botão Finalizar Partida
- [ ] Criar validações de dados
- [ ] Implementar modal de confirmação
- [ ] Adicionar função de reset
- [ ] Implementar placeholder de envio

### Fase 10: Testes e Refinamentos
- [ ] Testar em diferentes resoluções
- [ ] Testar em diferentes navegadores
- [ ] Validar cálculos de pontuação
- [ ] Ajustar estilos e cores
- [ ] Otimizar performance

### Fase 11: Documentação
- [ ] Documentar código JavaScript
- [ ] Criar comentários explicativos
- [ ] Atualizar este documento com mudanças
- [ ] Criar guia de uso para juízes

### Fase 12: Preparação para Backend (Futuro)
- [ ] Documentar endpoints necessários
- [ ] Definir estrutura de dados para API
- [ ] Criar funções placeholder para integração
- [ ] Documentar campos do Google Forms

---

## 📝 Notas Técnicas

### Valores Mock e Placeholders

#### ⚠️ IMPORTANTE: Os seguintes valores são MOCK e devem ser ajustados:

1. **Pontuação do Campo (Mural)**
   - Valores atuais são estimativas
   - Aguardar regras oficiais do torneio 2026
   - Localização: `utils/pontuacao.js`

2. **Pontos de Chão**
   - Valor atual: 1 ponto por unidade
   - Confirmar com regras oficiais
   - Localização: `utils/pontuacao.js`

3. **Escalada**
   - Opções atuais: 0pts ou 8pts
   - Confirmar valores e condições
   - Localização: `qualificatorias/index.html`

4. **Cooperação**
   - Valores atuais: 0pts para todas
   - Definir condições e pontuações
   - Localização: `qualificatorias/script.js`

5. **Lista de Equipes**
   - Lista atual é exemplo
   - Atualizar com equipes reais de 2026
   - Localização: `utils/mock-data.js`

### Posicionamento dos Botões no Campo

#### Método de Posicionamento:
```css
.campo-visual {
  position: relative;
  width: 100%;
  max-width: 800px;
}

.campo-visual img {
  width: 100%;
  height: auto;
  display: block;
}

.botoes-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.btn-posicao {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #333;
  cursor: pointer;
  transform: translate(-50%, -50%);
}
```

#### Ajuste Fino:
- As coordenadas dos botões podem precisar de ajuste fino
- Testar em diferentes tamanhos de tela
- Considerar usar SVG overlay para precisão absoluta

### Performance

#### Otimizações Recomendadas:
1. **Lazy Loading**: Carregar imagem do mural apenas quando necessário
2. **Debounce**: Aplicar debounce em cálculos de pontuação
3. **Event Delegation**: Usar delegação de eventos para botões do campo
4. **CSS Animations**: Preferir CSS para animações (melhor performance)

### Acessibilidade

#### Considerações:
- [ ] Adicionar `aria-label` em todos os botões
- [ ] Garantir contraste adequado de cores
- [ ] Suportar navegação por teclado
- [ ] Adicionar `alt` text em imagens
- [ ] Testar com leitores de tela

### Compatibilidade

#### Navegadores Suportados:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### Dispositivos:
- Desktop (1920x1080 e superiores)
- Tablet (768x1024)
- Mobile (375x667 mínimo)

---

## 🚀 Próximos Passos

### Após Implementação Inicial:

1. **Obter Regras Oficiais**
   - Confirmar valores de pontuação
   - Validar mecânicas de jogo
   - Atualizar cálculos

2. **Integração Backend**
   - Configurar Google Sheets 2026
   - Criar Google Forms para envio
   - Implementar autenticação
   - Testar fluxo completo

3. **Páginas Adicionais**
   - Página de visualização de resultados
   - Cronograma de jogos
   - Ranking de equipes
   - Estatísticas do torneio

4. **Melhorias**
   - Modo offline
   - Sincronização automática
   - Histórico de partidas
   - Exportação de dados

---

## 📞 Contatos e Referências

### Documentação de Referência:
- Sistema 2025: `/Users/i589591/SAPDevelop/torneio-de-gravatai-2025/website/`
- Imagens Figma: `/Users/i589591/SAPDevelop/torneio-de-gravatai-2025/torneio-gravatai-2026-softwares-internos/imagens-software/`

### Arquivos Importantes:
- `website/
