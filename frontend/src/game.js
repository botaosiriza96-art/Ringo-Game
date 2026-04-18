// game.js - lógica básica do jogo

class Game {
    constructor() {
        this.players = [];
        this.pot = 0; // dinheiro acumulado
        this.entryFee = 50; // cada jogador paga 50MT
    }

    // entrar no jogo
    joinGame(player) {
        if (!player.name || player.balance < this.entryFee) {
            return "Jogador inválido ou saldo insuficiente";
        }

        player.balance -= this.entryFee;
        this.pot += this.entryFee;

        this.players.push(player);

        return `${player.name} entrou no jogo`;
    }

    // escolher vencedor aleatório
    pickWinner() {
        if (this.players.length < 2) {
            return "Precisa de pelo menos 2 jogadores";
        }

        const winnerIndex = Math.floor(Math.random() * this.players.length);
        const winner = this.players[winnerIndex];

        // vencedor leva 70% do pot
        const prize = this.pot * 0.7;
        winner.balance += prize;

        // reset jogo
        this.players = [];
        this.pot = 0;

        return {
            winner: winner.name,
            prize: prize
        };
    }

    // mostrar jogadores
    listPlayers() {
        return this.players.map(p => p.name);
    }
}

// Exemplo de uso
const game = new Game();

let player1 = { name: "João", balance: 200 };
let player2 = { name: "Maria", balance: 200 };

console.log(game.joinGame(player1));
console.log(game.joinGame(player2));

console.log("Jogadores:", game.listPlayers());

console.log(game.pickWinner());
