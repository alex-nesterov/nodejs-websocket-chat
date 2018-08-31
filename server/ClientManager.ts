const userTemplates = require("./../config/users");

export default class ClientManager {

    public clients = new Map();

    public addClient(client) {
        this.clients.set(client.id, { client });
    }

    public registerClient(client, user) {
        this.clients.set(client.id, { client, user });
    }

    public removeClient(client) {
        this.clients.delete(client.id);
    }

    public getAvailableUsers() {
        const usersTaken = new Set(
            Array.from(this.clients.values())
                .filter((c) => c.user)
                .map((c) => c.user.name),
        );
        return userTemplates
            .filter((u) => !usersTaken.has(u.name));
    }

    public isUserAvailable(userName) {
        return this.getAvailableUsers().some((u) => u.name === userName);
    }

    public getUserByName(userName) {
        return userTemplates.find((u) => u.name === userName);
    }

    public getUserByClientId(clientId) {
        return (this.clients.get(clientId) || {}).user;
    }

}
