  import { submitToGoogleForms } from "./googleFormsSubmit.js";
  import {carregarSheetData} from "../sheets-to-website/sheetUtils.js"
    const valor_n1 = 2;
    const valor_n2 = 3;
    const valor_n3 = 4;
    const valor_mov = 1;
  
    window.onload = async function() {
      await carregarDadosPartidasEliminatorias()
  
      atualizarNomeEquipe1()
      atualizarNomeEquipe2()
    }
  
  
    async function carregarDadosPartidasEliminatorias(nomeJuiz) {
      const data = await carregarSheetData("https://docs.google.com/spreadsheets/d/1Dj8gcfgJWh5a1rL2cCuoEopNH9XobLSv5wWIKrNVeo8/edit?gid=915910798#gid=915910798")    
  
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
        jogosAgrupados[num].equipes.push(jogo.alianca)
      })
    
      // if (nomeJuiz != undefined && nomeJuiz != "Selecione o juiz") {
      //   jogosAgrupados = jogosAgrupados.filter(jogo => jogo.juiz == nomeJuiz);
      // }
  
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

          const selectAlianca = document.getElementById("escolhaalianca");

          selectAlianca.innerHTML = ""

          // Adiciona placeholder novamente
          const placeholder = document.createElement("option")
          placeholder.value = "selectalianca"
          placeholder.textContent = "Selecione a aliança"
          placeholder.selected = true
          placeholder.disabled = true
          selectAlianca.appendChild(placeholder)

          const option1 = document.createElement("option")
          option1.value = eq1;
          option1.textContent = eq1;

          const option2 = document.createElement("option")
          option2.value = eq2;
          option2.textContent = eq2;

          selectAlianca.appendChild(option1)
          selectAlianca.appendChild(option2)
        }
  
        atualizarNomeEquipe1()
        atualizarNomeEquipe2()
      })

      const escolhaAlianca = document.getElementById("escolhaalianca")
      escolhaAlianca.addEventListener("change", function() {
        const alianca = this.value;
        console.log("alianca atual", alianca)

        carregarDadosAlianca(alianca);
        
        document.getElementById("equipetexto").textContent = alianca;
      }
      )
    }  


    async function carregarDadosAlianca(nomeAlianca) {
      const data = await carregarSheetData("https://docs.google.com/spreadsheets/d/1Dj8gcfgJWh5a1rL2cCuoEopNH9XobLSv5wWIKrNVeo8/edit?gid=618653627#gid=618653627")
  
      const aliancaSelecionada = data.filter(alianca => {
        return alianca.Alianca == nomeAlianca
      })

      const selectEquipe1 = document.getElementById("equipe1")
      const selectEquipe2 = document.getElementById("equipe2")
  
      console.log(aliancaSelecionada[0].equipe1);
      console.log(aliancaSelecionada[0].equipe2);

      const opt1 = Array.from(selectEquipe1.options).find(o => o.value == aliancaSelecionada[0].equipe1)
      if (opt1) {
        selectEquipe1.value = aliancaSelecionada[0].equipe1
      }

      const opt2 = Array.from(selectEquipe2.options).find(o => o.value == aliancaSelecionada[0].equipe2)
      if (opt2) {
        selectEquipe2.value = aliancaSelecionada[0].equipe2
      }

      atualizarNomeEquipe1()
      atualizarNomeEquipe2()
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
    }
  
    function atualizarNomeEquipe2() {
      const equipe2 = document.getElementById("equipe2").value;
      console.log(equipe2)
      document.getElementsByClassName("equipe2texto")[0].textContent = equipe2;
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
      await carregarDadosPartidasEliminatorias(nome)
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
  
    const coop_total = (coop_n1 > 0 ? 5 : 0) + (coop_n2 > 0 ? 5 : 0) + (coop_n3 > 0 ? 5 : 0) + coop_fundacao + coop_todos_materiais;
  
    const total_x = n1_x + n2_x + n3_x + mov_x;
    const total_y = n1_y + n2_y + n3_y + mov_y;
  
    const pontosAlianca = total_x + total_y + coop_total;

    document.getElementById("total-roxo").textContent = pontosAlianca;
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
  
        const pontosAlianca = pontosIndividuaisX + pontosIndividuaisY + pontosCoop ;
        
        const numAlianca = document.getElementById("equipetexto").textContent;
  
        const googleFormDataAlianca = {
          "entry.1589049360": numJogo, //numero jogo
          "entry.716767655": numAlianca, // alianca
          "entry.86012266": nomeTimeX, // equipe 1
          "entry.866820261": nomeTimeY, //equipe 2
          "entry.1061580246": pontosAlianca, //pontos da aliança
          "entry.1218931186": pontosN1X, //n1 eq 1
          "entry.262617962": pontosN1Y, // n1 eq 2
          "entry.1369711065": pontosN2X, // n2 eq 1
          "entry.2082449627" : pontosN2Y, //n2 eq 2
          "entry.1968677865" : pontosN3X, //n3 eq 1
          "entry.573368645" : pontosN3Y, //n3 eq 2
          "entry.78480603" : pontosMovX, //mov eq 1
          "entry.462795434" : pontosMovY, //mov eq 2
        };
        
        const loadingEnvioDados = document.getElementById("loadingEnvioDados")
        loadingEnvioDados.innerText = "Enviando dados..."
  
        try {
          await submitToGoogleForms({
            url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSei5WyhMRGNGq7hHhMgZaM6LNTF24VDYT_wVRMZ1M6HmPa2rQ/formResponse",
            data: googleFormDataAlianca,
          });
  
          console.log("Form 1 submitted successfully:", googleFormDataAlianca);
  
          loadingEnvioDados.innerText = "Dados enviados com sucesso"
  
          alert("Enviado com sucesso");
  
          window.location.replace(window.location.href);
          
        } catch (err) {
          console.error("Submission error:", err);
          alert("Failed to submit the form.");
        }
      });