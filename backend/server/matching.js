const game = require("./gameState");

module.exports = () => {
  let players = {},
    onWait = [],
    onMatch = {};

  const loop = setInterval(checkQueue, 5000);

  function checkQueue() {
    //Print Value of the user pool
    console.info(
      `Queues: {Players: ${Object.keys(players).length}, OnWait: ${
        onWait.length
      }, onMatch:${Object.keys(onMatch).length}}`
    );
    while (onWait.length >= 2) {
      console.log("Constructing room... 🏗");
      const p1 = players[onWait.pop()].user;
      const p2 = players[onWait.pop()].user;
      console.log(`We created a match for ${p1.name} and ${p2.name}`);
      createMatch(p1.id,p2.id);
    }
  }

  function createMatch(p1ID, p2ID) {
    const roomId = p1ID + "|" + p2ID;
    players[p1ID].roomId = roomId;
    players[p2ID].roomId = roomId;
    if (!onMatch)
      onMatch[roomId] = game.newGame({
        players: [players[p1ID], players[p2ID]],
        roomId: roomId,
      });
    players[p1ID].socket.emit(
      "gameState",
      game.newGame({
        players: [players[p1ID], players[p2ID]],
        roomId: roomId,
        playerId: 0,
        opponentId: 1
      })
    );
    players[p2ID].socket.emit(
      "gameState",
      game.newGame({
        players: [players[p1ID], players[p2ID]],
        roomId: roomId,
        playerId: 1,
        opponentId: 0
      })
    );
  }
  return {
    userConnect: ({ socket, user }) => {
      if (!players[socket.id]) {
        players[socket.id] = { user, socket };
        onWait.push(socket.id);
      }
    },
    clear: () => clearInterval(loop),
    userDisconnect: id => {
      console.log("On disconnect", id);
      if (players[id].roomId && onMatch[players[id].roomId]) {
        const roomId = players[id].roomId;
        onMatch[roomId].players.map(player => onWait.push(player.id));
        delete onMatch[players[id].roomId];
        if (!onMatch) onMatch = {};
      }

      onWait = onWait.filter(el => el !== id);

      if (players[id]) {
        delete players[id];
        if (!players) players = {};
      }
    }
  };
};
