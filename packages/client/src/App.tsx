import { Game, GameState, Position } from '@ttt/lib'
import { useEffect, useState } from 'react'
import EmptyGameItem from './components/EmptyGameItem'
import GameItem from './components/GameItem'
import GameView from './components/GameView'
import Header from './components/Header'
import Hero from './components/Hero'
import GameModal from './components/modals/GameModal'
import UserModal from './components/modals/UserModal'
import { createConnection, useData } from './services'
import { useSystem } from './services/system'

const connection = createConnection()
const App = () => {

    const [dataState, setDataState] = useData()
    const [systemData, setSystemData] = useSystem()

    const [games, setGames] = useState<{gameId:string, game:Game}[]>([])
    const showError = (error:Error) => {
        console.error(error)
    }

    useEffect(() => {
        const run = async () => {
            await connection.connect(dataState.user)
            const games = await connection.listGames()
            const currentGames = games.map(g => ({ gameId:g.gameId, game: Game.import(g.gameState) }))
            currentGames.reverse()
            setGames(currentGames)
        }
        run().catch((error:Error)=>{
            showError(error)
        })

        return () => {
            connection.disconnect().catch((error:Error)=>{
                showError(error)
            })
        }
    }, [dataState.user])

    connection.eventEmitter.on('connect', ()=>{
        setSystemData({ ...systemData, connectionStatus:'connected' })
    })
    connection.eventEmitter.on('disconnect', ()=>{
        setSystemData({ ...systemData, connectionStatus:'disconnected' })
    })
    connection.eventEmitter.on('error', (error:Error)=>{
        showError(error as Error)
    })

    connection.eventEmitter.on('listGames', (games:{gameId:string, gameState:GameState}[])=>{
        const currentGames = games.map(g => ({ gameId:g.gameId, game: Game.import(g.gameState) }))
        currentGames.reverse()
        setGames(currentGames)
    })

    const newGame = async () =>{
        try {
            const { gameId } = await connection.newGame(3, 3)
            await joinGame(gameId, true)
            setDataState({ ...dataState, gameId: gameId })
        } catch(error) {
            showError(error as Error)
        }
    }
    const joinGame = async (gameId:string, asPlayer:boolean) => {
        try {
            connection.joinGame(gameId, asPlayer)
            setDataState({ ...dataState, gameId: gameId })
        } catch(error) {
            showError(error as Error)
        }
    }
    const quitGame = async (gameId:string, asPlayer:boolean) => {
        try {
            connection.quitGame(gameId, asPlayer)
            setDataState({ ...dataState, gameId: undefined })
        } catch(error) {
            showError(error as Error)
        }
    }
    const quitCurrentGame = async () => {
        try {
            const currentGameId = getCurrentGameId() || ''
            const currentGame = getCurrentGame()
            if( currentGameId !== '' && currentGame) {
                const asPlayer = currentGame.player?.uid === dataState.user.uid
                await quitGame(currentGameId, asPlayer)
            }
        } catch(error) {
            showError(error as Error)
        }
    }
    const moveCurrentGame = async (pos:Position) => {
        try {
            const currentGameId = getCurrentGameId() || ''
            const currentGame = getCurrentGame()
            if( currentGameId !== '' && currentGame) {
                const asPlayer = currentGame.player?.uid === dataState.user.uid
                await connection.moveGame(currentGameId, pos, asPlayer)
            }
        } catch(error) {
            showError(error as Error)
        }
    }

    const getCurrentGameId = ():string|undefined => {
        return dataState.gameId
    }
    const getCurrentGame = ():Game|undefined => {
        return games.find(g => g.gameId === dataState.gameId)?.game
    }
    // const isGameJoined = (gameId:string, asPlayer:boolean):boolean => {
    //     return !!games.find(g => g.gameId === gameId && ((asPlayer && g.game.player?.uid == dataState.user.uid) || (!asPlayer && g.game.opponent?.uid === dataState.user.uid)) )
    // }


    // Event handlers
    const handleHeaderUserNameButtonClick = () =>{
        setSystemData({ ...systemData, isUserModalEnabled: true })
    }
    const handleNewGameButtonClick = () => {
        newGame()
    }
    const handleUserNameChange = (userName:string) => {
        setDataState({ ...dataState, user:{ uid:dataState.user.uid, name:userName } })
    }
    const handleUserNameModalCloseButtonClick= () =>{
        setSystemData({ ...systemData, isUserModalEnabled: false })
    }
    const handleGameModalCloseButtonClick = () => {
        quitCurrentGame()
    }
    const handleGameModalQuitButtonClick = () => {
        quitCurrentGame()
    }
    const handleJoinGameAsPlayerButtonClick = (gameId:string) => {
        joinGame(gameId, true)
    }
    const handleJoinGameAsOpponentButtonClick = (gameId:string) => {
        joinGame(gameId, false)
    }
    const handleGameModalPositionChange = (pos:Position) => {
        moveCurrentGame(pos)
    }

    return (
        <div className="flex flex-col">
            <UserModal userName={dataState.user.name} visible={systemData.isUserModalEnabled} handleUserNameChange={(userName:string) => {
                handleUserNameChange(userName)
                handleUserNameModalCloseButtonClick()
            }} handleCloseButtonClick={handleUserNameModalCloseButtonClick} ></UserModal>
            {
                <GameModal user={dataState.user} game={getCurrentGame()} handleCloseButtonClick={handleGameModalCloseButtonClick} handleQuitGameButtonClick={handleGameModalQuitButtonClick} handlePositionChange={handleGameModalPositionChange}></GameModal>
            }

            <Header userName={dataState.user.name} connectionStatus={'connected'} handleUserNameButtonClick={handleHeaderUserNameButtonClick}></Header>
            <Hero handleNewGameButtonClick={handleNewGameButtonClick} ></Hero>

            <section className='bg-gradient-to-t from-gray-900 to-gray-70 py-6'>
                <div className='flex flex-col p-6 mx-auto max-w-5xl '>
                    {
                        games.length === 0 ?<EmptyGameItem handleNewGameButtonClick={handleNewGameButtonClick}></EmptyGameItem>:games.map(({ gameId, game })=>{
                            return (
                                <GameItem key={gameId} game={game} gameId={gameId} handleJoinGameAsPlayerButtonClick={() => handleJoinGameAsPlayerButtonClick(gameId)} handleJoinGameAsOpponentButtonClick={() => handleJoinGameAsOpponentButtonClick(gameId)}  >
                                    <GameView game={game}></GameView>
                                </GameItem>
                            )
                        })
                    }

                </div>
            </section>
        </div>
    )
}

export default App
