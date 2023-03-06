import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="App">
            <div>Hello World {count}</div>

            <button className="btn">Button</button>

        </div>
    )
}

export default App
