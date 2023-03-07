import { Avatar, Badge, Button, Indicator, Tooltip } from 'react-daisyui'
import { ConnectionStatus } from '../types'

export interface AvatarProps {
    username: string
    connectionStatus: ConnectionStatus
    onClick: () => void
}

const AvatarButton = ({ username, onClick, connectionStatus }: AvatarProps) => {
    const connectionStatusMessage = (() => {
        switch (connectionStatus) {
            case 'connected':
                return `${username} | Connected`
            case 'disconnected':
                return `${username} | Disconnected`
            case 'connecting':
                return `${username} | Connecting`
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
        <div>
            <Tooltip message={connectionStatusMessage} position="left">
                <Button onClick={onClick} shape="circle" color="primary">
                    <Avatar letters={username ? username.substring(0, 1) : ''} shape="circle" size="xs"></Avatar>
                </Button>
            </Tooltip>
            <Badge color={connectionStatusColor} size="sm" className="top-2 right-2 absolute"></Badge>
        </div>
    )
}

export default AvatarButton
