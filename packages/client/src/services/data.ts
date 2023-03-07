import useLocalStorage from 'use-local-storage'
import { DataState } from '../types'
import { v4 as uuid } from 'uuid'

export const useData = () => {
    return useLocalStorage<DataState>(
        'ttt-data',
        {
            userId: uuid(),
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
