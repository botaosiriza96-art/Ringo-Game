const redis = require("redis");

const client = redis.createClient({
  url: "redis://redis:6379"
});

client.connect();

client.on("connect", () => {
  console.log("Redis conectado");
});

// salvar dados temporários
async function setCache(key, value) {
  await client.set(key, JSON.stringify(value));
}

// pegar dados
async function getCache(key) {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

// apagar cache
async function deleteCache(key) {
  await client.del(key);
}

module.exports = {
  client,
  setCache,
  getCache,
  deleteCache
};
