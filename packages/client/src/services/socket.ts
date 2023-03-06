import { io, Socket } from 'socket.io-client'

export const createSocket = () => {
    let socket: Socket | undefined
    const connect = () => {
        if (socket && socket.active) return
        socket = io({
            path: '/ttt-socket',
        })
    }
    const disconnect = () => {
        if (socket && !socket.disconnected) {
            socket.close()
        }
    }

    return {
        connect,
        disconnect,
    }
}
