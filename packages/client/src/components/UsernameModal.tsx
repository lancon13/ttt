import { useState } from 'react'
import { Button, Input, Modal } from 'react-daisyui'

export interface UsernameModalProps {
    visible: boolean
}

const UsernameModal = ({ visible = true }: UsernameModalProps) => {
    const [name, setName] = useState('Hello')

    const close = () => {
        console.log('closing')
    }

    return (
        <Modal open={visible}>
            <Modal.Header className="font-bold flex items-center">
                <div className="grow">Your Name</div>
                <Button shape="circle" size="sm" onClick={close}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </Button>
            </Modal.Header>

            <Modal.Body>
                <div className="mb-3">
                    Hello And Welcome! Please enter your name
                </div>
                <Input
                    className="w-full"
                    key="name"
                    placeholder="Your Name"
                    value={name}
                    bordered={true}
                    color="primary"
                    onChange={(value) => setName(value.currentTarget.value)}
                />
            </Modal.Body>

            <Modal.Actions>
                <Button color="primary" disabled={name.trim() === ''}>
                    OK
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default UsernameModal
