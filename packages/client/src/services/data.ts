import useLocalStorage from 'use-local-storage'
import { DataState } from '../types'

export const useData = () => {
    return useLocalStorage<DataState>(
        'ttt-data',
        {
            username: '',
        },
        {
            serializer: (obj: unknown) => {
                return JSON.stringify(obj)
            },
            parser: (str: string) => {
                return JSON.parse(str)
            },
            logger: (error: Error) => {
                // Do some logging
                console.log(error)
            },
            // syncData: false, // You can disable cross context sync
        }
    )
}
