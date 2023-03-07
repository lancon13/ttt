import { Button, Tooltip } from 'react-daisyui'
import { ConnectionStatus } from '../types'
import AvatarButton from './AvatarButton'

export interface HeaderProps {
    username: string
    connectionStatus: ConnectionStatus
    onAvatarButtonClick: () => void
}

const Header = ({ username, onAvatarButtonClick, connectionStatus }: HeaderProps) => {
    const connectionStatusMessage = (() => {
        switch (connectionStatus) {
            case 'connected':
                return 'Connected'
            case 'disconnected':
                return 'Disconnected'
            case 'connecting':
                return 'Connecting'
        }
    })()

    const connectionStatusColor = (() => {
        switch (connectionStatus) {
            case 'connected':
                return 'success'
            case 'disconnected':
                return 'error'
            case 'connecting':
                return 'warning'
        }
    })()

    return (
        <header className="flex items-center p-3 w-full absolute">
            <div className="grow text-right">
                <AvatarButton username={username} connectionStatus={connectionStatus} onClick={onAvatarButtonClick}></AvatarButton>
            </div>
        </header>
    )
}

export default Header
