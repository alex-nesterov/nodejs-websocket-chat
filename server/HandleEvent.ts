import Chatroom from "./Chatroom";

export default (client, clientManager, chatroomManager) => {
    function ensureExists(getter, rejectionMessage) {
        return new Promise(function(resolve, reject) {
            const res = getter();
            return res
                ? resolve(res)
                : reject(rejectionMessage);
        });
    }

    function ensureUserSelected(clientId) {
        return ensureExists(
            () => clientManager.getUserByClientId(clientId),
            "select user first",
        );
    }

    function ensureValidChatroom(chatroomName) {
        return ensureExists(
            () => chatroomManager.getChatroomByName(chatroomName),
            `invalid chatroom name: ${chatroomName}`,
        );
    }

    function ensureValidChatroomAndUserSelected(chatroomName) {
        return Promise.all([
            ensureValidChatroom(chatroomName),
            ensureUserSelected(client.id),
        ])
            .then(([chatroom, user]) => Promise.resolve({ chatroom, user }));
    }

    function handleEvent(chatroomName, createEntry) {
        return ensureValidChatroomAndUserSelected(chatroomName)
            .then( ({ chatroom, user }) => {
                // append event to chat history
                const entry = { user, ...createEntry() };
                (chatroom as Chatroom).addEntry(entry);

                // notify other clients in chatroom
                (chatroom as Chatroom).broadcastMessage({ chat: chatroomName, ...entry });
                return chatroom;
            });
    }

    return handleEvent;
};
