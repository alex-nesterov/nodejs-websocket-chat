import Chatroom from "./Chatroom";
import HandleEvent from "./HandleEvent";

export default (client, clientManager, chatroomManager) => {
    const handleEvent = HandleEvent(client, clientManager, chatroomManager);

    function handleRegister(userName: String, callback) {
        if (!clientManager.isUserAvailable(userName)) {
            return callback("user is not available");
        }

        const user = clientManager.getUserByName(userName);
        clientManager.registerClient(client, user);

        return callback(null, user);
    }

    function handleJoin(chatroomName: String, callback) {
        const createEntry = () => ({ event: `joined ${chatroomName}` });

        handleEvent(chatroomName, createEntry)
            .then((chatroom: Chatroom) => {
                chatroom.addUser(client);

                // send chat history to client
                callback(null, chatroom.getChatHistory());
            })
            .catch(callback);
    }

    function handleLeave(chatroomName: String, callback) {
        const createEntry = () => ({ event: `left ${chatroomName}` });

        handleEvent(chatroomName, createEntry)
            .then((chatroom: Chatroom) => {
                chatroom.removeUser(client.id);
                callback(null);
            })
            .catch(callback);
    }

    function handleMessage({ chatroomName = "", message = "" } = {}, callback) {
        const createEntry = () => ({ message });

        handleEvent(chatroomName, createEntry)
            .then(() => callback(null))
            .catch(callback);
    }

    function handleGetChatrooms(_, callback) {
        return callback(null, chatroomManager.serializeChatrooms());
    }

    function handleGetAvailableUsers(_, callback) {
        return callback(null, clientManager.getAvailableUsers());
    }

    function handleDisconnect() {
        // remove user profile
        clientManager.removeClient(client);
        // remove member from all chatrooms
        chatroomManager.removeClient(client);
    }

    return {
        handleRegister,
        handleJoin,
        handleLeave,
        handleMessage,
        handleGetChatrooms,
        handleGetAvailableUsers,
        handleDisconnect,
    };
};
