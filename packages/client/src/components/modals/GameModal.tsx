import { library } from '@fortawesome/fontawesome-svg-core'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Button, Card, CardContent, IconButton, Modal } from '@mui/material'
import { CellState, findWinningIndexesCombination, Game, Position, User } from '@ttt/lib'
import GameView from '../GameView'

library.add(faClose)

export interface GameModalProps {
    user: User
    game: Game | undefined
    handleCloseButtonClick: ()=>void
    handleQuitGameButtonClick: ()=>void
    handlePositionChange: (_pos:Position)=>void
}

const GameModal = ({ user, game, handleCloseButtonClick, handleQuitGameButtonClick, handlePositionChange }:GameModalProps) => {

    const playerUid = game?.player?.uid
    const opponentUid = game?.opponent?.uid
    const isYourTurn = () => {
        return (game?.turn === CellState.PLAYER && playerUid === user.uid) || (game?.turn === CellState.OPPONENT && opponentUid === user.uid)
    }
    const playerWins = game && findWinningIndexesCombination(CellState.PLAYER, game.cells, game.size, game.numInRow)
    const opponentWins = game && findWinningIndexesCombination(CellState.OPPONENT, game.cells, game.size, game.numInRow)

    return (
        <Modal
            open={!!game}
        >
            <Card style={{ background: 'none' }} className='max-w-xl w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' >
                {/* <CardContent className="bg-gradient-to-b from-white/75 to-white/25"> */}
                <CardContent className="bg-gradient-to-b from-slate-300 to-slate-500">
                    <div className='flex items-center justify-end'>
                        <IconButton onClick={handleCloseButtonClick}>
                            <FontAwesomeIcon icon={faClose} className="text-black" />
                        </IconButton>
                    </div>
                    <div className="max-w-xs mx-auto">
                        <GameView game={game ?? new Game()} handlePositionClick={(pos)=>{
                            if ( isYourTurn() )
                                handlePositionChange(pos)
                        }}></GameView>
                    </div>
                    { playerWins ? <Alert className='my-6' severity="info">Player Win</Alert> : ''}
                    { opponentWins ? <Alert className='my-6' severity="error">Opponent Win</Alert> : '' }
                    <div className='mt-3 text-center'>
                        <div className='my-6'>
                            <div className='px-3 py-2 w-32 mx-auto rounded-xl shadow-lg  bg-white font-black'>{ isYourTurn() ? 'Your Turn' : 'Other User Turn'}</div>
                        </div>
                        <Button variant='contained' onClick={handleQuitGameButtonClick}>Quit Game</Button>
                    </div>
                </CardContent>
            </Card>
        </Modal>
    )
}

export default GameModal
