import { Button } from '@mui/material'
import React from 'react'

export interface EmptyGameItemProps {
    handleNewGameButtonClick: () => void
}


const EmptyGameItem = ({ handleNewGameButtonClick }:EmptyGameItemProps) => {
    return (
        <div className='m-6 text-white text-center'>
            <div className='mb-3'>No active game in the server, Let&apos;s create new game</div>
            <img className='w-12 mx-auto mb-6' src="icons/empty.svg" />
            <Button onClick={handleNewGameButtonClick} color='primary' variant="contained">New Game</Button>
        </div>
    )
}

export default EmptyGameItem
