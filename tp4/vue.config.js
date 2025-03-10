module.exports = {
  devServer: {
    client: {
      webSocketURL: 'wss://0.0.0.0/ws', // Forces secure WebSocket (wss://)
    },
  },
};