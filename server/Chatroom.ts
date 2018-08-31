export default class Chatroom {

    public members = new Map();
    public chatHistory = [];
    public name: string;
    public image: string;

    public constructor(name, image) {
        this.name = name;
        this.image = image;
    }

    public broadcastMessage(message) {
        this.members.forEach((m) => m.emit("message", message));
    }

    public addEntry(entry) {
        this.chatHistory = this.chatHistory.concat(entry);
    }

    public getChatHistory() {
        return this.chatHistory.slice();
    }

    public addUser(client) {
        this.members.set(client.id, client);
    }

    public removeUser(client) {
        this.members.delete(client.id);
    }

    public serialize() {
        return {
            name: this.name,
            image: this.image,
            numMembers: this.members.size,
        };
    }
}
