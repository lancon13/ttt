import { GameState } from '@ttt/lib'
import { useEffect, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import NewGameModal from './components/NewGameModal'
import PlayGameModal from './components/PlayGameModal'
import UserModal from './components/UserModal'
import { createGameClient, useData } from './services'
import { SystemState } from './types'

const game = createGameClient()

const App = () => {
    // Data
    const [dataState, setDataState] = useData()
    const [systemState, setSystemState] = useState<SystemState>({
        isStartingNewGame: false,
        isLoading: false,

        connectionStatus: 'disconnected',

        userModalVisible: false,
        newGameModalVisible: false,
    })
    const [games, setGames] = useState<{ gameId: string; gameState: GameState }[]>([])
    const [currentGame, setCurrentGame] = useState<{ gameId: string; gameState: GameState } | undefined>(undefined)

    // Socket connection
    useEffect(() => {
        game.connect(dataState.user)
        game.eventEmitter.on('connect', () => {
            setSystemState({ ...systemState, connectionStatus: 'connected' })
        })
        game.eventEmitter.on('disconnect', () => {
            setSystemState({ ...systemState, connectionStatus: 'disconnected' })
        })
        game.eventEmitter.on('listGames', (games: Map<string, GameState>) => {
            setGames(Array.from(games, ([gameId, gameState]) => ({ gameId, gameState })))
        })
        game.eventEmitter.on('error', (error: Error) => {
            console.error(error)
        })

        return () => {
            game.disconnect()
        }
    }, [dataState])

    // Event handlers
    const onStartClick = () => {
        systemState.isStartingNewGame = true
        if (dataState.user.name.trim() === '') systemState.userModalVisible = true
        else systemState.newGameModalVisible = true
        setSystemState({ ...systemState })
    }
    const onAvatarButtonClick = () => {
        setSystemState({
            ...systemState,
            isStartingNewGame: false,
            userModalVisible: true,
        })
    }
    const onUserNameChange = (userName: string) => {
        setDataState({ ...dataState, user: { ...dataState.user, name: userName } })
        setSystemState({
            ...systemState,
            isStartingNewGame: false,
            userModalVisible: false,
            newGameModalVisible: systemState.isStartingNewGame,
        })
    }
    const onCreateNewGameSubmit = async ({ size, numInRow }: { size: number; numInRow: number }) => {
        try {
            const gameId = await game.newGame({ size, numInRow })
            const gameState = await game.joinGame({ gameId, asPlayer: true })
            setCurrentGame({ gameId, gameState })
            setSystemState({ ...systemState, newGameModalVisible: false })
        } catch (error) {
            game.eventEmitter.emit('error', error)
        }
    }
    const onQuitGameSubmit = async () => {
        try {
            if (currentGame) await game.quitGame({ gameId: currentGame?.gameId || '' })
            setCurrentGame(undefined)
        } catch (error) {
            game.eventEmitter.emit('error', error)
        }
    }

    return (
        <div className="App flex flex-col min-h-screen">
            {dataState.user.name.trim() !== '' ? (
                <Header
                    userName={dataState.user.name}
                    connectionStatus={systemState.connectionStatus}
                    onAvatarButtonClick={onAvatarButtonClick}
                ></Header>
            ) : (
                ''
            )}

            <Hero onStartClick={onStartClick}></Hero>

            <div>{JSON.stringify(dataState)}</div>
            <div className="grow p-6">
                {/* <Alert></Alert> */}

                <UserModal
                    visible={systemState.userModalVisible}
                    userName={dataState.user.name}
                    onVisibleChange={(visible: boolean) =>
                        setSystemState({
                            ...systemState,
                            isStartingNewGame: false,
                            userModalVisible: visible,
                        })
                    }
                    onUserNameChange={onUserNameChange}
                ></UserModal>

                <NewGameModal
                    visible={systemState.newGameModalVisible}
                    onVisibleChange={(visible: boolean) =>
                        setSystemState({
                            ...systemState,
                            newGameModalVisible: visible,
                        })
                    }
                    onCreateNewGameSubmit={onCreateNewGameSubmit}
                ></NewGameModal>

                <PlayGameModal game={currentGame} onQuitGameSubmit={onQuitGameSubmit}></PlayGameModal>

                {/* <List></List> */}
                <br />
                <ul>
                    {games.map((game, index) => {
                        return <li key={index}>{JSON.stringify(game)}</li>
                    })}
                </ul>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default App
