class Match {
  type; //online or local
  numPlayers;
  players; //list
  hostName; // who is the host
  id; // id so it can be identified in backend
  finalScore;
  constructor(type, nPlayers, listPlayers, host) {
    this.type = type;
    this.numPlayers = nPlayers;
    this.players = listPlayers;
    this.hostName = host;
    if (type == "local") {
      //game start?
    } else if (type == "online") {
      //send msg to backend to inform it that match was created with this players and who the host is
      //in return server gives match its id
      //after that match starts at host and clients
      //after game ends inform backend and share result, also each player in the game should have access to it
      //this.finalScore = smthing
    }
  }
}