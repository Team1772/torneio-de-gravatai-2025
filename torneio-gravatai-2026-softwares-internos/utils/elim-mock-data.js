// ===================================
// DADOS MOCK PARA ELIMINATÓRIAS
// ===================================

/**
 * Função para carregar dados mock das eliminatórias
 * PLACEHOLDER: Substituir por carregamento real do Google Sheets
 * 
 * Formato baseado no script legado (scriptEliminartoria.js):
 * - aliancas: { "AliançaX": [equipe1, equipe2] }
 * - jogos: { numero, alianca1, alianca2, juiz }
 */
async function carregarDadosMock() {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        juizes: [
            "Eduardo",
            "Maria",
            "João",
            "Ana"
        ],

        // 8 alianças, cada uma com 2 equipes
        aliancas: {
            "Aliança1": ["Eletrobots", "Technoibots"],
            "Aliança2": ["Robotic Warriors", "Tech Titans"],
            "Aliança3": ["Cyber Dragons", "Mech Masters"],
            "Aliança4": ["Code Ninjas", "Robo Legends"],
            "Aliança5": ["Tech Pioneers", "Digital Innovators"],
            "Aliança6": ["Quantum Bots", "Iron Sapiens"],
            "Aliança7": ["Neo Circuit", "Volt Riders"],
            "Aliança8": ["Spark Masters", "Nano Bytes"]
        },

        // Confrontos entre alianças (formato: N° X: AliançaX x AliançaY)
        jogos: [
            { numero: 1, alianca1: "Aliança1", alianca2: "Aliança2", juiz: "Eduardo" },
            { numero: 2, alianca1: "Aliança6", alianca2: "Aliança3", juiz: "Maria" },
            { numero: 3, alianca1: "Aliança4", alianca2: "Aliança7", juiz: "João" },
            { numero: 4, alianca1: "Aliança8", alianca2: "Aliança5", juiz: "Ana" },
            { numero: 5, alianca1: "Aliança2", alianca2: "Aliança4", juiz: "Eduardo" },
            { numero: 6, alianca1: "Aliança3", alianca2: "Aliança8", juiz: "Maria" }
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