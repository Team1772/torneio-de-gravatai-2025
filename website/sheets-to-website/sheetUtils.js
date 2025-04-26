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

function carregarSheetData(sheetUrl) {
  return new Promise((resolve, reject) => {
    const sheetId = extractSheetIdFromUrl(sheetUrl);
    const gid = extractGidFromUrl(sheetUrl);
    if (!sheetId || !gid) return reject("URL inválida ou sem 'gid'");

    const sheetCSVUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

    fetch(sheetCSVUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao acessar a planilha");
        return response.text();
      })
      .then((csvText) => {
        const rows = csvText.trim().split("\n");
        const headers = rows[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        const data = rows.slice(1).map((row) => {
          const values = row.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
          const obj = {};
          headers.forEach((header, i) => (obj[header] = values[i]));
          return obj;
        });
        resolve(data);
      })
      .catch((err) => reject(err.message));
  });
}

window.carregarSheetData = carregarSheetData;
