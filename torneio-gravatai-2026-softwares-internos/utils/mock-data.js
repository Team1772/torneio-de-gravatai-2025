// ===================================
// DADOS MOCK PARA DESENVOLVIMENTO
// ===================================

/**
 * Função para carregar dados mock
 * PLACEHOLDER: Substituir por carregamento real do Google Sheets
 */
export async function carregarDadosMock() {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        juizes: [
            "Eduardo",
            "Maria",
            "João",
            "Ana"
        ],
        
        equipes: [
            "Eletrobots",
            "Technoibots",
            "Robotic Warriors",
            "Tech Titans",
            "Cyber Dragons",
            "Mech Masters",
            "Code Ninjas",
            "Robo Legends",
            "Tech Pioneers",
            "Digital Innovators"
        ],
        
        jogos: [
            { numero: 1, equipe1: "Eletrobots", equipe2: "Technoibots", juiz: "Eduardo" },
            { numero: 2, equipe1: "Robotic Warriors", equipe2: "Tech Titans", juiz: "Maria" },
            { numero: 3, equipe1: "Cyber Dragons", equipe2: "Mech Masters", juiz: "João" },
            { numero: 4, equipe1: "Code Ninjas", equipe2: "Robo Legends", juiz: "Ana" },
            { numero: 5, equipe1: "Tech Pioneers", equipe2: "Digital Innovators", juiz: "Eduardo" },
            { numero: 6, equipe1: "Eletrobots", equipe2: "Robotic Warriors", juiz: "Maria" },
            { numero: 7, equipe1: "Technoibots", equipe2: "Tech Titans", juiz: "João" },
            { numero: 8, equipe1: "Cyber Dragons", equipe2: "Code Ninjas", juiz: "Ana" }
        ]
    };
}

/**
 * TODO: Implementar carregamento real do Google Sheets
 * 
 * export async function carregarDadosReais() {
 *     const sheetUrl = "URL_DA_PLANILHA_2026";
 *     const response = await fetch(sheetUrl);
 *     const data = await response.json();
 *     return processarDados(data);
 * }
 */
