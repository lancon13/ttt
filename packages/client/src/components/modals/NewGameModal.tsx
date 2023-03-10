import { Game } from '@ttt/lib'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Divider, Form, Modal, Range } from 'react-daisyui'
import CloseButton from '../CloseButton'
import GameRenderer from '../GameRenderer'

export interface NewGameModalProps {
    visible: boolean
    onVisibleChange: (_visible: boolean) => void
    onCreateNewGameSubmit: (_params: { size: number; numInRow: number }) => void
}

const NewGameModal = ({ visible, onVisibleChange, onCreateNewGameSubmit }: NewGameModalProps) => {
    const [currentSize, setCurrentSize] = useState(3)
    const [currentNumInRow, setCurrentNumInRow] = useState(3)
    const [newGame, setNewGame] = useState(new Game())

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onCreateNewGameSubmit({ size: currentSize, numInRow: currentNumInRow })
    }

    useEffect(()=>{
        setNewGame(new Game({ size: currentSize, numInRow: currentNumInRow }))
    }, [currentSize, currentNumInRow])

    return (
        <Modal open={visible}>
            <Modal.Header className="font-bold flex items-center">
                <div className="grow">New Game</div>
                <CloseButton onClick={() => onVisibleChange(false)}></CloseButton>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <div className="flex items-center">
                        <div className="w-24">
                            <GameRenderer gameInstance={newGame}></GameRenderer>
                        </div>
                        <div className="grow px-3">
                            <Form.Label title="Size">{currentSize}</Form.Label>
                            <Range
                                min="3"
                                max="10"
                                value={currentSize}
                                onChange={(event) => {
                                    setCurrentSize(parseInt(event.target.value, 10))
                                    setCurrentNumInRow(Math.min(parseInt(event.target.value, 10), currentNumInRow))
                                }}
                            ></Range>

                            <Divider></Divider>

                            <Form.Label title="Number In Row To Win">{currentNumInRow}</Form.Label>
                            <Range
                                min="3"
                                max="10"
                                value={currentNumInRow}
                                onChange={(event) => {
                                    setCurrentNumInRow(Math.min(currentSize, parseInt(event.target.value, 10)))
                                }}
                            ></Range>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Actions>
                    <Button color="primary" type="submit">
                        Start
                    </Button>
                </Modal.Actions>
            </Form>
        </Modal>
    )
}

export default NewGameModal
