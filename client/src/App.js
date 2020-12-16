import './App.css';
import TasksList from './components/TasksList'
import { updateTasks } from './sockets.js'
import { useState, useEffect } from "react"





function App() {
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        updateTasks(setTasks)
    }, [])
    return (
        <TasksList tasks={tasks}/>
    )
}

export default App;
