import { submitToGoogleForms } from "./googleFormsSubmit.js";
import {carregarSheetData} from "../sheets-to-website/sheetUtils.js"
import { autenticar } from "../utils/autenticacao.js"

  const valor_n1 = 2;
  const valor_n2 = 3;
  const valor_n3 = 4;
  const valor_mov = 1;

  const correctHash = "82f9da246586a6360777328042cd05f674e5da8943c5aabf42f643352fc8a39a"
  window.onload = async function() {
    await autenticar(correctHash, async () => {
      await carregarDadosPartidasQualificatórias()
      atualizarNomeEquipe1()
      atualizarNomeEquipe2()
    })
  }

  async function carregarDadosPartidasQualificatórias(nomeJuiz) {
    const data = await carregarSheetData("https://docs.google.com/spreadsheets/d/1Dj8gcfgJWh5a1rL2cCuoEopNH9XobLSv5wWIKrNVeo8/edit?gid=70923099#gid=70923099")
    
    const selectJogo = document.getElementById("proxjogo")
    selectJogo.innerHTML = "" // limpa opções antigas
  
    // Agrupar por numeroJogo
    let jogosAgrupados = []
    data.forEach(jogo => {
      const num = jogo.numeroJogo
      const juiz = jogo.juiz
      if (!jogosAgrupados[num]) {
        jogosAgrupados[num] = { juiz: juiz, numeroJogo: num, equipes: [] }
      }
      jogosAgrupados[num].equipes.push(jogo.equipe)
    })
  
    if (nomeJuiz != undefined && nomeJuiz != "Selecione o juiz") {
      jogosAgrupados = jogosAgrupados.filter(jogo => jogo.juiz == nomeJuiz);
    }

    Object.values(jogosAgrupados).forEach(jogo => {
      const option = document.createElement("option")
      option.value = jogo.numeroJogo
      option.textContent = `N° ${jogo.numeroJogo}: ${jogo.equipes.join(" x ")}`
  
      option.dataset.equipe1 = jogo.equipes[0] || ""
      option.dataset.equipe2 = jogo.equipes[1] || ""
      selectJogo.appendChild(option)
    })
  
    selectJogo.addEventListener("change", function () {
      const opt = selectJogo.options[selectJogo.selectedIndex]
      if (opt) {
        const eq1 = opt.dataset.equipe1
        const eq2 = opt.dataset.equipe2
  
        const selectEquipe1 = document.getElementById("equipe1")
        const selectEquipe2 = document.getElementById("equipe2")
  
        const opt1 = Array.from(selectEquipe1.options).find(o => o.value == eq1)
        if (opt1) {
          selectEquipe1.value = eq1
        }
  
        const opt2 = Array.from(selectEquipe2.options).find(o => o.value == eq2)
        if (opt2) {
          selectEquipe2.value = eq2
        }
      }

      atualizarNomeEquipe1()
      atualizarNomeEquipe2()
    })
  }  

  function atualizarPontos() {
    const count_n1_x = parseInt(document.getElementById("span_count_n1_x").textContent);
    document.getElementById("span_result_n1_x").textContent = count_n1_x * valor_n1;
    atualizarCooperacao();
    atualizarTotais();
  }
  function atualizarPontosN2() {
    const count_n2_x = parseInt(document.getElementById("span_count_n2_x").textContent);
    document.getElementById("span_result_n2_x").textContent = count_n2_x * valor_n2;
    atualizarCooperacao();
    atualizarTotais();
  }
  function atualizarPontosN3() {
    const count_n3_x = parseInt(document.getElementById("span_count_n3_x").textContent);
    document.getElementById("span_result_n3_x").textContent = count_n3_x * valor_n3;
    atualizarCooperacao();
    atualizarTotais();
  }
  function atualizarPontosMov() {
    const count_mov_x = parseInt(document.getElementById("span_count_mov_x").textContent);
    document.getElementById("span_result_mov_x").textContent = count_mov_x * valor_mov;
    atualizarTotais();
  }

  window.add_materias_n1_x = function () {
    if ( getCountTotalMateriaisX() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_n1_x");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontos();
    atualizarTotais();
  }
  window.sub_materias_n1_x = function () {
    const span_count = document.getElementById("span_count_n1_x");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontos();
    atualizarTotais();
  }

  window.add_materias_n2_x = function () {
    if ( getCountTotalMateriaisX() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_n2_x");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontosN2();
    atualizarTotais();
  }
  window.sub_materias_n2_x = function () {
    const span_count = document.getElementById("span_count_n2_x");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontosN2();
    atualizarTotais();
  }

  window.add_materias_n3_x = function () {
    if ( getCountTotalMateriaisX() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_n3_x");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontosN3();
    atualizarTotais();
  }
  window.sub_materias_n3_x = function () {
    const span_count = document.getElementById("span_count_n3_x");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontosN3();
    atualizarTotais();
  }

  window.add_materias_mov_x = function () {
    if ( getCountTotalMateriaisX() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_mov_x");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontosMov();
    atualizarTotais();
  }
  window.sub_materias_mov_x = function () {
    const span_count = document.getElementById("span_count_mov_x");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontosMov();
    atualizarTotais();
  }

  function atualizarPontosY() {
    const count_n1_y = parseInt(document.getElementById("span_count_n1_y").textContent);
    document.getElementById("span_result_n1_y").textContent = count_n1_y * valor_n1;
    atualizarCooperacao();
    atualizarTotais();
  }
  function atualizarPontosN2Y() {
    const count_n2_y = parseInt(document.getElementById("span_count_n2_y").textContent);
    document.getElementById("span_result_n2_y").textContent = count_n2_y * valor_n2;
    atualizarCooperacao();
    atualizarTotais();
  }
  function atualizarPontosN3Y() {
    const count_n3_y = parseInt(document.getElementById("span_count_n3_y").textContent);
    document.getElementById("span_result_n3_y").textContent = count_n3_y * valor_n3;
    atualizarCooperacao();
    atualizarTotais();
  }
  function atualizarPontosMovY() {
    const count_mov_y = parseInt(document.getElementById("span_count_mov_y").textContent);
    document.getElementById("span_result_mov_y").textContent = count_mov_y * valor_mov;
    atualizarTotais();
  }

  function atualizarPontosFundacaoCoop() {
    const fundacao_coop = parseInt(document.getElementById("pontosCoopFundacao").value);
    document.getElementById("coop_fundacao").textContent = fundacao_coop;
    atualizarCooperacao()
    atualizarTotais();
  }

  function atualizarNomeEquipe1() {
    const equipe1 = document.getElementById("equipe1").value;
    document.getElementsByClassName("equipe1texto")[0].textContent = equipe1;
    document.getElementsByClassName("equipe1texto")[1].textContent = equipe1;
  }

  function atualizarNomeEquipe2() {
    const equipe2 = document.getElementById("equipe2").value;
    console.log(equipe2)
    document.getElementsByClassName("equipe2texto")[0].textContent = equipe2;
    document.getElementsByClassName("equipe2texto")[1].textContent = equipe2;
  }

  function getCountTotalMateriaisY() {
    const count_n1_y = parseInt(document.getElementById("span_count_n1_y").textContent);
    const count_n2_y = parseInt(document.getElementById("span_count_n2_y").textContent);
    const count_n3_y = parseInt(document.getElementById("span_count_n3_y").textContent);
    const count_mov_y = parseInt(document.getElementById("span_count_mov_y").textContent);

    const totalCountY = 1 + count_n1_y + count_n2_y + count_n3_y + count_mov_y;

    return totalCountY
  }

  function getCountTotalMateriaisX() {
    const count_n1_x = parseInt(document.getElementById("span_count_n1_x").textContent);
    const count_n2_x = parseInt(document.getElementById("span_count_n2_x").textContent);
    const count_n3_x = parseInt(document.getElementById("span_count_n3_x").textContent);
    const count_mov_x = parseInt(document.getElementById("span_count_mov_x").textContent);

    const totalCountX = 1 + count_n1_x + count_n2_x + count_n3_x + count_mov_x;

    return totalCountX
  }

  async function carregarPartidasJuiz() {
    const nome = document.getElementById("nomejuiz").value;
    await carregarDadosPartidasQualificatórias(nome)
  }

  window.add_materias_n1_y = function () {
    if ( getCountTotalMateriaisY() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_n1_y");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontosY();
    atualizarTotais();
  }
  window.sub_materias_n1_y = function () {
    const span_count = document.getElementById("span_count_n1_y");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontosY();
    atualizarTotais();
  }

  window.add_materias_n2_y = function () {
    if ( getCountTotalMateriaisY() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_n2_y");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontosN2Y();
    atualizarTotais();
  }
  window.sub_materias_n2_y = function () {
    const span_count = document.getElementById("span_count_n2_y");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontosN2Y();
    atualizarTotais();
  }

  window.add_materias_n3_y = function () {
    if ( getCountTotalMateriaisY() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_n3_y");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontosN3Y();
    atualizarTotais();
  }
  window.sub_materias_n3_y = function () {
    const span_count = document.getElementById("span_count_n3_y");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontosN3Y();
    atualizarTotais();
  }

  window.add_materias_mov_y = function () {
    if ( getCountTotalMateriaisY() > 8) {
      alert("Cada equipe possui somente 8 materiais, não é possivel adicionar mais materiais")
      return;
    }

    const span_count = document.getElementById("span_count_mov_y");
    span_count.textContent = parseInt(span_count.textContent) + 1;
    atualizarPontosMovY();
    atualizarTotais();
  }
  window.sub_materias_mov_y = function () {
    const span_count = document.getElementById("span_count_mov_y");
    span_count.textContent = parseInt(span_count.textContent) - 1;
    if (parseInt(span_count.textContent) < 0) {
      span_count.textContent = 0;
    }
    atualizarPontosMovY();
    atualizarTotais();
  }

  window.atualizarPontosFundacaoCoop = function () {
    atualizarPontosFundacaoCoop()
  }

  window.atualizarNomeEquipe1 = function () {
    atualizarNomeEquipe1()
  }

  window.atualizarNomeEquipe2 = function () {
    atualizarNomeEquipe2()
  }

  window.carregarPartidasJuiz = function () {
    carregarPartidasJuiz()
  }

  function atualizarCooperacao() {
  let coop_n1 = 0;
  let coop_n2 = 0;
  let coop_n3 = 0;
  let coop_todos_materiais = 0;

  const n1_x = parseInt(document.getElementById("span_result_n1_x").textContent);
  const n1_y = parseInt(document.getElementById("span_result_n1_y").textContent);

  const n2_x = parseInt(document.getElementById("span_result_n2_x").textContent);
  const n2_y = parseInt(document.getElementById("span_result_n2_y").textContent);

  const n3_x = parseInt(document.getElementById("span_result_n3_x").textContent);
  const n3_y = parseInt(document.getElementById("span_result_n3_y").textContent);

  if (n1_x > 0 && n1_y > 0) coop_n1 = 5;
  if (n2_x > 0 && n2_y > 0) coop_n2 = 5;
  if (n3_x > 0 && n3_y > 0) coop_n3 = 5;

  const count_n1_x = parseInt(document.getElementById("span_count_n1_x").textContent);
  const count_n2_x = parseInt(document.getElementById("span_count_n2_x").textContent);
  const count_n3_x = parseInt(document.getElementById("span_count_n3_x").textContent);
  const count_n1_y = parseInt(document.getElementById("span_count_n1_y").textContent);
  const count_n2_y = parseInt(document.getElementById("span_count_n2_y").textContent);
  const count_n3_y = parseInt(document.getElementById("span_count_n3_y").textContent);

  if (count_n1_x + count_n1_y + count_n2_x + count_n2_y + count_n3_x + count_n3_y >= 16) coop_todos_materiais = 5;
  
  document.getElementById("coop_n1").textContent = coop_n1;
  document.getElementById("coop_n2").textContent = coop_n2;
  document.getElementById("coop_n3").textContent = coop_n3;
  document.getElementById("coop_todos_materiais").textContent = coop_todos_materiais;

  const coop_fundacao = parseInt(document.getElementById("pontosCoopFundacao").value);

  const total_coop = coop_n1 + coop_n2 + coop_n3 + coop_todos_materiais + coop_fundacao;
  document.getElementById("coop_total").textContent = total_coop;
  atualizarTotais();
}

function atualizarTotais() {
  // Pontos por nível para Equipe X
  const n1_x = parseInt(document.getElementById("span_result_n1_x").textContent);
  const n2_x = parseInt(document.getElementById("span_result_n2_x").textContent);
  const n3_x = parseInt(document.getElementById("span_result_n3_x").textContent);
  const mov_x = parseInt(document.getElementById("span_result_mov_x").textContent);

  // Pontos por nível para Equipe Y
  const n1_y = parseInt(document.getElementById("span_result_n1_y").textContent);
  const n2_y = parseInt(document.getElementById("span_result_n2_y").textContent);
  const n3_y = parseInt(document.getElementById("span_result_n3_y").textContent);
  const mov_y = parseInt(document.getElementById("span_result_mov_y").textContent);

  // Cooperação
  const coop_n1 = parseInt(document.getElementById("coop_n1").textContent);
  const coop_n2 = parseInt(document.getElementById("coop_n2").textContent);
  const coop_n3 = parseInt(document.getElementById("coop_n3").textContent);
  const coop_fundacao = parseInt(document.getElementById("pontosCoopFundacao").value);
  const coop_todos_materiais = parseInt(document.getElementById("coop_todos_materiais").textContent);

  const coop_total_x = (coop_n1 > 0 ? 5 : 0) + (coop_n2 > 0 ? 5 : 0) + (coop_n3 > 0 ? 5 : 0) + coop_fundacao + coop_todos_materiais;
  const coop_total_y = coop_total_x;

  const total_x = n1_x + n2_x + n3_x + mov_x + coop_total_x;
  const total_y = n1_y + n2_y + n3_y + mov_y + coop_total_y;

  document.getElementById("total-vermelho").textContent = total_x;
  document.getElementById("total-azul").textContent = total_y;
}

  document
    .getElementById("myCustomForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const numJogo = parseInt(document.getElementById("proxjogo").value)
      
      const nomeTimeX = document.getElementById("equipe1").value
      const pontosN1X = parseInt(document.getElementById("span_result_n1_x").textContent)
      const pontosN2X = parseInt(document.getElementById("span_result_n2_x").textContent)
      const pontosN3X = parseInt(document.getElementById("span_result_n3_x").textContent)
      const pontosMovX = parseInt(document.getElementById("span_result_mov_x").textContent)
      const pontosIndividuaisX = pontosN1X + pontosN2X + pontosN3X + pontosMovX

      const nomeTimeY = document.getElementById("equipe2").value
      const pontosN1Y = parseInt(document.getElementById("span_result_n1_y").textContent)
      const pontosN2Y = parseInt(document.getElementById("span_result_n2_y").textContent)
      const pontosN3Y = parseInt(document.getElementById("span_result_n3_y").textContent)
      const pontosMovY = parseInt(document.getElementById("span_result_mov_y").textContent)
      const pontosIndividuaisY = pontosN1Y + pontosN2Y + pontosN3Y + pontosMovY

      const coopN1 = parseInt(document.getElementById("coop_n1").textContent)
      const coopN2 = parseInt(document.getElementById("coop_n2").textContent)
      const coopN3 = parseInt(document.getElementById("coop_n3").textContent)
      const coop_fundacao = parseInt(document.getElementById("pontosCoopFundacao").value);
      const coop_todos_materiais = parseInt(document.getElementById("coop_todos_materiais").textContent);

      const pontosCoop = coopN1 + coopN2 + coopN3 + coop_fundacao + coop_todos_materiais;

      const googleFormDataX = {
        "entry.1589049360": numJogo, //numero jogo
        "entry.716767655": nomeTimeX, //nome time
        "entry.1061580246": pontosIndividuaisX, // pontos individuais
        "entry.1383902084": pontosCoop, // pontos coop
        "entry.419185435" : pontosN1X, //n1
        "entry.1906481613" : pontosN2X, //n2
        "entry.1224200259" : pontosN3X, //n3
        "entry.2036116284" : pontosMovX //mov
      };

      const googleFormDataY = {
        "entry.1589049360": numJogo, //numero jogo
        "entry.716767655": nomeTimeY, //nome time
        "entry.1061580246": pontosIndividuaisY, // pontos individuais
        "entry.1383902084"  : pontosCoop, // pontos coop
        "entry.419185435" : pontosN1Y, //n1
        "entry.1906481613" : pontosN2Y, //n2
        "entry.1224200259" : pontosN3Y, //n3
        "entry.2036116284" : pontosMovY //mov
      };

      console.log(`
      n1x - ${pontosN1X}
      n2x - ${pontosN2X}
      n3x - ${pontosN3X}
      movx - ${pontosMovX}
      coop - ${pontosCoop}
      `)

      console.log(`
      n1x - ${pontosN1Y}
      n2x - ${pontosN2Y}
      n3x - ${pontosN3Y}
      movx - ${pontosMovY}
      coop - ${pontosCoop}
      `)

      const loadingEnvioDados = document.getElementById("loadingEnvioDados")
      loadingEnvioDados.innerText = "Enviando dados..."

      try {
        await submitToGoogleForms({
          url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdnXoIhHymASG9yfasIBmk6bYtF4g3cT3tgg6_tIuGIvVvJEA/formResponse",
          data: googleFormDataX,
        });

        console.log("Form 1 submitted successfully:", googleFormDataX);

        await submitToGoogleForms({
          url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdnXoIhHymASG9yfasIBmk6bYtF4g3cT3tgg6_tIuGIvVvJEA/formResponse",
          data: googleFormDataY,
        });

        console.log("Form 2 submitted successfully:", googleFormDataY);

        loadingEnvioDados.innerText = "Dados enviados com sucesso"

        alert("Enviado com sucesso");

        window.location.replace(window.location.href);
        
      } catch (err) {
        console.error("Submission error:", err);
        alert("Failed to submit the form.");
      }
    });