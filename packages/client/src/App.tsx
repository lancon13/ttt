import { CellState, Game, GameState, Position } from '@ttt/lib'
import { useEffect, useState } from 'react'
import { Card } from 'react-daisyui'
import EmptyGameList from './components/EmptyGameList'
import Footer from './components/Footer'
import GameCard from './components/GameCard'
import Header from './components/Header'
import Hero from './components/Hero'
import NewGameModal from './components/modals/NewGameModal'
import PlayGameModal from './components/modals/PlayGameModal'
import UserModal from './components/modals/UserModal'
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
    const [games, setGames] = useState<{ gameId: string; game: Game }[]>([])

    // Socket connection
    useEffect(() => {
        game.connect(dataState.user)
        game.eventEmitter.on('connect', () => {
            setSystemState({ ...systemState, connectionStatus: 'connected' })

            // First connect
            if (dataState.game && dataState.game.gameId) {
                const fetchData = async () => {
                    const gameId = dataState.game?.gameId as string
                    const asPlayer = dataState.game?.asPlayer as boolean
                    const gameState = await game.getGame(gameId)
                    if (!gameState)
                        throw new Error('Game state not found')
                    setDataState({ ...dataState, game: { gameId, gameState, asPlayer } })
                    await game.joinGame({ gameId, asPlayer })
                }
                fetchData().catch(() => {
                    setDataState({ ...dataState, game: undefined })
                })
            }
        })
        game.eventEmitter.on('disconnect', () => {
            setSystemState({ ...systemState, connectionStatus: 'disconnected' })
        })
        game.eventEmitter.on('listGames', (games: Map<string, GameState>) => {
            setGames(
                Array.from(games, ([gameId, gameState]) => {
                    return {
                        gameId,
                        game: Game.import(gameState),
                    }
                })
            )
        })
        game.eventEmitter.on('refreshGame', ({ gameState }:{ gameState: GameState }) => {
            const game = dataState.game ? { ...dataState.game } : undefined
            if( game ) {
                game.gameState = gameState
                setDataState({ ...dataState, game: { ...game } })
            }
        })
        game.eventEmitter.on('error', (error: Error) => {
            console.error(error)
        })

        return () => {
            game.disconnect()
        }
    }, [dataState.user])

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
            setDataState({ ...dataState, game: { gameId, gameState, asPlayer: true } })
            setSystemState({ ...systemState, newGameModalVisible: false })
        } catch (error) {
            game.eventEmitter.emit('error', error)
        }
    }
    const onQuitGameSubmit = async () => {
        try {
            if (dataState.game) await game.quitGame({ gameId: dataState.game?.gameId || '', asPlayer: dataState.game?.asPlayer })
            setDataState({ ...dataState, game: undefined })
        } catch (error) {
            game.eventEmitter.emit('error', error)
        }
    }
    const onJoinAsPlayerButtonClick = async (gameId: string) => {
        const gameState = await game.joinGame({ gameId, asPlayer: true })
        setDataState({ ...dataState, game: { gameId, gameState, asPlayer: true } })
    }
    const onJoinAsOpponentButtonClick = async (gameId: string) => {
        const gameState = await game.joinGame({ gameId, asPlayer: false })
        setDataState({ ...dataState, game: { gameId, gameState, asPlayer: false } })
    }
    const onPositionClick = async (position: Position) => {
        if ( dataState.game && dataState.game.gameState.turn === (dataState.game.asPlayer ? CellState.PLAYER : CellState.OPPONENT) ) {
            const gameState = await game.moveGame({ gameId: dataState.game?.gameId, position })
            setDataState({ ...dataState, game: { gameId:dataState.game?.gameId, gameState, asPlayer: dataState.game?.asPlayer } })
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

                <PlayGameModal game={dataState.game} onQuitGameSubmit={onQuitGameSubmit} onPositionClick={onPositionClick}></PlayGameModal>

                {games.length === 0 ? (
                    <EmptyGameList></EmptyGameList>
                ) : (
                    games.map(({ gameId, game }) => {
                        return (
                            <GameCard
                                key={gameId}
                                gameId={gameId}
                                game={game}
                                onJoinAsOpponentButtonClick={() => onJoinAsOpponentButtonClick(gameId)}
                                onJoinAsPlayerButtonClick={() => onJoinAsPlayerButtonClick(gameId)}
                            ></GameCard>
                        )
                    })
                )}
            </div>
            <Footer></Footer>
        </div>
    )
}

export default App
