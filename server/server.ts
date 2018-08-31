import ChatroomManager from "./ChatroomManager";
import ClientManager from "./ClientManager";
import Handlers from "./handlers";

const server = require("http").createServer();
const io = require("socket.io")(server);

const clientManager = new ClientManager();
const chatroomManager = new ChatroomManager();

io.on("connection", (client) => {
    const {
        handleRegister,
        handleJoin,
        handleLeave,
        handleMessage,
        handleGetChatrooms,
        handleGetAvailableUsers,
        handleDisconnect,
    } = Handlers(client, clientManager, chatroomManager);

    console.log("client connected...", client.id);
    clientManager.addClient(client);

    client.on("register", handleRegister);

    client.on("join", handleJoin);

    client.on("leave", handleLeave);

    client.on("message", handleMessage);

    client.on("chatrooms", handleGetChatrooms);

    client.on("availableUsers", handleGetAvailableUsers);

    client.on("disconnect", function() {
        console.log("client disconnect...", client.id);
        handleDisconnect();
    });
    client.on("error", function(err) {
        console.log("received error from client:", client.id);
        console.log(err);
    });
});
server.on("error", (e) => {
    console.log(e);
    throw e;
});
server.listen(3000, function(err) {
    if (err) {
        throw err;
    }
    console.log("listening on port 3000");
});
