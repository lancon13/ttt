import { Button, Card, CardContent } from '@mui/material'
import { Game } from '@ttt/lib'
import { PropsWithChildren } from 'react'

export interface GameItemProps extends PropsWithChildren {
    gameId: string
    game: Game
    handleJoinGameAsPlayerButtonClick: () => void
    handleJoinGameAsOpponentButtonClick: () => void
}

const GameItem = ({ gameId, game, children, handleJoinGameAsPlayerButtonClick, handleJoinGameAsOpponentButtonClick }: GameItemProps) => {

    return (
        <Card variant="outlined" sx={{ minWidth: 275 }} className="mb-6 drop-shadow-md bg-gradient-to-b from-slate-100 to-slate-200">
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center">
                    <div className="sm:w-1/4 sm:mr-6 sm:mb-0 mb-6 justify-center flex-grow">{children}</div>
                    <div className="sm:w-3/4 flex flex-col">
                        <div className='text-center pb-6'>
                            <h3 className="font-semibold">Game UID: {gameId}</h3>

                        </div>
                        <div className='flex-grow max-w-sm mx-auto'>
                            <div className='grid grid-cols-2 gap-3 '>
                                <Button variant="contained" onClick={handleJoinGameAsPlayerButtonClick} sx={{ textTransform: 'none' }} disabled={!!game.player?.uid}>{ game.player ? `${game.player.name} Joined` : 'Join as Player' }</Button>
                                <Button variant="contained" onClick={handleJoinGameAsOpponentButtonClick} sx={{ textTransform: 'none' }} disabled={!!game.opponent?.uid}>{ game.opponent ? `${game.opponent.name} Joined` : 'Join as Opponent' }</Button>
                            </div>

                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default GameItem
