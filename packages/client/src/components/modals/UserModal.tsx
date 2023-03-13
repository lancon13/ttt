import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardContent, IconButton, Modal, TextField } from '@mui/material'
import { ChangeEvent, FormEvent, useState } from 'react'

export interface UserModalProps {
    visible: boolean
    userName: string
    handleUserNameChange: (_userName: string) => void
    handleCloseButtonClick: () => void
}

const UserModal = ({ visible, userName, handleCloseButtonClick, handleUserNameChange }: UserModalProps) => {
    const [currentUserName, setCurrentUserName] = useState(userName)
    const [error, setError] = useState<Error|undefined>(undefined)

    const handleSubmit = () => {
        if ( currentUserName.trim() !== '' )
            handleUserNameChange(currentUserName)
    }
    const handleUserNameInputChange = (event:ChangeEvent<HTMLInputElement>) => {
        setCurrentUserName(event.target.value)
        setError(event.target.value.trim() === '' ? new Error('Please enter your name') : undefined)
    }

    return (
        <Modal
            open={visible}
        >
            <Card style={{ background: 'none' }} className='max-w-xl w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' >
                <CardContent className="bg-gradient-to-b from-slate-300 to-slate-500">
                    <div className='flex items-center justify-end'>
                        <IconButton onClick={handleCloseButtonClick}>
                            <FontAwesomeIcon icon={faClose} className="text-black" />
                        </IconButton>
                    </div>
                    <div className="mx-auto">
                        <h2 className='font-bold text-2xl'>Welcome</h2>
                        <p>Please enter your name</p>
                        <br />
                        <TextField
                            className='w-full bg-blue-600/15'
                            error={!!error}
                            required
                            id="outlined-required"
                            label="Your Name"
                            color="primary"
                            variant="filled"
                            value={currentUserName}
                            onChange={handleUserNameInputChange}
                        />

                    </div>
                    <div className='mt-3 text-center'>
                        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                    </div>
                </CardContent>
            </Card>
        </Modal>
    )
}

export default UserModal
