import React from 'react'
import AvatarButton from './AvatarButton'

export interface HeaderProps {
    username: string
}

const Header = ({ username }: HeaderProps) => {
    return (
        <header className="flex items-center p-3 absolute w-full">
            <div className="grow"></div>
            <AvatarButton username={username}></AvatarButton>
        </header>
    )
}

export default Header
