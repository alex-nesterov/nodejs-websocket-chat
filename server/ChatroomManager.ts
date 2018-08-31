import Chatroom from "./Chatroom";
const chatroomTemplates = require("./../config/chatrooms");

export default class ChatroomManager {

    public chatrooms = new Map(
        chatroomTemplates.map((c) => [
            c.name,
            new Chatroom(c.name, c.image),
        ]),
    );

    public removeClient(client) {
        this.chatrooms.forEach((c: Chatroom) => c.removeUser(client));
    }

    public getChatroomByName(chatroomName) {
        return this.chatrooms.get(chatroomName);
    }

    public serializeChatrooms() {
        return Array.from(this.chatrooms.values()).map((c: Chatroom) => c.serialize());
    }
}
