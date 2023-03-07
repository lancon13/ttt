import { GameState } from '@ttt/lib'
import { useEffect, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import List from './components/List'
import NewGameModal from './components/NewGameModal'
import UsernameModal from './components/UsernameModal'
import { createGameClient, useData } from './services'
import { ServerData, SystemState } from './types'

const game = createGameClient()

const App = () => {
    // Data
    const [dataState, setDataState] = useData()
    const [systemState, setSystemState] = useState<SystemState>({
        isStartingNewGame: false,
        isLoading: false,

        connectionStatus: 'disconnected',

        usernameModalVisible: false,
        newGameModalVisible: false,
    })
    const [games, setGames] = useState<{ gameId: string; gameState: GameState }[]>([])

    // Socket connection
    useEffect(() => {
        game.connect()
        game.eventEmitter.on('connect', () => {
            setSystemState({ ...systemState, connectionStatus: 'connected' })
        })
        game.eventEmitter.on('disconnect', () => {
            setSystemState({ ...systemState, connectionStatus: 'disconnected' })
        })
        game.eventEmitter.on('server:data', async (params: ServerData) => {
            switch (params.type) {
                case 'newGameCreated':
                    try {
                        const games = await game.listGames()
                        setGames(Array.from(games, ([gameId, gameState]) => ({ gameId, gameState })))
                    } catch (error) {
                        console.error(error)
                    }
                    break
            }
        })
        return () => {
            game.disconnect()
        }
    }, [])

    // Event handlers
    const onOpenStartNewGameModal = () => {
        systemState.isStartingNewGame = true
        if (dataState.username.trim() === '') systemState.usernameModalVisible = true
        else systemState.newGameModalVisible = true
        setSystemState({ ...systemState })
    }
    const onStartNewGame = async ({ size, numInRow }: { size: number; numInRow: number }) => {
        try {
            const res = await game.newGame({ size, numInRow })

            // Redirect to the new game
            console.log(res)
            setSystemState({ ...systemState, newGameModalVisible: false })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="App flex flex-col min-h-screen">
            {dataState.username.trim() !== '' ? (
                <Header
                    username={dataState.username}
                    connectionStatus={systemState.connectionStatus}
                    onAvatarButtonClick={() =>
                        setSystemState({
                            ...systemState,
                            isStartingNewGame: false,
                            usernameModalVisible: true,
                        })
                    }
                ></Header>
            ) : (
                ''
            )}

            <Hero onStartClick={onOpenStartNewGameModal}></Hero>

            <div>{JSON.stringify(dataState)}</div>
            <div className="grow p-6">
                {/* <Alert></Alert> */}

                <UsernameModal
                    visible={systemState.usernameModalVisible}
                    username={dataState.username}
                    onVisibleChange={(visible: boolean) =>
                        setSystemState({
                            ...systemState,
                            isStartingNewGame: false,
                            usernameModalVisible: visible,
                        })
                    }
                    onUsernameChange={(username: string) => {
                        setDataState({ ...dataState, username })
                        setSystemState({
                            ...systemState,
                            isStartingNewGame: false,
                            usernameModalVisible: false,
                            newGameModalVisible: systemState.isStartingNewGame,
                        })
                    }}
                ></UsernameModal>

                <NewGameModal
                    visible={systemState.newGameModalVisible}
                    onVisibleChange={(visible: boolean) =>
                        setSystemState({
                            ...systemState,
                            newGameModalVisible: visible,
                        })
                    }
                    onStartNewGame={onStartNewGame}
                ></NewGameModal>

                {/* <List></List> */}
                <div>{JSON.stringify(games)}</div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default App
