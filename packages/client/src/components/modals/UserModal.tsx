import { FormEvent, useState } from 'react'
import { Button, Form, Input, Modal } from 'react-daisyui'
import CloseButton from '../CloseButton'

export interface UserModalProps {
    visible: boolean
    userName: string
    onVisibleChange: (_visible: boolean) => void
    onUserNameChange: (_userName: string) => void
}

const UserModal = ({ visible, userName, onVisibleChange, onUserNameChange }: UserModalProps) => {
    const [currentUserName, setCurrentUserName] = useState(userName)

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (currentUserName.trim() !== '') onUserNameChange(currentUserName)
    }

    return (
        <Modal open={visible}>
            <Modal.Header className="font-bold flex items-center">
                <div className="grow">Your Name</div>
                <CloseButton onClick={() => onVisibleChange(false)}></CloseButton>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <p className="mb-3">Hello And Welcome! Please enter your name</p>
                    <Form.Label title="Name"></Form.Label>
                    <Input
                        className="w-full"
                        key="name"
                        placeholder=""
                        value={currentUserName}
                        bordered={true}
                        color="primary"
                        onChange={(event) => setCurrentUserName(event.currentTarget.value)}
                    />
                </Modal.Body>

                <Modal.Actions>
                    <Button color="primary" disabled={currentUserName.trim() === ''} type="submit">
                        OK
                    </Button>
                </Modal.Actions>
            </Form>
        </Modal>
    )
}

export default UserModal
