import { CellState, Game, GameState, Position } from '@ttt/lib'
import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-daisyui'
import GameRenderer from '../GameRenderer'

export interface PlayGameModalProps {
    onQuitGameSubmit: () => void
    onPositionClick: (_pos:Position) => void
    game: {
        gameId: string
        gameState: GameState
        asPlayer: boolean
    } | undefined
}

const PlayGameModal = ({ game, onQuitGameSubmit, onPositionClick }: PlayGameModalProps) => {
    const [gameInstance, setGameInstance] = useState<Game | undefined>(undefined)
    useEffect(() => {
        setGameInstance(game ? Game.import(game.gameState) : undefined)
    }, [game])

    return (
        <Modal className="w-11/12 max-w-5xl" open={!!game}>
            <Modal.Header className="font-bold flex items-center">
                <div className="grow">{game?.gameId}</div>
                {/* <CloseButton onClick={() => onVisibleChange(false)}></CloseButton> */}
            </Modal.Header>

            <Modal.Body className="flex flex-col">
                <div>
                    <div>
                        Size {gameInstance?.size} x {gameInstance?.size}
                    </div>
                    <div>{gameInstance?.numInRow} in a row</div>
                    <div>{gameInstance?._turn === CellState.PLAYER ? 'PLAYER TURN' : 'OPPONENT TURN' }</div>
                </div>
                <div className="self-center">{gameInstance ? <GameRenderer gameInstance={gameInstance} onPositionClick={onPositionClick}></GameRenderer> : ''}</div>
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
