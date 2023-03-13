import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Badge, Button, IconButton } from '@mui/material'
import { ConnectionStatus } from '../types'

library.add(faUser)

export interface HeaderProps {
    userName: string
    connectionStatus: ConnectionStatus
    handleUserNameButtonClick: () => void
}

const Header = ({ userName, handleUserNameButtonClick, connectionStatus }: HeaderProps) => {
    return (
        <header className="body-font p-3 bg-black text-white">
            <div className="flex justify-between">
                <div></div>
                <div>
                    <Button onClick={handleUserNameButtonClick} sx={{ textTransform: 'none' }}>
                        <span>{userName.trim() !== '' ? userName : 'Welcome'}</span>
                    </Button>
                    <IconButton>
                        <Badge badgeContent=" " color={connectionStatus === 'connected' ? 'success' : 'error'}>
                            <Avatar>
                                <FontAwesomeIcon icon={faUser} />
                            </Avatar>
                        </Badge>
                    </IconButton>
                </div>
            </div>
        </header>
    )
}

export default Header
