function extractSheetIdFromUrl(sheetUrl) {
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = sheetUrl.match(regex);
  return match ? match[1] : null;
}

function extractGidFromUrl(sheetUrl) {
  const regex = /[?&]gid=(\d+)/;
  const match = sheetUrl.match(regex);
  return match ? match[1] : null;
}

// Divide UMA linha de CSV respeitando campos entre aspas (que podem conter
// vírgulas) e aspas escapadas ("").  Ex.: '"1, 8 ou 3","Terceiro"' -> ['1, 8 ou 3','Terceiro']
function parseCsvLine(line) {
  const campos = [];
  let atual = '';
  let dentroAspas = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (dentroAspas) {
      if (c === '"') {
        if (line[i + 1] === '"') { atual += '"'; i++; } // aspas escapadas
        else dentroAspas = false;
      } else {
        atual += c;
      }
    } else if (c === '"') {
      dentroAspas = true;
    } else if (c === ',') {
      campos.push(atual);
      atual = '';
    } else {
      atual += c;
    }
  }
  campos.push(atual);
  return campos.map((v) => v.trim());
}

async function carregarSheetData(sheetUrl) {
  return new Promise((resolve, reject) => {
    const sheetId = extractSheetIdFromUrl(sheetUrl);
    const gid = extractGidFromUrl(sheetUrl);
    if (!sheetId || !gid) return reject("URL inválida ou sem 'gid'");

    const sheetCSVUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
    console.log("📥 Buscando planilha:", sheetCSVUrl);

    fetch(sheetCSVUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Erro ao acessar a planilha: ${response.status}`);
        return response.text();
      })
      .then((text) => {
        console.log("📄 Resposta recebida da planilha:", text.slice(0, 300));

        if (text.includes('/*O_o*/')) {
          const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
          if (!match) throw new Error('Resposta da planilha não pôde ser parseada');
          const dataJson = JSON.parse(match[1]);
          const table = dataJson.table;
          const headers = (table.cols || []).map((col) => col.label || col.id || '');
          const rows = (table.rows || []).map((row) => {
            const values = (row.c || []).map((cell) => {
              if (!cell) return '';
              return cell.v ?? cell.f ?? '';
            });
            const obj = {};
            headers.forEach((header, i) => (obj[header] = values[i]));
            return obj;
          });
          resolve(rows);
          return;
        }

        const lines = text.trim().split(/\r?\n/).filter(Boolean);
        if (!lines.length) {
          resolve([]);
          return;
        }

        const headers = parseCsvLine(lines[0]);
        const data = lines.slice(1).map((line) => {
          const values = parseCsvLine(line);
          const obj = {};
          headers.forEach((header, i) => (obj[header] = values[i]));
          return obj;
        });

        resolve(data);
      })
      .catch((err) => {
        console.error('❌ Falha ao carregar planilha:', err);
        reject(err.message || err);
      });
  });
}

if (typeof window !== 'undefined') {
  window.carregarSheetData = carregarSheetData;
}

export { carregarSheetData, extractSheetIdFromUrl, extractGidFromUrl };
