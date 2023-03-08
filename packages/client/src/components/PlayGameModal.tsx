import { GameState } from '@ttt/lib'
import React from 'react'
import { Button, Modal } from 'react-daisyui'
import CloseButton from './CloseButton'

export interface PlayGameModalProps {
    game: {
        gameId: string
        gameState: GameState
    } | undefined
    onQuitGameSubmit: () => void
}

const PlayGameModal = ({ game, onQuitGameSubmit }: PlayGameModalProps) => {
    return (
        <Modal open={!!game}>
            <Modal.Header className="font-bold flex items-center">
                <div className="grow">Game {game?.gameId}</div>
                {/* <CloseButton onClick={() => onVisibleChange(false)}></CloseButton> */}
            </Modal.Header>

            <Modal.Body>
                <div>{JSON.stringify(game)}</div>
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
