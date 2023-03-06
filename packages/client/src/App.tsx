import { useEffect, useState } from 'react'
import { Button } from 'react-daisyui'
import Alert from './components/Alert'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import List from './components/List'
import UsernameModal from './components/UsernameModal'
import { createSocket, useData } from './services'
import { SystemState, DataState } from './types'

const App = () => {
    // Data
    const [data, setData] = useData()
    const [systemState, setSystemState] = useState<SystemState>({
        usernameModalVisible: false,
    })

    console.log(data)

    useEffect(() => {
        // Socket connection
        const socket = createSocket()
        socket.connect()
        return () => {
            socket.disconnect()
        }
    }, [])

    const newGame = () => {
        console.log('newGame')
        if (data.username.trim() === '')
            setSystemState({ ...systemState, usernameModalVisible: true })
    }

    return (
        <div className="App flex flex-col min-h-screen">
            <Header username={data.username}></Header>
            <Hero onStart={() => newGame()}></Hero>
            <div>{JSON.stringify(data)}</div>
            <Button color="primary">Click me!</Button>
            <div className="grow p-6">
                <Alert></Alert>
                <UsernameModal
                    visible={systemState.usernameModalVisible}
                ></UsernameModal>

                <List></List>
            </div>
            <div>Hello World</div>
            <Footer></Footer>
        </div>
    )
}

export default App
