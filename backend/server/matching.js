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
      const p1 = players[onWait.pop()].user.name;
      const p2 = players[onWait.pop()].user.name;
      console.log(`We created a match for ${p1} and ${p2}`);
    }
  }

  function createMatch(p1ID, p2ID) {
      const roomID = p1ID +'|'+ p2ID;
      players[p1ID].roomID = roomID;
      players[p2ID].roomID = roomID;
      if (!onMatch) onMatch[roomID] = {}
      players[p1ID].socket.emit("gameState",{});
      players[p2ID].socket.emit("gameState",{});
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
      if (players[id].roomID && onMatch[players[id].roomID]) {
        const roomID = players[id].roomID;
        onMatch[roomID].players.map(player => onWait.push(player.id));
        delete onMatch[players[id].roomID];
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
