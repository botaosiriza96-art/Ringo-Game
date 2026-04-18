const { Server } = require("socket.io");
const { handlePayment, deductEntry } = require("./payment");

let games = {};

module.exports = function (server) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("User conectado");

    socket.on("createGame", () => {
      const id = Date.now().toString();

      games[id] = {
        id,
        players: [],
        scores: {},
        phase: 1,
        status: "waiting",
        startTime: null
      };

      socket.emit("gameCreated", games[id]);
    });

    socket.on("joinGame", ({ gameId, player }) => {
      let game = games[gameId];

      if (!game) return socket.emit("error", "Jogo não existe");

      try {
        deductEntry(player, process.env.ENTRY_FEE);
      } catch (e) {
        return socket.emit("error", e);
      }

      game.players.push(player);
      game.scores[player] = 0;

      socket.join(gameId);

      if (game.players.length === 10) {
        game.status = "playing";
        game.startTime = Date.now();
      }

      io.to(gameId).emit("update", game);
    });

    socket.on("score", ({ gameId, player, score }) => {
      let game = games[gameId];
      if (!game) return;

      game.scores[player] += score;

      checkPhase(game, io);
    });
  });
};

function checkPhase(game, io) {
  const now = Date.now();
  const elapsed = (now - game.startTime) / 1000;

  let duration =
    game.phase == 3
      ? process.env.FINAL_TIME
      : process.env.PHASE1_TIME;

  if (elapsed < duration) return;

  let ranking = Object.entries(game.scores)
    .sort((a, b) => b[1] - a[1])
    .map((p) => p[0]);

  if (game.phase === 1) {
    game.players = ranking.slice(0, 7);
    game.phase = 2;
  } else if (game.phase === 2) {
    game.players = ranking.slice(0, 4);
    game.phase = 3;
  } else {
    game.winner = ranking[0];
    game.status = "finished";

    const total = game.players.length * process.env.ENTRY_FEE;
    const prize = total * process.env.WIN_PERCENT;

    handlePayment(game.winner, prize);
  }

  game.scores = {};
  game.players.forEach(p => game.scores[p] = 0);

  game.startTime = Date.now();

  io.to(game.id).emit("update", game);
}deductEntry(player, process.env.ENTRY_FEE);
