const isUserActive = (activeConnections, userId) => {
    for (const ws of activeConnections.keys()) {
        if (ws.userId && ws.userId === userId) {
            return true;
        }
    }
    return false;
};

module.exports = { isUserActive };