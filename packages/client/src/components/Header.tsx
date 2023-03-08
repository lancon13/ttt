import { ConnectionStatus } from '../types'
import AvatarButton from './AvatarButton'

export interface HeaderProps {
    userName: string
    connectionStatus: ConnectionStatus
    onAvatarButtonClick: () => void
}

const Header = ({ userName, onAvatarButtonClick, connectionStatus }: HeaderProps) => {
    return (
        <header className="flex items-center p-3 w-full absolute">
            <div className="grow text-right">
                <AvatarButton userName={userName} connectionStatus={connectionStatus} onClick={onAvatarButtonClick}></AvatarButton>
            </div>
        </header>
    )
}

export default Header
