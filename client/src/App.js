import './App.css';
import WorkSpace from './components/WorkSpace'
import { updateTasks } from './sockets.js'
import { useState, useEffect } from "react"





function App() {
    const [tasks, setTasks] = useState([])
    const [size, setSize] = useState({ w: 1000, h: 1000 })
    useEffect(() => {
        updateTasks(setTasks, setSize)
    }, [])
    return (
        <WorkSpace tasks={tasks} size={size} />
    )
}

export default App;
