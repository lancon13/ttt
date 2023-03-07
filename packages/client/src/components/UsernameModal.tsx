import { FormEvent, useState } from 'react'
import { Button, Form, Input, Modal } from 'react-daisyui'
import CloseButton from './CloseButton'

export interface UsernameModalProps {
    visible: boolean
    username: string
    onVisibleChange: (value: boolean) => void
    onUsernameChange: (value: string) => void
}

const UsernameModal = ({
    visible = true,
    username = '',
    onVisibleChange,
    onUsernameChange,
}: UsernameModalProps) => {
    const [currentUsername, setCurrentUsername] = useState(username)

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (currentUsername.trim() !== '') {
            onUsernameChange(currentUsername)
        }
    }

    return (
        <Modal open={visible}>
            <Modal.Header className="font-bold flex items-center">
                <div className="grow">Your Name</div>
                <CloseButton
                    onClick={() => onVisibleChange(false)}
                ></CloseButton>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <p className="mb-3">
                        Hello And Welcome! Please enter your name
                    </p>
                    <Form.Label title="Name"></Form.Label>
                    <Input
                        className="w-full"
                        key="name"
                        placeholder=""
                        value={currentUsername}
                        bordered={true}
                        color="primary"
                        onChange={(value) =>
                            setCurrentUsername(value.currentTarget.value)
                        }
                    />
                </Modal.Body>

                <Modal.Actions>
                    <Button
                        color="primary"
                        disabled={currentUsername.trim() === ''}
                        type="submit"
                    >
                        OK
                    </Button>
                </Modal.Actions>
            </Form>
        </Modal>
    )
}

export default UsernameModal
