import { useState } from 'react'
import { SystemState } from '../types'

export const useSystem = () =>{
    return useState<SystemState>({
        connectionStatus: 'disconnected',
        isUserModalEnabled: false
    })
}
