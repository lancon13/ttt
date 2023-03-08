import { Game } from '@ttt/lib'
import { Button, Modal } from 'react-daisyui'
import GameRenderer from './GameRenderer'

export interface PlayGameModalProps {
    game: {
        gameId: string
        game: Game
        asPlayer: boolean
    } | undefined
    onQuitGameSubmit: () => void
}

const PlayGameModal = ({ game, onQuitGameSubmit }: PlayGameModalProps) => {
    return (
        <Modal className="w-11/12 max-w-5xl" open={!!game}>
            <Modal.Header className="font-bold flex items-center">
                <div className="grow">{game?.gameId}</div>
                {/* <CloseButton onClick={() => onVisibleChange(false)}></CloseButton> */}
            </Modal.Header>

            <Modal.Body className='flex flex-col'>
                <div>
                    <div>Size {game?.game.size} x {game?.game.size}</div>
                    <div>{game?.game.numInRow} in a row</div>
                </div>
                <div className='self-center'>
                    {game?.game ?<GameRenderer game={game.game}></GameRenderer> : ''}
                </div>
            </Modal.Body>

            <Modal.Actions>
                <Button color="primary" onClick={onQuitGameSubmit}>
                    Quit
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default PlayGameModal
