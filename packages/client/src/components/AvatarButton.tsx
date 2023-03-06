import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'react-daisyui'

export interface AvatarProps {
    username: string
}

const AvatarButton = ({ username }: AvatarProps) => {
    return (
        <Avatar
            letters={username ? username.substring(0, 1) : ''}
            shape="circle"
            size="sm"
        ></Avatar>
    )
}

export default AvatarButton
