const fs = require("fs");

const DB_FILE = "db.json";

// carregar dados
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      users: {},
      games: {},
      transactions: []
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(DB_FILE));
}

// salvar dados
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// pegar base
function getDB() {
  return loadDB();
}

// atualizar base
function updateDB(newData) {
  saveDB(newData);
}

module.exports = {
  getDB,
  updateDB
};
